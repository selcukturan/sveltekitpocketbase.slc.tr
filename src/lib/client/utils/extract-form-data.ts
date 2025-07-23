import { safeParse, type BaseSchema, type BaseIssue } from 'valibot';

// https://jovianmoon.io/posts/sveltekit-form-validation-with-valibot

export const extractFormData = async <TInput = unknown, TOutput = TInput>(
	request: Request,
	schema: BaseSchema<TInput, TOutput, BaseIssue<unknown>>
): Promise<{
	data: TOutput | undefined;
	error: string | null;
}> => {
	try {
		const formData = await request.formData();
		const result: Record<string, any> = {};
		// Form verilerini, birden fazla değeri uygun şekilde işleyen bir nesneye dönüştürme
		formData.forEach((value, key) => {
			// Case 1: Bu key ile ilk kez karşılaşıldı
			if (result[key] === undefined) {
				result[key] = value;
			}
			// Case 2: Key var ve zaten bir array, yeni değer ekleyin
			else if (Array.isArray(result[key])) {
				result[key].push(value);
			}
			// Case 3: Anahtar var ancak henüz bir array değil, her iki değeri de içeren diziye dönüştür
			else {
				result[key] = [result[key], value];
			}
		});

		const validation = safeParse(schema, result);

		if (!validation.success) {
			if (validation.issues && validation.issues.length > 0) {
				return {
					data: undefined,
					error: validation.issues.map((issue) => issue.message).join(', ')
				};
			}
			return {
				data: undefined,
				error: 'Form gönderimi doğrulanırken hata oluştu, lütfen her şeyi dikkatlice kontrol edin.'
			};
		}
		return { data: validation.output as TOutput, error: null };
	} catch (error) {
		return { data: undefined, error: `Form verileri çıkarılırken hata oluştu: ${error}` };
	}
};
