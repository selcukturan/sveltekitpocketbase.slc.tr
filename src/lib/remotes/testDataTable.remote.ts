import * as v from 'valibot';
import {
	Collections,
	type TestDatatableResponse
} from '$lib/client/types/pocketbase-types';

import { getRequestEvent, query } from '$app/server';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(v.string(), async (hash: string) => {
	const { locals } = getRequestEvent();

	const records = await locals.auth.pb
		.collection(Collections.TestDatatable)
		.getList<TestDatatableResponse>(1, 1000, {
			filter: `producer ~ "${hash.replace('#', '')}"`,
			sort: 'order'
		});

	// await sleep(1000);

	/* if (Math.random() < 0.5) {
		throw new Error('Yapay bir hata oluştu.');
	} */

	return records;
});
