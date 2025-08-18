import { getRequestEvent, query, form } from '$app/server';
import * as v from 'valibot';
import { error } from '@sveltejs/kit';

import {
	Collections,
	type AppLogsResponse
} from '$lib/client/types/pocketbase-types';

export const getLogs = query(async () => {
	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const { locals } = getRequestEvent();

	const logs = await locals.auth.pb
		.collection(Collections.AppLogs)
		.getFullList<AppLogsResponse>();

	await sleep(1000);

	if (Math.random() < 0.5) {
		throw new Error('Yapay bir hata oluştu.');
	}

	return logs;
});

export const getLog = query(v.string(), async (slug) => {
	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const { locals } = getRequestEvent();

	const log = await locals.auth.pb
		.collection(Collections.AppLogs)
		.getOne<AppLogsResponse>(slug);

	await sleep(1000);

	if (Math.random() < 0.5) {
		throw new Error('Yapay bir hata oluştu.');
	}

	return log;
});

export const createLog = form(async (data) => {
	// Check the user is logged in

	const title = data.get('title');
	const content = data.get('content');

	// Check the data is valid
	if (typeof title !== 'string' || typeof content !== 'string') {
		error(400, {
			message: 'Title and content are required',
			errorId: 'missing_fields'
		});
	}

	const slug = title.toLowerCase().replace(/ /g, '-');

	const { locals } = getRequestEvent();

	await locals.auth.pb.collection(Collections.AppLogs).create<AppLogsResponse>({
		slug,
		title,
		content
	});

	// await getLogs().refresh(); // server single-flight mutations

	return { success: true };
});
