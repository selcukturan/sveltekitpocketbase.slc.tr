import { getRequestEvent, query } from '$app/server';
import { Collections } from '$lib/types/pocketbase-types';
import { jsonToPocketBaseFilter } from '$lib/utils/filter-string-helper';
import { checkAuthenticated } from '$lib/remotes/guarded.remote';
import { ResultAsync } from 'neverthrow';
import { handleError, mapUnknownToError } from '$lib/server/error.service';

import { listParamsSchema, oneParamsSchema } from './types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getFullList = query(listParamsSchema, async (params) => {
	await checkAuthenticated();
	await sleep(300);

	const { locals } = getRequestEvent();

	const filterString = jsonToPocketBaseFilter(params.filter, locals.pb);

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.TestDatatable).getList(params.page, params.perPage, {
			filter: filterString,
			...params.listOptions
		}),
		mapUnknownToError
	);

	return listResult.match(
		(records) => records,
		(error) => handleError(error, { test: 'value' })
	);
});

export const getOne = query(oneParamsSchema, async (params) => {
	await checkAuthenticated();
	await sleep(500);

	const { locals } = getRequestEvent();

	const oneResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.TestDatatable).getOne(params.id, {
			...params.listOptions
		}),
		mapUnknownToError
	);

	return oneResult.match(
		(record) => record,
		(error) => handleError(error, { test: 'value' })
	);
});
