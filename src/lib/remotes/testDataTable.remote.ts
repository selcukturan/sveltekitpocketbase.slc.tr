import * as v from 'valibot';
import { Collections, type TestDatatableResponse, type TestSubtotalViewResponse } from '$lib/types/pocketbase-types';

import { getRequestEvent, query } from '$app/server';
import { checkAuthenticated } from './guarded.remote';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(v.string(), async (hash: string) => {
	await checkAuthenticated();
	await sleep(1000); // Simulate network delay
	const { locals } = getRequestEvent();

	// console.log('filterString', filterString);
	const records = await locals.pb.collection(Collections.TestDatatable).getList<TestDatatableResponse>(1, 1000, {
		filter: `title ~ "sel"`,
		sort: 'order'
	});

	return records;
});

export const getFullListSubTotal = query(v.string(), async (hash: string) => {
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const resultList = await locals.pb.collection('test_subtotal_view').getList<TestSubtotalViewResponse>(1, 100, {
		sort: 'subtotal'
	});

	return resultList;
});
