import { query, command, getRequestEvent } from '$app/server';
import { dev } from '$app/env';
import { error } from '@sveltejs/kit';
import type { DemoNotificationResponse } from '#lib/types/pocketbase-types.js';
import { AsyncQueue } from '#lib/utils/asyncQueue.js';
import { ResultAsync } from 'neverthrow';
import { throwError, mapUnknownToError } from '#lib/server/error.js';
import { getTokenPayload } from 'pocketbase';
import * as v from 'valibot';

// Diğer kullanıcıların id'leri istemciye gitmez; yalnızca bu kullanıcının okuma durumu (`read`) gider.
export type PublicNotificationResponse = Omit<DemoNotificationResponse, 'to' | 'read_by' | 'remove_by'> & { read: boolean };

// PB tarihleri ("2026-10-21 12:00:00.000Z") sabit biçimli olduğu için metin olarak karşılaştırılabilir.
// Aynı anda oluşturulanlarda sıra id ile sabitlenir.
const newestFirst = (a: DemoNotificationResponse, b: DemoNotificationResponse) => (a.created === b.created ? (a.id < b.id ? 1 : -1) : a.created < b.created ? 1 : -1);

// `message` PB editöründen HTML gelir; istemciye düz metin gider. Blok sonları satır sonuna çevrilir,
// arayüz metni `whitespace-pre-line` ile gösterir. Svelte metni zaten kaçışladığı için bu bir güvenlik değil görünüm işlemidir.
const toPlainText = (html: string) =>
	html
		.replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, '\n')
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

// Akışın adım adım logları yalnızca geliştirmede basılır; uyarı ve hatalar canlıda da görünür.
const debug = (...args: unknown[]) => {
	if (dev) console.log('[notificationsRemote]', ...args);
};

const NOTIFICATION_LIMIT = 100;
// PocketBase ayarlarındaki Batch API "max requests" değeriyle aynı olmalı.
const BATCH_SIZE = 50;
// Art arda gelen olaylar (ör. toplu işlemler) bu süre içinde tek bir yield'e birleştirilir.
const FLUSH_DELAY_MS = 100;

// İlişki alanlarında `alan.id` yerine `alan:each` kullanılır: `.id` users koleksiyonuna join yapar ve normal kullanıcı için
// users'ın List kuralı uygulanır. Kullanıcı başkalarını göremediği için ör. `remove_by.id != me`, listede başka biri
// olan kayıtları da eler. `:each` yalnızca kayıttaki id'lere bakar, join yapmaz.

// Kullanıcıya giden ve tüm kullanıcılara giden bildirimler.
const targetFilter = (pb: App.Locals['pb'], userId: string) => pb.filter('to:each ?= {:id} || to:length = 0', { id: userId });
// Bunlardan kullanıcının silmedikleri.
const visibleFilter = (pb: App.Locals['pb'], userId: string) => `(${targetFilter(pb, userId)}) && ${pb.filter('remove_by:each != {:id}', { id: userId })}`;

// Komutlar için oturumdaki kullanıcı; oturum yoksa null.
const getAuth = () => {
	const { locals } = getRequestEvent();
	const userId = locals.user?.id;
	return userId ? { pb: locals.pb, userId } : null;
};

const connectionSchema = v.object({
	// İstemcide bileşen örneği başına üretilen benzersiz bağlantı kimliği
	connectionId: v.pipe(v.string(), v.minLength(8), v.maxLength(64))
});

// Açık bildirim akışları: connectionId -> kullanıcı, token bitiş zamanı ve kapatma işlevi.
// SvelteKit bağlantıyı GC'ye bıraktığı için bileşen yok olurken akışı buradan kapatırız.
type Connection = { userId: string; tokenExpiresAt: number; close: () => void };
const connections = new Map<string, Connection>();
// Akış kurulmadan önce gelen kapatma istekleri (hızlı sayfa geçişi yarışı için)
const pendingCloses = new Map<string, ReturnType<typeof setTimeout>>();

// Token süresi dolmuş ama kapanmamış akışları ara ara temizler. Yalnızca açık akış varken çalışır. 60_000 = 1 dakika
const SWEEP_INTERVAL_MS = 60_000;
let sweeper: ReturnType<typeof setInterval> | null = null;

function ensureSweeper() {
	if (sweeper) return;
	sweeper = setInterval(() => {
		const now = Date.now();
		for (const [id, conn] of connections) {
			if (conn.tokenExpiresAt <= now) {
				console.warn(`[notificationsRemote] Token süresi dolmuş akış kapatılıyor: ${id}`);
				conn.close();
				connections.delete(id);
			}
		}
		if (connections.size === 0 && sweeper) {
			clearInterval(sweeper);
			sweeper = null;
		}
	}, SWEEP_INTERVAL_MS);
	sweeper.unref?.();
}

