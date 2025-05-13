// src/lib/server/formAction.ts
import type { RequestEvent, ActionFailure } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { z, ZodError, type ZodSchema } from 'zod';
import { ClientResponseError } from 'pocketbase';
import { zodError } from '$lib/client/utils';

type FormActionOptions<T extends ZodSchema, R = unknown> = {
	schema: T;
	event: RequestEvent;
	// Doğrulama başarılı olduğunda çalışacak asıl iş mantığı
	action: (data: z.infer<T>, event: RequestEvent) => Promise<R>;
	// İsteğe bağlı: Başarı durumunda döndürülecek veriyi formatlama
	formatSuccess?: (result: R, parsedData: z.infer<T>) => Record<string, any>;
};

/**
 * SvelteKit Actions için genel bir form işleyici.
 * FormData'yı alır, Zod şeması ile doğrular, belirtilen aksiyonu çalıştırır
 * ve başarı/hata durumlarını yönetir.
 */
export async function handleFormAction<T extends ZodSchema, R>(options: FormActionOptions<T, R>): Promise<ReturnType<typeof fail> | ({ success: true } & Record<string, any>)> {
	// SvelteKit'in beklediği dönüş tipleri
	const { schema, event, action, formatSuccess } = options;
	const { request } = event;

	let formData: FormData;

	try {
		formData = await request.formData();
	} catch (error) {
		console.error('Failed to read FormData:', error);
		// fail kullanmak yerine doğrudan ActionFailure döndürebiliriz veya fail kullanabiliriz
		// return createGeneralFailure('Form verisi okunamadı.', 500);
		return fail(500, { errors: { _general: ['Form verisi okunamadı.'] } });
		// return createGeneralFailure('Form verisi okunamadı.', 500);
	}

	let parsedData: z.infer<T>;

	try {
		// FormData'yı doğrula ve parse et
		parsedData = schema.parse(formData);
	} catch (error) {
		if (error instanceof ZodError) {
			const errors = zodError(error);
			console.warn('Server-side Zod Validation Error:', errors);
			// `fail` otomatik olarak type: 'failure' ve status ekler
			return fail(400, { errors, formData: Object.fromEntries(formData) }); // formData'yı geri gönderebiliriz
		} else {
			console.error('Unknown Server Validation Error:', error);
			return fail(500, { errors: { _general: ['Beklenmedik bir doğrulama hatası oluştu.'] } });
		}
	}

	// Doğrulama başarılı, asıl aksiyonu çalıştır
	try {
		const result = await action(parsedData, event);
		// Başarı durumunu formatla (varsa)
		const successData = formatSuccess ? formatSuccess(result, parsedData) : { result };
		return { success: true, ...successData };
	} catch (error) {
		console.error('Action Execution Error:', error);
		if (error instanceof ClientResponseError) {
			// Pocketbase hatasını daha anlamlı hale getirebiliriz
			const message = error.message || 'Veritabanı işlemi sırasında bir hata oluştu.';
			// fail kullanmak en doğrusu
			return fail(error.status || 400, { errors: { _general: [message] }, formData: Object.fromEntries(formData) });
		} else if (error instanceof Error) {
			return fail(500, { errors: { _general: [error.message || 'İşlem sırasında bilinmeyen bir hata oluştu.'] }, formData: Object.fromEntries(formData) });
		} else {
			return fail(500, { errors: { _general: ['İşlem sırasında bilinmeyen bir hata oluştu.'] }, formData: Object.fromEntries(formData) });
		}
	}
}
