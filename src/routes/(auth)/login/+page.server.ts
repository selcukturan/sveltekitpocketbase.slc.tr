import type { Actions } from './$types';
import { ClientResponseError } from 'pocketbase';
import { Collections, type UsersResponse } from '$lib/client/types/pocketbase-types';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, missing: true });
		}

		try {
			await locals.auth.pb.collection('users').authWithPassword(email, password);
			redirect(303, '/');
		} catch (err) {
			if (err instanceof ClientResponseError) {
				locals.auth.clear();
				return fail(err.status, {
					// Genellikle 400 veya 401 olur
					email,
					message: err.response?.message || 'E-posta veya şifre hatalı.', // PocketBase'den gelen mesajı kullan
					incorrect: true
				});
			}
			// Diğer beklenmedik hatalar için genel bir hata sayfası veya loglama
			console.error('Unexpected login error:', err);
			return fail(500, { message: 'Sunucuda bir hata oluştu. Lütfen tekrar deneyin.' });
			// Ya da yine de /loginx'e yönlendir
			// redirect(303, '/loginx');
		}
	}
};