// Kullanıcı kontrolü yapılmaz: logout'ta oturum bileşen yok olmadan önce temizlenir.
// connectionId istemcide üretilen rastgele bir UUID olduğu için yalnızca sahibi bilir.
export const closeNotificationsBG = command(connectionSchema, async ({ connectionId }) => {
	const conn = connections.get(connectionId);
	if (conn) {
		conn.close();
		return;
	}
	const timer = setTimeout(() => pendingCloses.delete(connectionId), 30_000);
	timer.unref?.();
	pendingCloses.set(connectionId, timer);
});

export const notificationsBG = query.live(connectionSchema, async function* ({ connectionId }) {
	debug('Sunucuda remote fonksiyon tetiklendi.', connectionId);
	const {
		locals: { pb, user },
		request
	} = getRequestEvent();

	// 🔒 Güvenlik Kontrolü ve İstek İptal Kontrolü
	if (request.signal.aborted) {
		debug('İstek zaten sonlandırılmış. Erken çıkış yapılıyor.');
		return;
	}

	if (!user?.id) {
		// Çıkış yapınca akış kullanıcısız yeniden bağlanır; olağan bir durum olduğu için uyarı değil.
		debug('Oturum yok, boş liste dönülüyor.');
		yield [] as PublicNotificationResponse[];
		return;
	}

	const userId = user.id;

	debug(`Kullanıcı doğrulandı: ID = ${userId}`);

	// En yeni en üstte sıralı liste. read/unread ayrımı istemcide `read` alanından türetilir.
	const toPublicList = (list: DemoNotificationResponse[]): PublicNotificationResponse[] =>
		list.toSorted(newestFirst).map(({ to: _to, read_by, remove_by: _remove_by, ...item }) => ({
			...item,
			message: toPlainText(item.message),
			read: read_by.includes(userId)
		}));

	// Liste çekilirken kullanıcının sildikleri hariç tutulur (visibleFilter).
	// Abonelikte yalnızca targetFilter kullanılır: kayıt filtreden çıktığında PocketBase olay göndermez,
	// silme işareti hiç gelmez. Bu yüzden abonelik tüm güncellemeleri alır, kontrolü `isRemoved` yapar.
	const isRemoved = (item: DemoNotificationResponse) => item.remove_by.includes(userId);

	// Hata yutulmaz: boş liste "bildirim yok" gibi görünürdü. Dıştaki catch istemciye hata olarak iletir.
	const getRawList = async (): Promise<DemoNotificationResponse[]> => {
		debug('Liste çekiliyor...');
		const result = await pb.collection('demo_notification').getList<DemoNotificationResponse>(1, NOTIFICATION_LIMIT, {
			filter: visibleFilter(pb, userId),
			sort: '-created',
			skipTotal: true
		});
		debug(`Liste çekildi: ${result.items.length} kayıt`);
		return result.items;
	};

	// Bellekte güncel listeyi tutacak değişken
	let currentList: DemoNotificationResponse[] = [];

	// Real-time güncellemeleri generator'a taşıyan kuyruk
	const queue = new AsyncQueue<PublicNotificationResponse[] | null>();

	// Toplu işlemde her kayıt ayrı olay üretir; ilk olaydan FLUSH_DELAY_MS sonra son durum tek seferde gönderilir.
	let flushTimer: ReturnType<typeof setTimeout> | null = null;
	const scheduleFlush = () => {
		if (flushTimer) return;
		flushTimer = setTimeout(() => {
			flushTimer = null;
			queue.push(toPublicList(currentList));
		}, FLUSH_DELAY_MS);
	};

	const pendingClose = pendingCloses.get(connectionId);
	if (pendingClose) {
		clearTimeout(pendingClose);
		pendingCloses.delete(connectionId);
		return;
	}

	const abortHandler = () => {
		debug('İstemci bağlantı kesme sinyali (AbortSignal) yakalandı.');
		queue.push(null);
	};
	request.signal.addEventListener('abort', abortHandler);
	// exp saniye cinsindendir; okunamazsa süpürücü akışı ilk turda kapatır
	const tokenExpiresAt = (Number(getTokenPayload(pb.authStore.token).exp) || 0) * 1000;
	const entry: Connection = { userId, tokenExpiresAt, close: () => queue.push(null) };
	connections.set(connectionId, entry);
	ensureSweeper();

	try {
		// Önce abone olunur, sonra liste çekilir. Böylece liste çekilirken oluşan değişiklikler kaçmaz.
		// Liste hazır olana kadar gelen olaylar uygulanmaz; yalnızca listenin yeniden çekilmesi gerektiği işaretlenir.
		let ready = false;
		let dirty = false;

		debug('PocketBase demo_notification real-time aboneliği başlatılıyor...');
		await pb.collection('demo_notification').subscribe<DemoNotificationResponse>(
			'*',
			(e) => {
				debug(`💥 PocketBase güncelleme olayını yakaladı! Eylem: ${e.action}, Kayıt ID: ${e.record.id}`);

				if (!ready) {
					dirty = true;
					return;
				}

				const inList = currentList.some((item) => item.id === e.record.id);

				if (e.action === 'create') {
					currentList = [e.record, ...currentList].slice(0, NOTIFICATION_LIMIT);
				} else if (e.action === 'delete' || isRemoved(e.record)) {
					// Silindi ya da kullanıcı gizledi: listedeyse çıkar, değilse (ör. limit dışı) yok say.
					// Liste 99'a düşer; bir sonraki reconnect listeyi tekrar NOTIFICATION_LIMIT'e tamamlar.
					if (!inList) return;
					currentList = currentList.filter((item) => item.id !== e.record.id);
				} else if (inList) {
					currentList = currentList.map((item) => (item.id === e.record.id ? e.record : item));
				} else {
					// Listede olmayan kayıt güncellendi: sıraya yerleştirilir, limit dışına düşerse kesilir.
					currentList = [e.record, ...currentList].sort(newestFirst).slice(0, NOTIFICATION_LIMIT);
				}
				scheduleFlush();
			},
			{ filter: targetFilter(pb, userId) }
		);
		debug('PocketBase subscribe başarıyla tamamlandı.');

		// İlk liste çekilirken olay geldiyse liste eskimiş olabilir, değişiklik durana kadar yeniden çekilir.
		// Son çekimden sonra `ready = true` aynı adımda çalıştığı için araya olay giremez.
		do {
			dirty = false;
			currentList = await getRawList();
		} while (dirty);
		ready = true;

		debug('İlk list yield ediliyor, akış dinleniyor...');
		yield toPublicList(currentList);

		// Kuyruğa yeni veri geldikçe yield et; null akışı kapatır.
		let next: PublicNotificationResponse[] | null;
		while ((next = await queue.next()) !== null) {
			debug('🚀 Kuyruktan yeni veri alındı, yield ediliyor...');
			yield next;
		}
		debug('Çıkış sinyali (null) alındı. Akış kapatılıyor.');
	} catch (err) {
		// İstemci zaten ayrıldıysa iletilecek kimse yok.
		if (request.signal.aborted) return;
		console.error('[notificationsRemote] Abonelik veya akış hatası:', err);
		// İstemcide `notifs.error` dolar ve akış durur; sayfanın periyodik reconnect'i yeniden dener.
		error(503, 'Bildirimler şu anda yüklenemiyor.', { type: 'pb', errorId: '' });
		// throwError(err);
	} finally {
		debug('Temizlik ve abonelik iptali adımları başlatılıyor...');
		request.signal.removeEventListener('abort', abortHandler);
		if (flushTimer) clearTimeout(flushTimer);
		if (connections.get(connectionId) === entry) connections.delete(connectionId);
		try {
			await pb.collection('demo_notification').unsubscribe('*');
			debug('PocketBase demo_notification aboneliği başarıyla iptal edildi.');
		} catch (uErr) {
			console.error('[notificationsRemote] Unsubscribe hatası:', uErr);
		}
	}
});

