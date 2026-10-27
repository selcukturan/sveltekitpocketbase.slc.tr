import { error, invalid } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';

// PocketBase doğrulama kodu → çeviri anahtarı (istemcide `t()` ile çevrilir, parametreler alan metadata'sından dolar).
// Listede olmayan kodlar için PocketBase'in kendi mesajı gösterilir.
const pbCodeToMessageKey: Record<string, string> = {
	validation_required: 'err_required',
	validation_not_unique: 'err_not_unique',
	validation_min_text_constraint: 'err_min_length',
	validation_max_text_constraint: 'err_max_length'
};

/**
 * Remote form handler'larında kullanılır.
 * PocketBase 400 doğrulama hatalarını `invalid()` ile ilgili form alanının altına yönlendirir;
 * diğer hatalar için `throwError` davranışı geçerlidir.
 * @param err Yakalanan hata.
 * @param data Formun doğrulanmış verisi; hangi PocketBase alanının formda karşılığı olduğunu belirlemek için kullanılır.
 *             Formda karşılığı olmayan alan hataları form geneline (alan adıyla) yazılır.
 */
export function throwFormError(err: unknown, data: Record<string, unknown>): never {
	if (err instanceof ClientResponseError && err.status === 400) {
		const fieldErrors = (err.response?.data ?? {}) as Record<string, { code?: string; message?: string }>;

		const issues = Object.entries(fieldErrors).map(([pbField, fieldError]) => {
			// Dosya alanları 'alan+', '+alan', 'alan-' olarak gönderilir; hata ana alana yazılır.
			const key = pbField.replace(/^\+|[+-]$/g, '');
			const message = (fieldError.code && pbCodeToMessageKey[fieldError.code]) || fieldError.message || err.message;
			return Object.hasOwn(data, key) ? { message, path: [key] } : { message: `${key}: ${message}` };
		});

		invalid(...(issues.length > 0 ? issues : [err.response?.message || err.message]));
	}

	throwError(err);
}

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
		throw error(statusCode, message, {
			type: 'pb',
			errorId: ''
		});
	}

	if (err instanceof Error) {
		console.error('Genel Hata:', err.message);
		throw error(500, err.message || 'Sunucuya bağlanırken bir sorun oluştu. Lütfen tekrar deneyin.', {
			type: 'general',
			errorId: ''
		});
	}

	console.error('Beklenmedik Hata:', 'Beklenmedik bir hata oluştu.');
	// Yakalanamayan diğer tüm durumlar için
	throw error(500, 'Beklenmedik bir hata oluştu.', {
		type: 'general',
		errorId: ''
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
