// src/lib/utils/errors.ts
import { ZodError } from 'zod';
import type { ActionFailure } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

// Hata mesajlarını alan adı bazında gruplayan bir format
export type FieldErrors = Record<string, string[] | undefined>;

// Genel (alana özgü olmayan) hatalar için özel bir anahtar
export const GENERAL_ERROR_KEY = '_general';

/**
 * ZodError nesnesini alan adı bazında gruplanmış hata mesajlarına dönüştürür.
 * @param error ZodError nesnesi
 * @returns Alan adı anahtarlı, hata mesajı dizileri içeren bir nesne.
 */
export function formatZodError(error: ZodError): FieldErrors {
	const fieldErrors: FieldErrors = {};
	error.issues.forEach((issue) => {
		const path = issue.path.join('.') || GENERAL_ERROR_KEY; // Alan yolu veya genel hata
		if (!fieldErrors[path]) {
			fieldErrors[path] = [];
		}
		fieldErrors[path]?.push(issue.message);
	});
	return fieldErrors;
}

/**
 * Genel bir hatayı ActionFailure formatına uygun hale getirir.
 * @param message Hata mesajı
 * @param status HTTP durum kodu (varsayılan 400)
 * @returns SvelteKit ActionFailure nesnesi
 */
export function createGeneralFailure(message: string, status = 400): ActionFailure<{ errors: FieldErrors }> {
	return fail(status, {
		errors: {
			[GENERAL_ERROR_KEY]: [message]
		}
	});
}
