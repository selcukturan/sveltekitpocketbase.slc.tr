import { getRequestEvent, query, form, command, requested } from '$app/server';
import { Collections } from '#lib/types/pocketbase-types.js';
import { checkAuthenticated } from '#lib/remotes/guarded.remote.js';
import { ResultAsync } from 'neverthrow';
import { throwError, throwFormError, mapUnknownToError } from '#lib/server/error.js';
import { toPbPayload } from '#lib/utils/transform-params-helper.js';

import { listParamsSchema, oneParamsSchema, createFormSchema, updateFormSchema, deleteParamsSchema } from './page.shared';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getList = query(listParamsSchema, async (params) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	await sleep(300);

	const filterString = locals.pb.filter('(text_required ~ {:filter_text_required} && text_optional ~ {:filter_text_optional})', { ...params.filterData });

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.DemoCrud).getList(params.page, params.perPage, {
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
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	await sleep(300);

	const oneResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.DemoCrud).getOne(params.id, {
			...params.options
		}),
		mapUnknownToError
	);

	if (oneResult.isErr()) {
		throwError(oneResult.error);
	}

	return oneResult.value;
});

export const createForm = form(createFormSchema, async (params) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	const createdResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).create(toPbPayload(params)), mapUnknownToError);

	if (createdResult.isErr()) {
		throwFormError(createdResult.error, params);
	}

	await requested(getList, 1).refreshAll();

	return createdResult.value;
});

export const updateForm = form(updateFormSchema, async (params) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	const updatedResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).update(params.id, toPbPayload(params, ['id'])), mapUnknownToError);

	if (updatedResult.isErr()) {
		throwFormError(updatedResult.error, params);
	}

	await requested(getList, 1).refreshAll();

	return updatedResult.value;
});

export const deleteRecord = command(deleteParamsSchema, async (params) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	const deletedResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).delete(params.id), mapUnknownToError);

	if (deletedResult.isErr()) {
		throwError(deletedResult.error);
	}

	await requested(getList, 1).refreshAll();
});
