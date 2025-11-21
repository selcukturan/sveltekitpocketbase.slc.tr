import { getRequestEvent, query, form } from '$app/server';
import { Collections } from '$lib/types/pocketbase-types';
import { jsonToPocketBaseFilter } from '$lib/utils/filter-string-helper';
import { checkAuthenticated } from '$lib/remotes/guarded.remote';
import { ResultAsync } from 'neverthrow';
import { throwError, mapUnknownToError } from '$lib/server/error';

import { listParamsSchema, oneParamsSchema, updateFormSchema } from './types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getList = query(listParamsSchema, async (params) => {
	// 🔒
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

	if (listResult.isErr()) {
		throwError(listResult.error);
	}

	return listResult.value;
});

export const getOne = query(oneParamsSchema, async (params) => {
	// 🔒
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	await sleep(2000);

	const oneResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.TestDatatable).getOne(params.id, {
			...params.options
		}),
		mapUnknownToError
	);

	if (oneResult.isErr()) {
		throwError(oneResult.error);
	}

	return oneResult.value;
});

export const updateForm = form(updateFormSchema, async (params) => {
	// 🔒
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const updatedResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.TestDatatable).update(params.id, { ...params, id: undefined }),
		mapUnknownToError
	);

	if (updatedResult.isErr()) {
		throwError(updatedResult.error);
	}

	return updatedResult.value;
});
