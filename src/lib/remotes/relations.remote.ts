import { getRequestEvent, query } from '$app/server';
import { Collections } from '$lib/types/pocketbase-types';
import { checkAuthenticated } from '$lib/remotes/guarded.remote';
import { ResultAsync } from 'neverthrow';
import { throwError, mapUnknownToError } from '$lib/server/error';
import * as v from 'valibot';

const filteredCollectionValues = Object.values(Collections).filter((value) => !value.startsWith('_')) as [string, ...string[]];

const relationListParamsSchema = v.object({
	search: v.string(),
	collection: v.picklist(filteredCollectionValues)
});

export const getRelationList = query(relationListParamsSchema, async (params) => {
	// 🔒🔐
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(params.collection).getList(1, 30, {
			filter: `title ~ "${params.search}"`
		}),
		mapUnknownToError
	);

	if (listResult.isErr()) {
		throwError(listResult.error);
	}

	return listResult.value;
});

const relationMultipleSelectedListParamsSchema = v.object({
	ids: v.array(v.string()),
	collection: v.picklist(filteredCollectionValues)
});
export const getMultipleRelationSelectedList = query(relationMultipleSelectedListParamsSchema, async (params) => {
	// 🔒🔐
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	if (params.ids.length === 0) {
		return [];
	}

	// array to string => id = "1" || id = "2" || id = "3"
	const idsString = params.ids.map((id) => `id = "${id}"`).join(' || ');

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(params.collection).getFullList({
			filter: idsString
		}),
		mapUnknownToError
	);

	if (listResult.isErr()) {
		throwError(listResult.error);
	}

	return listResult.value;
});

const relationSingleSelectedListParamsSchema = v.object({
	id: v.string(),
	collection: v.picklist(filteredCollectionValues)
});
export const getSingleRelationSelectedList = query(relationSingleSelectedListParamsSchema, async (params) => {
	// 🔒🔐
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	if (params.id === '') {
		return [];
	}

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(params.collection).getFullList({
			filter: `id = "${params.id}"`
		}),
		mapUnknownToError
	);

	if (listResult.isErr()) {
		throwError(listResult.error);
	}

	return listResult.value;
});

const relationViewParamsSchema = v.object({
	id: v.string(),
	collection: v.picklist(filteredCollectionValues)
});

export const getRelationView = query(relationViewParamsSchema, async (params) => {
	// 🔒🔐
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const recordResult = await ResultAsync.fromPromise(
		locals.pb.collection(params.collection).getOne(params.id),
		mapUnknownToError
	);

	if (recordResult.isErr()) {
		throwError(recordResult.error);
	}

	return recordResult.value;
});
