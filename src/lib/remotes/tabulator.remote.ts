import * as v from 'valibot';
import { Collections, type TestDatatableResponse } from '$lib/client/types/pocketbase-types';
import { buildPocketbaseFilterString } from '$lib/client/utils/filter-string-helper';

import { getRequestEvent, query } from '$app/server';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(v.string(), async (hash: string) => {
	const { locals } = getRequestEvent();

	const filterString = buildPocketbaseFilterString(hash);
	// console.log('filterString', filterString);
	const records = await locals.pb.collection(Collections.TestDatatable).getList<TestDatatableResponse>(1, 1000, {
		filter: 'producer ~ ""',
		sort: 'order'
	});

	return records;
});
