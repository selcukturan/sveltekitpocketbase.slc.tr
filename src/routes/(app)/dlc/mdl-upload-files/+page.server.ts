import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ locals, request, fetch }) => {
		const formData = await request.formData();
		await locals.pbClient.collection('dlcMdlFiles').create(formData);
		return { success: false, message: 'Whoops!' };
	}
};
