import * as v from 'valibot';
import { Collections, type TestDatatableResponse } from '$lib/types/pocketbase-types';
import { buildPocketbaseFilterString } from '$lib/utils/filter-string-helper';

import { getRequestEvent, query } from '$app/server';
import { checkAuthenticated } from './guarded.remote';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(v.string(), async (filter: string) => {
	await checkAuthenticated();

	const { locals } = getRequestEvent();
	// await sleep(1000);
	const filterString = buildPocketbaseFilterString(filter);
	// console.log('filterString', filterString);
	const records = await locals.pb.collection(Collections.TestDatatable).getList<TestDatatableResponse>(1, 1000, {
		filter: `producer ~ "${filter}"`,
		sort: 'order'
	});

	return records;
});
