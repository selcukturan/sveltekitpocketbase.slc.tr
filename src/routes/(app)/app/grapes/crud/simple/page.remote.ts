import { getRequestEvent, query, form, command, requested } from '$app/server';
import { error } from '@sveltejs/kit';
import { Collections } from '#lib/types/pocketbase-types.js';
import { requirePermission } from '#lib/server/acl.js';
import { ResultAsync } from 'neverthrow';
import { throwError, throwFormError, mapUnknownToError } from '#lib/server/error.js';
import { toPbPayload } from '#lib/utils/transform-params-helper.js';

import { TABLE, oneParamsSchema, createFormSchema, updateFormSchema, deleteManySchema } from './page.shared';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Yetki kaynağı (acl_resources.key): her fonksiyon kendi işlemini denetler (oturum yoksa girişe yönlendirir)
const RESOURCE = 'grapes.crud.simple';

// İstemciden yalnızca sayfa, sayfa boyutu, sıralama (TABLE'daki sortable alanlar) ve filtre gelir; expand/fields
// gerekiyorsa burada sabit verilir (istemci ilişkili koleksiyonları açamaz).
export const getList = query(TABLE.listParamsSchema, async (params) => {
	await requirePermission(RESOURCE, 'list'); // 🔒

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
	await requirePermission(RESOURCE, 'view'); // 🔒

	const { locals } = getRequestEvent();

	await sleep(300);

	const oneResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).getOne(params.id), mapUnknownToError);

	if (oneResult.isErr()) {
		throwError(oneResult.error);
	}

	return oneResult.value;
});

export const createForm = form(createFormSchema, async (params) => {
	await requirePermission(RESOURCE, 'create'); // 🔒

	const { locals } = getRequestEvent();

	const createdResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).create(toPbPayload(params)), mapUnknownToError);

	if (createdResult.isErr()) {
		throwFormError(createdResult.error, params);
	}

	await requested(getList, 1).refreshAll();

	return createdResult.value;
});

export const updateForm = form(updateFormSchema, async (params) => {
	await requirePermission(RESOURCE, 'update'); // 🔒

	const { locals } = getRequestEvent();

	const updatedResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).update(params.id, toPbPayload(params, ['id'])), mapUnknownToError);

	if (updatedResult.isErr()) {
		throwFormError(updatedResult.error, params);
	}

	await requested(getList, 1).refreshAll();

	return updatedResult.value;
});

// Silme (tek kayıt da bir elemanlı liste olarak gelir; bkz. dt.createRowDelete)
export const deleteRecords = command(deleteManySchema, async ({ ids }) => {
	await requirePermission(RESOURCE, 'delete'); // 🔒

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

// Hücre düzenleme (tek hücre de bir elemanlı liste olarak gelir; bkz. dt.createCellEdit). Hücreler kayıt bazında
// birleştirilir, her kayıt tek istekle güncellenir. Boş değerler PocketBase'e '' olarak gider (alan temizlenir).
export const updateCells = command(TABLE.cellsEditSchema, async (edits) => {
	await requirePermission(RESOURCE, 'update'); // 🔒
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
