import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const checkAuthenticated = query(() => {
	const event = getRequestEvent();
	if (event.locals.user === null) {
		redirect(307, '/login');
	}
});
