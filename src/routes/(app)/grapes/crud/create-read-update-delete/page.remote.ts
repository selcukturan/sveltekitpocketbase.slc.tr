import { getRequestEvent, query } from '$app/server';
import { Collections } from '$lib/types/pocketbase-types';
import { jsonToPocketBaseFilter } from '$lib/utils/filter-string-helper';
import { checkAuthenticated } from '$lib/remotes/guarded.remote';
import { ResultAsync } from 'neverthrow';
import { handleError, mapUnknownToError } from '$lib/server/error.service';

import { listParamsSchema, oneParamsSchema } from './types';

export const getList = query(listParamsSchema, async (params) => {
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const filterString = jsonToPocketBaseFilter(params.filter, locals.pb);

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.TestDatatable).getList(params.page, params.perPage, {
			filter: filterString,
			...params.options
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

	const { locals } = getRequestEvent();

	const oneResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.TestDatatable).getOne(params.id, {
			...params.options
		}),
		mapUnknownToError
	);

	return oneResult.match(
		(record) => record,
		(error) => handleError(error, { test: 'value' })
	);
});
