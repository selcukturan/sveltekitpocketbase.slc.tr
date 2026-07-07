import { query, command, form, getRequestEvent } from '$app/server';
import type { DemoNotificationResponse } from '$lib/types/pocketbase-types';
import { AsyncQueue } from '$lib/utils/asyncQueue';
import * as v from 'valibot';

export type PublicNotificationResponse = Omit<DemoNotificationResponse, 'user' | 'read_by'>;

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

export const notificationsRemote = query.live(async function* () {
	console.log('[notificationsRemote] Sunucuda remote fonksiyon tetiklendi.');
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

	const getRawList = async (): Promise<DemoNotificationResponse[]> => {
		try {
			console.log('[notificationsRemote] Veritabanından en güncel log listesi çekiliyor...');
			const result = await pb.collection('demo_notification').getFullList<DemoNotificationResponse>({
				filter: locals.pb.filter('user.id ?= {:id} || user:length = 0', { id: userId }),
				sort: '-created'
			});
			console.log('[notificationsRemote] Veritabanından en güncel log listesi çekildi:', result);
			return result;
		} catch (err) {
			console.error('[notificationsRemote] Veritabanından log listesi çekilirken hata oluştu:', err);
			return [];
		}
	};

	// Adım 1: İlk yükleme (SSR ve anında hidrasyon için)
	const initialRawList = await getRawList();
	console.log('[notificationsRemote] İlk list yield ediliyor.');
	yield splitList(initialRawList);

	// Bellekte güncel listeyi tutacak değişken
	let currentList = [...initialRawList];

	// Adım 2: Real-time Abonelik ve Async Kuyruğun Dinlenmesi
	const queue = new AsyncQueue<{ read: PublicNotificationResponse[]; unread: PublicNotificationResponse[] } | null>();

	const abortHandler = () => {
		console.log('[notificationsRemote] İstemci bağlantı kesme sinyali (AbortSignal) yakalandı.');
		queue.push(null);
	};
	request.signal.addEventListener('abort', abortHandler);

	try {
		console.log('[notificationsRemote] PocketBase demo_notification real-time aboneliği başlatılıyor...');
		await pb.collection('demo_notification').subscribe<DemoNotificationResponse>(
			'*',
			async (e) => {
				console.log(`[notificationsRemote] 💥 PocketBase güncelleme olayını yakaladı! Eylem: ${e.action}, Kayıt ID: ${e.record.id}`);

				// Kaydın bu kullanıcıya ait olup olmadığını kontrol eden yardımcı mantık
				const isTargeted = !e.record.user || e.record.user.length === 0 || e.record.user.includes(userId);

				if (e.action === 'create') {
					if (isTargeted) {
						currentList = [e.record, ...currentList];
					}
				} else if (e.action === 'update') {
					if (isTargeted) {
						const exists = currentList.some((item) => item.id === e.record.id);
						if (exists) {
							currentList = currentList.map((item) => (item.id === e.record.id ? e.record : item));
						} else {
							currentList = [e.record, ...currentList].sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
						}
					} else {
						currentList = currentList.filter((item) => item.id !== e.record.id);
					}
				} else if (e.action === 'delete') {
					currentList = currentList.filter((item) => item.id !== e.record.id);
				}

				queue.push(splitList(currentList));
			},
			{
				filter: locals.pb.filter('user.id ?= {:id} || user:length = 0', { id: userId })
			}
		);
		console.log('[notificationsRemote] PocketBase subscribe başarıyla tamamlandı, akış dinleniyor...');

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
		try {
			await pb.collection('demo_notification').unsubscribe('*');
			console.log('[notificationsRemote] PocketBase demo_notification aboneliği başarıyla iptal edildi.');
		} catch (uErr) {
			console.error('[notificationsRemote] Unsubscribe hatası:', uErr);
		}
	}
});
