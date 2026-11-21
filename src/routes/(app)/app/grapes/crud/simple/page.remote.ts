import { getRequestEvent, query, form, command, requested } from '$app/server';
import * as v from 'valibot';
import { Collections, DemoCrudSelectOptionalMultipleOptions, DemoCrudSelectOptionalSingleOptions } from '#lib/types/pocketbase-types.js';
import { checkAuthenticated } from '#lib/remotes/guarded.remote.js';
import { ResultAsync } from 'neverthrow';
import { throwError, throwFormError, mapUnknownToError } from '#lib/server/error.js';
import { toPbPayload } from '#lib/utils/transform-params-helper.js';

import { listParamsSchema, oneParamsSchema, createFormSchema, updateFormSchema, deleteParamsSchema, cellEditSchema } from './page.shared';

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

// Tablo içinde tek hücre düzenleme: yalnızca o alan güncellenir. Boş değerler PocketBase'e '' olarak gider (alan temizlenir).
export const updateCell = command(cellEditSchema, async ({ id, field, value }) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	const updatedResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.DemoCrud).update(id, { [field]: value ?? '' }), mapUnknownToError);

	if (updatedResult.isErr()) {
		throwError(updatedResult.error);
	}

	await requested(getList, 1).refreshAll();

	return updatedResult.value;
});

// ######################################################################################################################
// GEÇİCİ: Sayfalama ve virtual scroll testi için rastgele kayıtlar. Test bitince bu bölümü ve sayfadaki butonları silin.
// Kayıtlar `text_optional = 'seed-…'` ile işaretlenir; `deleteSeedRecords` yalnızca bunları siler.
// ######################################################################################################################
const SEED_PREFIX = 'seed-';
const SEED_CONCURRENCY = 25; // PocketBase'e aynı anda giden istek sayısı

const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const words = ['alfa', 'beta', 'gama', 'delta', 'kalem', 'defter', 'masa', 'kitap', 'elma', 'armut', 'deniz', 'dag', 'nehir', 'bulut', 'yildiz'] as const;
const randomDate = () =>
	new Date(Date.UTC(2020 + Math.floor(Math.random() * 7), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28), Math.floor(Math.random() * 24)));

// Diziyi SEED_CONCURRENCY'lik gruplar hâlinde paralel işler
async function inChunks<T>(items: T[], run: (item: T) => Promise<unknown>) {
	for (let i = 0; i < items.length; i += SEED_CONCURRENCY) {
		await Promise.all(items.slice(i, i + SEED_CONCURRENCY).map(run));
	}
}

export const seedRecords = command(v.object({ count: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(10000)) }), async ({ count }) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();
	const collection = locals.pb.collection(Collections.DemoCrud);
	const stamp = Date.now().toString(36);

	const rows = Array.from({ length: count }, (_, i) => {
		const date = randomDate();
		return {
			text_required: `${pick(words)} ${pick(words)} ${i + 1}`,
			text_optional: `${SEED_PREFIX}${stamp}-${i + 1}`,
			bool_optional: Math.random() < 0.5,
			number_optional: Math.round(Math.random() * 100000) / 100,
			email_optional: Math.random() < 0.7 ? `${pick(words)}${i}@example.com` : '',
			select_optional_single: pick(Object.values(DemoCrudSelectOptionalSingleOptions)),
			select_optional_multiple: Object.values(DemoCrudSelectOptionalMultipleOptions).filter(() => Math.random() < 0.5),
			date_optional: date.toISOString().slice(0, 10) + ' 00:00:00.000Z',
			datetime_optional: date.toISOString().replace('T', ' ')
		};
	});

	const result = await ResultAsync.fromPromise(
		inChunks(rows, (row) => collection.create(row, { requestKey: null })),
		mapUnknownToError
	);
	if (result.isErr()) throwError(result.error);

	await requested(getList, 1).refreshAll();
	return { count };
});

export const deleteSeedRecords = command(async () => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();
	const collection = locals.pb.collection(Collections.DemoCrud);
	const filter = locals.pb.filter('text_optional ~ {:prefix}', { prefix: `${SEED_PREFIX}%` });

	let deleted = 0;
	const result = await ResultAsync.fromPromise(
		(async () => {
			// Silindikçe liste kısalır; her turda ilk 500 kayıt alınıp silinir
			for (;;) {
				const page = await collection.getList(1, 500, { filter, fields: 'id', skipTotal: true, requestKey: null });
				if (page.items.length === 0) break;
				await inChunks(page.items, (item) => collection.delete(item.id, { requestKey: null }));
				deleted += page.items.length;
			}
		})(),
		mapUnknownToError
	);
	if (result.isErr()) throwError(result.error);

	await requested(getList, 1).refreshAll();
	return { deleted };
});
