import type { Actions } from './$types';

export const actions: Actions = {
	logout: ({ locals }) => {
		locals.auth.clear();
		// SUCCESS
		return { success: true };
	}
};
