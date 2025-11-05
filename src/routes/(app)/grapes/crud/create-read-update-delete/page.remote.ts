import { getRequestEvent, query } from '$app/server';
import { Collections } from '$lib/types/pocketbase-types';
import { jsonToPocketBaseFilter } from '$lib/utils/filter-string-helper';
import { checkAuthenticated } from '$lib/remotes/guarded.remote';
import { listParamsSchema } from './types';

import { ResultAsync } from 'neverthrow';
import { handleError, mapUnknownToError } from '$lib/server/error.service';

export const getFullList = query(listParamsSchema, async (params) => {
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const filterString = jsonToPocketBaseFilter(params.filter, locals.pb);
	console.log('filterString', filterString);

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
