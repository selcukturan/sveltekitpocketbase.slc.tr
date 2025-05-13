// src/lib/utils/errors.ts
import type { FormErrorResponse } from './types';
import { ClientResponseError } from 'pocketbase';

/**
 * ClientResponseError nesnesini alan adı bazında gruplanmış hata mesajlarına dönüştürür.
 * @param error unknown nesnesi
 * @returns Alan adı anahtarlı, hata mesajı dizileri içeren bir nesne.
 */
export function pbError(error: unknown): FormErrorResponse {
	const fieldErrors: FormErrorResponse = { status: 400, errors: {} };

	if (error instanceof ClientResponseError) {
		const statusCode = error?.status << 0 || 400;
		const responseData = error?.data || {};
		const message = responseData.message || error.message || 'Veritabanı işlemi sırasında bir hata oluştu. [pbError]';

		fieldErrors.status = statusCode;
		fieldErrors.errors['_general'] = [message];
	} else if (error instanceof Error) {
		fieldErrors.errors['_general'] = [error.message || 'İşlem sırasında tanımlanmamış bir hata oluştu. [pbError]'];
	} else {
		fieldErrors.errors['_general'] = ['İşlem sırasında bilinmeyen bir hata oluştu. [pbError]'];
	}

	return fieldErrors;
}