const updateReadSchema = v.object({
	id: v.string(),
	read: v.boolean()
});

export const updateNotificationReadStatus = command(updateReadSchema, async ({ id, read }) => {
	const auth = getAuth();
	if (!auth) return;

	await auth.pb.collection('demo_notification').update(id, { [read ? 'read_by+' : 'read_by-']: auth.userId });
});

const removeSchema = v.object({
	id: v.string()
});

export const removeNotification = command(removeSchema, async ({ id }) => {
	const auth = getAuth();
	if (!auth) return;

	// Kayıt silinmez, yalnızca bu kullanıcı için gizlenir. Canlı liste update olayıyla kaydı düşürür.
	await auth.pb.collection('demo_notification').update(id, { 'remove_by+': auth.userId });
});

// Filtreye uyan tüm görünür bildirimlere aynı güncellemeyi Batch API ile uygular.
// Her batch kendi içinde atomiktir; parçalar arası değildir (yeniden denemek zararsızdır).
const updateAllVisible = async (body: (userId: string) => Record<string, unknown>, extraFilter?: string) => {
	const auth = getAuth();
	if (!auth) return;
	const { pb, userId } = auth;

	const base = visibleFilter(pb, userId);
	const filter = extraFilter ? `(${base}) && (${pb.filter(extraFilter, { id: userId })})` : base;
	const items = await pb.collection('demo_notification').getFullList({ filter, fields: 'id' });

	for (let i = 0; i < items.length; i += BATCH_SIZE) {
		const batch = pb.createBatch();
		for (const { id } of items.slice(i, i + BATCH_SIZE)) {
			batch.collection('demo_notification').update(id, body(userId));
		}

		const send = await ResultAsync.fromPromise(batch.send(), mapUnknownToError);

		if (send.isErr()) {
			console.error('[notificationsRemote] Batch hatası:', JSON.stringify(send.error, null, 2));
			throwError(send.error);
		}
	}
};

export const markAllNotificationsRead = command(async () => {
	await updateAllVisible((userId) => ({ 'read_by+': userId }), 'read_by:each != {:id}');
});

export const removeAllNotifications = command(async () => {
	await updateAllVisible((userId) => ({ 'remove_by+': userId }));
});
