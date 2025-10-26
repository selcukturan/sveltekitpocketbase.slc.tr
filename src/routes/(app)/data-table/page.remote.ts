import * as v from 'valibot';
import { Collections, type TestDatatableResponse } from '$lib/types/pocketbase-types';

import { getRequestEvent, query } from '$app/server';
import { checkAuthenticated } from '$lib/remotes/guarded.remote';

import { pageQuerySchema } from './types';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(
	v.object({
		hash: v.optional(v.fallback(v.string(), ''), ''),
		params: pageQuerySchema
	}),
	async (arg) => {
		await checkAuthenticated();

		const { locals } = getRequestEvent();

		const records = await locals.pb.collection(Collections.TestDatatable).getList<TestDatatableResponse>(1, 1000, {
			filter: 'title ~ "sel"',
			sort: 'order'
		});

		return records;
	}
);
