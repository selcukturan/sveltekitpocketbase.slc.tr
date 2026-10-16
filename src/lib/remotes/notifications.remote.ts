import { query, command, form, getRequestEvent } from '$app/server';
import type { DemoNotificationResponse } from '#lib/types/pocketbase-types.js';
import { AsyncQueue } from '#lib/utils/asyncQueue.js';
import { getTokenPayload } from 'pocketbase';
import * as v from 'valibot';

export type PublicNotificationResponse = Omit<DemoNotificationResponse, 'user' | 'read_by'>;

const NOTIFICATION_LIMIT = 100;

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

// Token süresi dolmuş ama kapanmamış akışları ara ara temizler. Yalnızca açık akış varken çalışır.
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
	console.log('[notificationsRemote] Sunucuda remote fonksiyon tetiklendi.', connectionId);
	const { locals, request } = getRequestEvent();
	const pb = locals.pb;
	const user = locals.user;

	// 🔒 Güvenlik Kontrolü ve İstek İptal Kontrolü
	if (request.signal.aborted) {
		console.warn('[notificationsRemote] İstek zaten sonlandırılmış. Erken çıkış yapılıyor.');
		return;
	}

	if (!user?.id) {
		console.warn('[notificationsRemote] Güvenlik Kontrolü BAŞARISIZ: locals.user bulunamadı. Boş liste dönülüyor.');
		yield { read: [], unread: [] };
		return;
	}

	const userId = user.id;

	console.log(`[notificationsRemote] Kullanıcı doğrulandı: ID = ${userId}`);

	const splitList = (list: DemoNotificationResponse[]) => {
		const unread: PublicNotificationResponse[] = [];
		const read: PublicNotificationResponse[] = [];

		for (const item of list) {
			const isRead = item.read_by.includes(userId);
			const { user: _user_unused, read_by: _read_by_unused, ...publicItem } = item;
			if (isRead) {
				read.push(publicItem);
			} else {
				unread.push(publicItem);
			}
		}

		return { read, unread };
	};

	// Hem liste sorgusu hem abonelik aynı hedefleme kuralını kullanır
	const targetFilter = pb.filter('user.id ?= {:id} || user:length = 0', { id: userId });

	const getRawList = async (): Promise<DemoNotificationResponse[]> => {
		try {
			console.log('[notificationsRemote] Veritabanından en güncel log listesi çekiliyor...');
			const result = await pb.collection('demo_notification').getList<DemoNotificationResponse>(1, NOTIFICATION_LIMIT, {
				filter: targetFilter,
				sort: '-created',
				skipTotal: true
			});
			console.log('[notificationsRemote] Veritabanından en güncel log listesi çekildi:');
			return result.items;
		} catch (err) {
			console.error('[notificationsRemote] Veritabanından log listesi çekilirken hata oluştu:', err);
			return [];
		}
	};

	// Bellekte güncel listeyi tutacak değişken
	let currentList: DemoNotificationResponse[] = [];

	// Real-time güncellemeleri generator'a taşıyan kuyruk
	const queue = new AsyncQueue<{ read: PublicNotificationResponse[]; unread: PublicNotificationResponse[] } | null>();

	const abortHandler = () => {
		console.log('[notificationsRemote] İstemci bağlantı kesme sinyali (AbortSignal) yakalandı.');
		queue.push(null);
	};
	request.signal.addEventListener('abort', abortHandler);

	const pendingClose = pendingCloses.get(connectionId);
	if (pendingClose) {
		clearTimeout(pendingClose);
		pendingCloses.delete(connectionId);
		request.signal.removeEventListener('abort', abortHandler);
		return;
	}
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

		console.log('[notificationsRemote] PocketBase demo_notification real-time aboneliği başlatılıyor...');
		await pb.collection('demo_notification').subscribe<DemoNotificationResponse>(
			'*',
			async (e) => {
				console.log(`[notificationsRemote] 💥 PocketBase güncelleme olayını yakaladı! Eylem: ${e.action}, Kayıt ID: ${e.record.id}`);

				if (!ready) {
					dirty = true;
					return;
				}

				if (e.action === 'create') {
					currentList = [e.record, ...currentList];

					currentList = currentList.slice(0, NOTIFICATION_LIMIT);
					queue.push(splitList(currentList));
				} else if (e.action === 'update') {
					const exists = currentList.some((item) => item.id === e.record.id);
					if (exists) {
						currentList = currentList.map((item) => (item.id === e.record.id ? e.record : item));
					} else {
						currentList = [e.record, ...currentList].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
					}

					currentList = currentList.slice(0, NOTIFICATION_LIMIT);
					queue.push(splitList(currentList));
				} else if (e.action === 'delete') {
					// Liste 99'a düşer; bir sonraki reconnect listeyi tekrar NOTIFICATION_LIMIT'e tamamlar.
					currentList = currentList.filter((item) => item.id !== e.record.id);
					queue.push(splitList(currentList));
				}
			},
			{
				filter: targetFilter
			}
		);
		console.log('[notificationsRemote] PocketBase subscribe başarıyla tamamlandı.');

		// İlk liste çekilirken olay geldiyse liste eskimiş olabilir, değişiklik durana kadar yeniden çekilir.
		// Son çekimden sonra `ready = true` aynı adımda çalıştığı için araya olay giremez.
		currentList = await getRawList();
		while (dirty) {
			dirty = false;
			console.log('[notificationsRemote] Liste çekilirken değişiklik oldu, yeniden çekiliyor...');
			currentList = await getRawList();
		}
		ready = true;

		console.log('[notificationsRemote] İlk list yield ediliyor, akış dinleniyor...');
		yield splitList(currentList);

		// Kuyruğa yeni veri geldikçe yield et
		while (true) {
			console.log('[notificationsRemote] Kuyrukta yeni güncelleme bekleniyor...');
			const nextData = await queue.next();
			if (nextData === null) {
				console.log('[notificationsRemote] Döngüden çıkış sinyali (null) alındı. Akış kapatılıyor.');
				break;
			}
			console.log('[notificationsRemote] Kuyruktan yeni veri alındı, yield ediliyor...');
			yield nextData;
		}
	} catch (err) {
		console.error('[notificationsRemote] Abonelik veya akış hatası:', err);
	} finally {
		console.log('[notificationsRemote] Temizlik ve abonelik iptali adımları başlatılıyor...');
		request.signal.removeEventListener('abort', abortHandler);
		if (connections.get(connectionId) === entry) connections.delete(connectionId);
		try {
			await pb.collection('demo_notification').unsubscribe('*');
			console.log('[notificationsRemote] PocketBase demo_notification aboneliği başarıyla iptal edildi.');
		} catch (uErr) {
			console.error('[notificationsRemote] Unsubscribe hatası:', uErr);
		}
	}
});

const updateReadSchema = v.object({
	id: v.string(),
	read: v.boolean()
});

export const updateNotificationReadStatus = command(updateReadSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.id) return;

	const userId = locals.user.id;

	if (params.read) {
		await locals.pb.collection('demo_notification').update(params.id, { 'read_by+': userId });
	} else {
		await locals.pb.collection('demo_notification').update(params.id, { 'read_by-': userId });
	}
});

const createSchema = v.object({
	title: v.string(),
	message: v.string()
});

export const createNotification = form(createSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.id) return;

	await locals.pb.collection('demo_notification').create({
		title: params.title,
		message: params.message,
		user: [locals.user.id],
		select: 'info',
		read_by: []
	});
});

const deleteSchema = v.object({
	id: v.string()
});

export const deleteNotification = form(deleteSchema, async (params) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.id) return;

	await locals.pb.collection('demo_notification').delete(params.id);
});
