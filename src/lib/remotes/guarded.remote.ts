import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUser = query(
	/* async */ () => {
		// await sleep(500);
		const event = getRequestEvent();
		return event.locals.user;
	}
);

export const checkAuthenticated = query(() => {
	const event = getRequestEvent();
	const user = event.locals.user;
	if (user === null) {
		redirect(307, '/login');
	}
});
