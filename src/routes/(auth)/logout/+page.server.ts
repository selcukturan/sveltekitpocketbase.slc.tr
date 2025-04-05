import type { Actions } from './$types';

export const actions: Actions = {
	default: ({ locals }) => {
		locals.auth.logout();
	}
};
