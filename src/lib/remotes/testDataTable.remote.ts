import {
	Collections,
	type TestDatatableResponse
} from '$lib/client/types/pocketbase-types';

import { getRequestEvent, query } from '$app/server';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(async () => {
	const { locals } = getRequestEvent();

	const records = await locals.auth.pb
		.collection(Collections.TestDatatable)
		.getFullList<TestDatatableResponse>();

	await sleep(1000);

	if (Math.random() < 0.5) {
		throw new Error('Yapay bir hata oluştu.');
	}

	return records;
});
