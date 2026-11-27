import { getRequestEvent, query } from '$app/server';
import { Collections } from '#lib/types/pocketbase-types.js';
import { checkAuthenticated } from '#lib/remotes/guarded.remote.js';
import { ResultAsync } from 'neverthrow';
import { throwError, mapUnknownToError } from '#lib/server/error.js';
import * as v from 'valibot';
import { normalizeStringForTurkishSearch } from '#lib/utils/common.js';

// Kayıt seçicinin (Relation input) arayabileceği koleksiyonlar: yalnızca ilişki alanlarının hedefleri. Yeni bir ilişki
// alanı eklenince hedef koleksiyonu buraya eklenmeli. (Önceden '_' ile başlamayan her koleksiyon açıktı: sys_users,
// sys_settings, acl_roles dahil.)
const RELATION_COLLECTIONS = [Collections.DemoRelationInputMultiple, Collections.DemoRelationInputSingle] as const;
// Çıktı tipi string kalır (Relation bileşenleri koleksiyonu genel tutar); izin listesi çalışma zamanında denetlenir
const collection = v.pipe(
	v.string(),
	v.check((value) => (RELATION_COLLECTIONS as readonly string[]).includes(value), 'Geçersiz koleksiyon.')
);
const id = v.pipe(v.string(), v.nonEmpty(), v.maxLength(64));

// Değerler filtre metnine yazılmaz, pb.filter yer tutucularına ({:x}) verilir: tırnak vb. ile filtreden çıkılamaz.

const relationListParamsSchema = v.object({
	// Aranan metin search_label ile aynı biçime getirilir (Türkçe: 'Öğr', 'ÖĞR', 'ogr' aynı sonucu verir; bkz. pb_hooks/utils.js)
	search: v.pipe(v.string(), v.maxLength(200), v.transform(normalizeStringForTurkishSearch)),
	collection,
	timestamp: v.optional(v.fallback(v.number(), 0), 0)
});
export type RelationListParamsType = v.InferOutput<typeof relationListParamsSchema>;

export const getRelationList = query(relationListParamsSchema, async (params) => {
	// 🔒🔐
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(params.collection).getList(1, 30, {
			filter: locals.pb.filter('search_label ~ {:search}', { search: params.search })
		}),
		mapUnknownToError
	);

	if (listResult.isErr()) {
		throwError(listResult.error);
	}

	return listResult.value;
});

const relationMultipleSelectedListParamsSchema = v.object({
	ids: v.pipe(v.array(id), v.maxLength(100)),
	collection,
	timestamp: v.optional(v.fallback(v.number(), 0), 0)
});
export const getMultipleRelationSelectedList = query(relationMultipleSelectedListParamsSchema, async (params) => {
	// 🔒🔐
	await checkAuthenticated();

	const { locals } = getRequestEvent();

	if (params.ids.length === 0) {
		return [];
	}

	// id = {:id0} || id = {:id1} || …
	const values = Object.fromEntries(params.ids.map((value, i) => [`id${i}`, value]));
	const idsFilter = locals.pb.filter(params.ids.map((_, i) => `id = {:id${i}}`).join(' || '), values);

	const listResult = await ResultAsync.fromPromise(
		locals.pb.collection(params.collection).getFullList({
			filter: idsFilter
		}),
		mapUnknownToError
	);

	if (listResult.isErr()) {
		throwError(listResult.error);
	}

	return listResult.value;
});

const relationSingleSelectedListParamsSchema = v.object({
	id: v.union([v.literal(''), id]), // '' = seçim yok
	collection,
	timestamp: v.optional(v.fallback(v.number(), 0), 0)
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
			filter: locals.pb.filter('id = {:id}', { id: params.id })
		}),
		mapUnknownToError
	);

	if (listResult.isErr()) {
		throwError(listResult.error);
	}

	return listResult.value;
});
