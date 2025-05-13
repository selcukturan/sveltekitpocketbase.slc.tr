// src/routes/your-form-route/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { Collections, type TestFormResponse } from '$lib/client/types/pocketbase-types';
import { schema } from './schema'; // Zod şeması
import { handleFormAction } from '$lib/server/formAction'; // Yeni yardımcımız

export const load = (async ({ locals }) => {
	// Load fonksiyonu aynı kalabilir
	const form = await locals.auth.pb.collection(Collections.TestForm).getOne<TestFormResponse>('30u6z6n70xxwinz');
	return {
		form // Başlangıç verisi
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async (event) => {
		// event nesnesini doğrudan al
		return handleFormAction({
			event,
			schema,
			// Asıl iş mantığı: PocketBase güncellemesi
			action: async (updateData, { locals }) => {
				const updatedRecord = await locals.auth.pb.collection(Collections.TestForm).update<TestFormResponse>('30u6z6n70xxwinz', updateData);
				return updatedRecord; // Başarı durumunda döndürülecek veri
			},
			// İsteğe bağlı: Başarı yanıtını formatlama
			formatSuccess: (updatedRecord) => {
				console.log('Update successful on server:', updatedRecord);
				// Sadece başarı mesajı veya güncellenmiş kaydı döndürebilirsiniz
				// İstemci tarafında 'form' prop'unu güncellemek için genellikle tüm kayıt döndürülür.
				return { updatedFormData: updatedRecord };
			}
		});
	}
} satisfies Actions;
