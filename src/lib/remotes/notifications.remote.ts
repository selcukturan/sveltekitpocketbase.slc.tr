import { query, getRequestEvent } from '$app/server';
import type { SysLogsResponse } from '$lib/types/pocketbase-types';
import { AsyncQueue } from '$lib/utils/asyncQueue';

/**
 * 3. Canlı Remote Sorgusu (PocketBase Subscribe Entegrasyonu)
 */
export const notificationsRemote = query.live(async function* () {
	console.log('[notificationsRemote] Sunucuda remote fonksiyon tetiklendi.');
	const { locals, request } = getRequestEvent();
	const pb = locals.pb;

	// 🔒 Güvenlik Kontrolü ve İstek İptal Kontrolü
	if (request.signal.aborted) {
		console.warn('[notificationsRemote] İstek zaten sonlandırılmış. Erken çıkış yapılıyor.');
		return;
	}

	if (!locals.user?.id) {
		console.warn('[notificationsRemote] Güvenlik Kontrolü BAŞARISIZ: locals.user bulunamadı. Boş liste dönülüyor.');
		yield [];
		return;
	}

	console.log(`[notificationsRemote] Kullanıcı doğrulandı: ID = ${locals.user.id}, E-posta = ${locals.user.email}`);

	const getUpdatedList = async (): Promise<SysLogsResponse[]> => {
		try {
			console.log('[notificationsRemote] Veritabanından en güncel log listesi çekiliyor...');
			const list = await pb.collection('sys_logs').getFullList<SysLogsResponse>({
				sort: '-created',
				limit: 10
			});
			console.log(`[notificationsRemote] Veri başarıyla çekildi. Toplam kayıt: ${list.length}`);
			return list;
		} catch (err) {
			console.error('[notificationsRemote] Veri çekme hatası:', err);
			return [];
		}
	};

	// Adım 1: İlk yükleme (SSR ve anında hidrasyon için)
	const initialList = await getUpdatedList();
	console.log('[notificationsRemote] İlk list yield ediliyor.');
	yield initialList;

	// Bellekte güncel listeyi tutacak değişken
	let currentList = [...initialList];

	// Adım 2: Real-time Abonelik ve Async Kuyruğun Dinlenmesi
	const queue = new AsyncQueue<SysLogsResponse[] | null>();

	// AbortSignal dinleyicisi: İstemci ayrıldığında kuyruğa çıkış sinyali (null) basar
	const abortHandler = () => {
		console.log('[notificationsRemote] İstemci bağlantı kesme sinyali (AbortSignal) yakalandı.');
		queue.push(null);
	};
	request.signal.addEventListener('abort', abortHandler);

	try {
		console.log('[notificationsRemote] PocketBase sys_logs real-time aboneliği başlatılıyor...');
		await pb.collection('sys_logs').subscribe<SysLogsResponse>('*', async (e) => {
			console.log(`[notificationsRemote] 💥 PocketBase güncelleme olayını yakaladı! Eylem: ${e.action}, Kayıt ID: ${e.record.id}`);
			
			if (e.action === 'create') {
				// Yeni kaydı en başa ekle ve limiti korumak için 10 adet ile sınırla
				currentList = [e.record, ...currentList].slice(0, 10);
			} else if (e.action === 'update') {
				// Güncellenen kaydı bul ve güncelle
				currentList = currentList.map((item) => (item.id === e.record.id ? e.record : item));
			} else if (e.action === 'delete') {
				// Silinen kaydı listeden filtrele
				currentList = currentList.filter((item) => item.id !== e.record.id);
				// Liste 10'un altına düşerse veritabanından eksik kaydı tamamlamak için fetch et
				if (currentList.length < 10) {
					currentList = await getUpdatedList();
				}
			}

			queue.push(currentList);
		});
		console.log('[notificationsRemote] PocketBase subscribe başarıyla tamamlandı, akış dinleniyor...');

		// Kuyruğa yeni veri geldikçe yield et
		while (true) {
			console.log('[notificationsRemote] Kuyrukta yeni güncelleme bekleniyor...');
			const nextList = await queue.next();
			if (nextList === null) {
				console.log('[notificationsRemote] Döngüden çıkış sinyali (null) alındı. Akış kapatılıyor.');
				break;
			}
			console.log('[notificationsRemote] Kuyruktan yeni veri alındı, yield ediliyor...');
			yield nextList;
		}
	} catch (err) {
		console.error('[notificationsRemote] Abonelik veya akış hatası:', err);
	} finally {
		// Adım 3: Güvenli temizlik (İstemci bağlantısı kesildiğinde veya sonlandığında tetiklenir)
		console.log('[notificationsRemote] Temizlik ve abonelik iptali adımları başlatılıyor...');
		request.signal.removeEventListener('abort', abortHandler);
		try {
			await pb.collection('sys_logs').unsubscribe('*');
			console.log('[notificationsRemote] PocketBase sys_logs aboneliği başarıyla iptal edildi.');
		} catch (uErr) {
			console.error('[notificationsRemote] Unsubscribe hatası:', uErr);
		}
	}
});
