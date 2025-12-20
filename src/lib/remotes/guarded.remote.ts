import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Client side get user
export const getUser = query(() => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		redirect(302, resolve('/login'));
	}
	return locals.user;
});

// Server side remote function check authenticated
export const checkAuthenticated = query(() => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		redirect(302, resolve('/login'));
	}
});
