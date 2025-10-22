import * as v from 'valibot';
import { Collections, type TestDatatableResponse } from '$lib/types/pocketbase-types';
import { buildPocketbaseFilterString } from '$lib/utils/filter-string-helper';

import { getRequestEvent, query } from '$app/server';
import { checkAuthenticated } from '$lib/remotes/guarded.remote';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(v.string(), async (hash: string) => {
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const filterString = buildPocketbaseFilterString(hash);

	const records = await locals.pb.collection(Collections.TestDatatable).getList<TestDatatableResponse>(1, 1000, {
		filter: filterString,
		sort: 'order'
	});

	return records;
});
