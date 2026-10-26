import { onMount, untrack } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import {
	notificationsBG,
	closeNotificationsBG,
	updateNotificationReadStatus,
	removeNotification,
	markAllNotificationsRead,
	removeAllNotifications,
	type PublicNotificationResponse
} from '#lib/remotes/notifications.remote.js';

export type NotificationItem = PublicNotificationResponse;

// Akış kurulduğu andaki token'ı kullanır. Periyodik reconnect, gerçek kullanıcı istekleriyle yenilenen
// güncel token'ı akışa taşır (bu istek token'ı yenilemez, bkz. authRefresh.ts) ve listeyi tazeler.
const RECONNECT_INTERVAL_MS = 240_000;
// Komut bittikten sonra canlı güncelleme gelmezse (ör. değişiklik olmadı) gösterge en geç bu süre sonra kalkar. 2 saniye.
const SETTLE_FALLBACK_MS = 2_000;

// Bekleyen işlem anahtarları: satır işlemleri için bildirim id'si, toplu işlemler için sabitler.
export const PENDING_READ_ALL = 'all:read';
export const PENDING_REMOVE_ALL = 'all:remove';
export const PENDING_RECONNECT = 'reconnect';

type Options = {
	// Gerçekten yeni gelen okunmamış bildirimler (ör. toast göstermek için).
	onNew?: (items: NotificationItem[]) => void;
	// Komut hataları (ör. Update kuralı reddetti).
	onError?: (message: string) => void;
};

// Bildirimlerin canlı akışını ve işlemlerini yönetir. Bileşen başlatılırken çağrılmalıdır (onMount/$effect kullanır).
export function createNotificationStream({ onNew, onError }: Options = {}) {
	const connectionId = crypto.randomUUID();
	const live = notificationsBG({ connectionId });

	// Sunucu listeyi en yeni en üstte gönderir; filter sırayı korur.
	const all = $derived(live.current ?? []);
	const unread = $derived(all.filter((n) => !n.read));
	const read = $derived(all.filter((n) => n.read));

	onMount(() => {
		const reconnectInterval = setInterval(() => live.reconnect(), RECONNECT_INTERVAL_MS);
		// Bileşen yok olunca (SPA geçişi/çıkış) sunucudaki canlı bağlantıyı GC'yi beklemeden kapat.
		return () => {
			clearInterval(reconnectInterval);
			void closeNotificationsBG({ connectionId });
		};
	});

	// İşlem göstergesi komut bitince değil, sonucu canlı akıştan gelince kalkar; aksi halde eski durum bir an görünürdü.
	// Aynı anahtarla bekleyen işlem varken yenisi başlamaz (çift tıklama). Hata olursa gösterge kalkar ve bildirilir.
	const pending = new SvelteSet<string>();
	let settled: string[] = [];
	const clearPending = (key: string) => {
		pending.delete(key);
		settled = settled.filter((k) => k !== key);
	};
	const track = (key: string, action: () => Promise<unknown>) => {
		if (pending.has(key)) return;
		pending.add(key);
		action().then(
			() => {
				settled.push(key);
				setTimeout(() => clearPending(key), SETTLE_FALLBACK_MS);
			},
			(err: unknown) => {
				clearPending(key);
				onError?.((err as { body?: { message?: string } })?.body?.message ?? 'İşlem tamamlanamadı.');
			}
		);
	};

	// Yeni bildirim yalnızca:
	// - id daha önce görülmemişse (reconnect listeyi yeniden gönderdiğinde sahte bildirim olmasın)
	// - görülen en yeni kayıttan daha yeniyse (silme sonrası reconnect, listeye alttan eski bir kaydı soktuğunda olmasın)
	// İlk liste yalnızca görüldü olarak işaretlenir. `created` sabit biçimli UTC metni olduğu için metin karşılaştırması yeterli.
	let seenIds: Set<string> | null = null;
	let newestCreated = '';
	$effect(() => {
		const current = live.current;
		if (!current) return;
		untrack(() => {
			// Komutu bitmiş işlemlerin sonucu bu güncellemeyle geldi; göstergeleri kaldır.
			for (const key of settled) pending.delete(key);
			settled = [];
			const fresh = seenIds ? current.filter((n) => !n.read && !seenIds!.has(n.id) && n.created > newestCreated) : [];
			// Reaktif olmaması bilinçli: yalnızca bir sonraki karşılaştırma için tutulur, arayüze bağlı değil.
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			seenIds = new Set(current.map((n) => n.id));
			if (current[0] && current[0].created > newestCreated) newestCreated = current[0].created;
			if (fresh.length) onNew?.(fresh);
		});
	});

	return {
		connectionId,
		get all() {
			return all;
		},
		get unread() {
			return unread;
		},
		get read() {
			return read;
		},
		get ready() {
			return live.ready;
		},
		get loading() {
			return live.loading;
		},
		get connected() {
			return live.connected;
		},
		get done() {
			return live.done;
		},
		get error() {
			return live.error;
		},
		isPending: (key: string) => pending.has(key),
		reconnect: () => track(PENDING_RECONNECT, () => live.reconnect()),
		toggleRead: (n: NotificationItem) => track(n.id, () => updateNotificationReadStatus({ id: n.id, read: !n.read })),
		markRead: (n: NotificationItem) => {
			if (!n.read) track(n.id, () => updateNotificationReadStatus({ id: n.id, read: true }));
		},
		remove: (n: NotificationItem) => track(n.id, () => removeNotification({ id: n.id })),
		markAllRead: () => track(PENDING_READ_ALL, () => markAllNotificationsRead()),
		removeAll: () => track(PENDING_REMOVE_ALL, () => removeAllNotifications())
	};
}

export const typeLabels: Record<NotificationItem['type'], string> = {
	notification: 'Bildirim',
	message: 'Mesaj'
};

// Gönderen yoksa (sistem bildirimi) varsayılan etiket.
export const senderLabel = (n: NotificationItem) => n.from_label || 'Sistem';

const dateFormat = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
// PB tarihi "2026-10-21 12:00:00.000Z" biçiminde; boşluğu `T` yapmak tüm tarayıcılarda ayrıştırılmasını garanti eder.
export const formatDate = (pbDate: string) => dateFormat.format(Date.parse(pbDate.replace(' ', 'T')));
