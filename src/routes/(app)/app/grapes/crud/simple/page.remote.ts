import { getRequestEvent, query, form, command, requested } from '$app/server';
import { error } from '@sveltejs/kit';
import { Collections } from '#lib/types/pocketbase-types.js';
import { checkAuthenticated } from '#lib/remotes/guarded.remote.js';
import { ResultAsync } from 'neverthrow';
import { throwError, throwFormError, mapUnknownToError } from '#lib/server/error.js';
import { toPbPayload } from '#lib/utils/transform-params-helper.js';

import { TABLE, oneParamsSchema, createFormSchema, updateFormSchema, deleteParamsSchema, deleteManySchema } from './page.shared';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// İstemciden yalnızca sayfa, sayfa boyutu, sıralama (TABLE'daki sortable alanlar) ve filtre gelir; expand/fields
// gerekiyorsa burada sabit verilir (istemci ilişkili koleksiyonları açamaz).
export const getList = query(TABLE.listParamsSchema, async (params) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	await sleep(300);

	// Alanlar ve operatörler TABLE tanımından, değerler yer tutuculara (bkz. datatable/utils/filter.ts)
	const filter = TABLE.filters.toPb(locals.pb, params.filterData);

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.DemoCrud).getList(params.page, params.perPage, { filter, sort: params.options.sort }),
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

export const deleteRecords = command(deleteManySchema, async ({ ids }) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();
	const collection = locals.pb.collection(Collections.DemoCrud);

	const results = await Promise.all(ids.map((id) => ResultAsync.fromPromise(collection.delete(id), mapUnknownToError)));
	const failed = results.find((result) => result.isErr());
	if (failed?.isErr()) {
		throwError(failed.error);
	}

	await requested(getList, 1).refreshAll();
	return { deleted: ids.length };
});

// Satır kuralı (TABLE'da editable: (row) => …) olan alanlarda kaydın güncel hâli okunur ve kural sunucuda da denetlenir.
// Kuralı olmayan alanlarda ek istek yapılmaz (alanın düzenlenebilirliği zaten cellEditSchema ile doğrulandı).
async function assertEditable(edits: { id: string; field: string }[]) {
	const ruled = edits.filter((edit) => TABLE.ruleFields.has(edit.field));
	if (ruled.length === 0) return;
	const { locals } = getRequestEvent();
	const collection = locals.pb.collection(Collections.DemoCrud);
	const ids = [...new Set(ruled.map((edit) => edit.id))];
	const results = await Promise.all(ids.map((id) => ResultAsync.fromPromise(collection.getOne(id), mapUnknownToError)));
	const records = new Map<string, Record<string, unknown>>();
	for (const [i, result] of results.entries()) {
		if (result.isErr()) throwError(result.error);
		records.set(ids[i], result.value);
	}
	if (ruled.some((edit) => !TABLE.canEdit(records.get(edit.id)!, edit.field))) error(403, { message: 'dt_cell_not_editable', type: 'general', errorId: '' });
}

// Tablo içinde tek hücre düzenleme: yalnızca o alan güncellenir. Boş değerler PocketBase'e '' olarak gider (alan temizlenir).
export const updateCell = command(TABLE.cellEditSchema, async ({ id, field, value }) => {
	await checkAuthenticated(); // 🔒
	await assertEditable([{ id, field }]);

	const { locals } = getRequestEvent();

	const updatedResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).update(id, { [field]: value ?? '' }), mapUnknownToError);

	if (updatedResult.isErr()) {
		throwError(updatedResult.error);
	}

	await requested(getList, 1).refreshAll();

	return updatedResult.value;
});

// Toplu hücre düzenleme (yapıştırma): hücreler kayıt bazında birleştirilir, her kayıt tek istekle güncellenir.
export const updateCells = command(TABLE.cellsEditSchema, async (edits) => {
	await checkAuthenticated(); // 🔒
	await assertEditable(edits);

	const { locals } = getRequestEvent();
	const collection = locals.pb.collection(Collections.DemoCrud);

	const patches: Record<string, Record<string, unknown>> = {};
	for (const { id, field, value } of edits) patches[id] = { ...patches[id], [field]: value ?? '' };

	const results = await Promise.all(Object.entries(patches).map(([id, patch]) => ResultAsync.fromPromise(collection.update(id, patch), mapUnknownToError)));
	const failed = results.find((result) => result.isErr());
	if (failed?.isErr()) {
		throwError(failed.error);
	}

	await requested(getList, 1).refreshAll();
});
