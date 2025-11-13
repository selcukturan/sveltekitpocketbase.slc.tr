import { error } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

/**
 * Hata yönetimi için merkezi bir servis.
 * PocketBase ve genel hataları ayrıştırır ve SvelteKit'in `error` fonksiyonu ile
 * uygun HTTP hata yanıtını fırlatır.
 * Bu, SvelteKit'in en üst seviye hata yakalama mekanizmasını tetikler (+error.svelte).
 * @param err Yakalanan hata (PocketBase veya genel).
 * @throws {HttpError} SvelteKit'in HTTP hata yanıtı oluşturması için bir hata fırlatır.
 */
export function throwError(err: unknown): never {
	if (err instanceof ClientResponseError) {
		const statusCode = err.status >= 400 && err.status <= 599 ? err.status : 500;
		const message = err.data.message || err.message || 'Veritabanı işlemi sırasında bir hata oluştu.';

		console.error('PocketBase Hatası:', message);

		// SvelteKit'in error fonksiyonunu çağırarak hata fırlat.
		// Bu, işlemi durdurur ve en yakın +error.svelte dosyasını render eder.
		throw error(statusCode, {
			type: 'pb',
			errorId: '',
			message: message
		});
	}

	if (err instanceof Error) {
		console.error('Genel Hata:', err.message);
		throw error(500, {
			type: 'general',
			errorId: '',
			message: err.message || 'Sunucuya bağlanırken bir sorun oluştu. Lütfen tekrar deneyin.'
		});
	}

	console.error('Beklenmedik Hata:', 'Beklenmedik bir hata oluştu.');
	// Yakalanamayan diğer tüm durumlar için
	throw error(500, {
		type: 'general',
		errorId: '',
		message: 'Beklenmedik bir hata oluştu.'
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
