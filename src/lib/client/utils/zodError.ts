// src/lib/utils/errors.ts
import type { FormErrorResponse } from './types';
import { ZodError } from 'zod';

/**
 * ZodError nesnesini alan adı bazında gruplanmış hata mesajlarına dönüştürür.
 * @param error ZodError nesnesi
 * @returns Alan adı anahtarlı, hata mesajı dizileri içeren bir nesne.
 */
export function zodError(error: unknown): FormErrorResponse {
	if (error instanceof ZodError) {
		const flattenedErrors = error.flatten();
		const responseErrors: { [key: string]: string[] } = {};

		// Alan bazlı hataları kopyala
		// flattenedErrors.fieldErrors şöyle bir tipte olabilir: { name?: string[], age?: string[] }
		// Bu yüzden her bir anahtarın gerçekten var olup olmadığını ve mesaj içerip içermediğini kontrol etmek iyi olur.
		for (const fieldKey in flattenedErrors.fieldErrors) {
			const messages = flattenedErrors.fieldErrors[fieldKey as keyof typeof flattenedErrors.fieldErrors];
			if (messages && messages.length > 0) {
				responseErrors[fieldKey] = messages;
			}
		}

		// Form düzeyindeki hataları _general anahtarına ekle
		if (flattenedErrors.formErrors.length > 0) {
			responseErrors['_general'] = [
				...(responseErrors['_general'] || []), // Eğer _general zaten fieldErrors'tan geldiyse (çok olası değil ama güvenli)
				...flattenedErrors.formErrors
			];
		}

		// Eğer hiç hata yoksa (bu durum pek olası değil ZodError içindeysek ama yine de)
		// ya da sadece _general'da hata varsa ve diğerleri boşsa
		if (Object.keys(responseErrors).length === 0 && flattenedErrors.formErrors.length === 0) {
			// Bu durum ZodError fırlatıldığında pek olmaz ama bir fallback
			responseErrors['_general'] = ['Bir doğrulama hatası oluştu.'];
		}

		return { status: 400, errors: responseErrors };
	} else if (error instanceof Error) {
		// Diğer Error tipleri için genel bir hata mesajı
		return {
			status: 400, // Veya duruma göre 500
			errors: { _general: [error.message || 'İşlem sırasında tanımlanmamış bir hata oluştu. [zodError]'] }
		};
	} else {
		// Bilinmeyen hatalar için
		return {
			status: 500,
			errors: { _general: ['İşlem sırasında bilinmeyen bir hata oluştu. [zodError]'] }
		};
	}
}

/* export function zodError(error: unknown): FormErrorResponse {
	const fieldErrors: FormErrorResponse = { status: 400, errors: {} };

	if (error instanceof ZodError) {
		fieldErrors.status = 400;

		error.issues.forEach((issue) => {
			const path = issue.path.join('.') || '_general'; // Alan yolu veya genel hata
			if (!fieldErrors.errors[path]) {
				fieldErrors.errors[path] = [];
			}
			fieldErrors.errors[path]?.push(issue.message);
		});
	} else if (error instanceof Error) {
		fieldErrors.errors['_general'] = [error.message || 'İşlem sırasında tanımlanmamış bir hata oluştu. [zodError]'];
	} else {
		fieldErrors.errors['_general'] = ['İşlem sırasında bilinmeyen bir hata oluştu. [zodError]'];
	}

	return fieldErrors;
} */
