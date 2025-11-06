import { fail } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import type { AppActionFailure } from '$lib/types';

/**
 * Hata yönetimi için merkezi bir servis.
 * PocketBase ve genel hataları ayrıştırır ve uygun yanıtları döner.
 * Bu servis, Pocketbase hatalarını ve genel JavaScript hatalarını ele alır.
 * @param error Yakalanan hata (PocketBase veya genel).
 * @param context Ek bağlam verisi (örn. form alanları) - opsiyonel.
 * @returns SvelteKit'in `fail` fonksiyonunu kullanarak uygun hata yanıtı.
 */
export function handleError(error: unknown, context: Record<string, any> = {}): AppActionFailure {
	if (error instanceof ClientResponseError) {
		const statusCode = error?.status << 0 || 400;
		const responseData = error?.data || {};
		const message = responseData.message || error.message || 'Veritabanı işlemi sırasında bir hata oluştu.';
		// Bu bir PocketBase API hatası
		console.error('PocketBase Hatası:', message);

		// Kendi genel hata metodunuzu çağırarak yan etkileri (logging vb.) yönetin
		// this.error(error); // Mevcut error metodunuzu burada kullanabilirsiniz.

		return fail(statusCode, {
			isPbError: true, // Hatanın tipini UI'da ayırt etmek için
			message: message,
			data: context
		});
	}

	if (error instanceof Error) {
		// Bu genel bir JavaScript hatası (örn: ağ hatası)
		console.error('Genel Hata:', error.message);
		return fail(500, {
			isPbError: false,
			message: 'Sunucuya bağlanırken bir sorun oluştu. Lütfen tekrar deneyin.',
			data: context
		});
	}

	console.error('Beklenmedik Hata:', 'Beklenmedik bir hata oluştu.');
	// Yakalanamayan diğer tüm durumlar için
	return fail(500, {
		isPbError: false,
		message: 'Beklenmedik bir hata oluştu.',
		data: context
	});
}

/**
 * 'unknown' tipindeki bir hatayı, uygulamamızda bilinen ve yönetilebilir
 * bir hata tipine (`ClientResponseError | Error`) dönüştürür.
 * Bu fonksiyon, ResultAsync.fromPromise için standart bir errorHandler olarak kullanılır.
 * @param error Yakalanan bilinmeyen hata.
 * @returns Tipikleştirilmiş bir ClientResponseError veya standart Error nesnesi.
 */
export function mapUnknownToError(error: unknown): ClientResponseError | Error {
	if (error instanceof ClientResponseError) {
		return error;
	}
	if (error instanceof Error) {
		return error;
	}
	// Diğer tüm durumlar (örneğin bir string fırlatılması) için yeni bir Error oluştur.
	return new Error('Beklenmedik bir hata oluştu: ' + String(error));
}
