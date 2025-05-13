// src/lib/utils/errors.ts
import type { FormErrorResponse } from './types';
/**
 * formDataError nesnesini alan adı bazında gruplanmış hata mesajlarına dönüştürür.
 * @param error unknown nesne
 * @returns Alan adı anahtarlı, hata mesajı dizileri içeren bir nesne.
 */
export function formDataError(error: unknown): FormErrorResponse {
	const fieldErrors: FormErrorResponse = { status: 400, errors: {} };

	if (error instanceof Error) {
		fieldErrors.errors['_general'] = [error.message || 'Form verisi okunamadı. [formDataError]'];
	} else {
		fieldErrors.errors['_general'] = ['İşlem sırasında bilinmeyen bir hata oluştu. [formDataError]'];
	}

	return fieldErrors;
}
