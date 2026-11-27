import * as v from 'valibot';
import type { RemoteQueryOverride } from '$app/server';
import { t } from '#lib/app/localization/index.js';
import type { CellEditEvent } from './editing.svelte.js';

/**
 * Tablo içinde hücre düzenleme: sayfadaki tekrar eden işi toplar. DataTable'a yayılır:
 *
 * @example
 * // page.remote.ts — tek komut (tek hücre de bir elemanlı liste olarak gelir)
 * export const updateCells = command(TABLE.cellsEditSchema, async (edits) => { … });
 * // +page.svelte
 * const cellEdit = dt.createCellEdit({ list, table: TABLE, save: updateCells, onError: toaster.error });
 * <dt.DataTable {list} {columns} {...cellEdit} />
 *
 * - validateCell: kaydetmeden önce aynı şemayla doğrular (TABLE.cellEditSchema); mesaj dönerse düzenleyici açık kalır.
 * - onCellEdit / onCellsEdit: kaydeder. Yeni değer sunucu yanıtı beklenmeden gösterilir (list.updatesWith); sunucu listeyi
 *   tazeleyince gerçek veri gelir, hata olursa SvelteKit bu geçici değeri geri alır.
 * - Yapıştırmada geçersiz hücreler tabloda elenir; sayısı onError(null, mesaj) ile bildirilir.
 */

type CellEdit = { id: string; field: string; value: unknown };

// Liste sonucu: sayfalı ({ items, page, … }) ya da sayfalamasız (dizi). Satır tipi buradan çıkarılır: DataTable<Item> ile aynı.
type Row = { id: string };
type ListResultOf = { items: Row[] } | Row[];
type RowOf<TResult> = TResult extends { items: (infer R)[] } ? R : TResult extends (infer R)[] ? R : never;

export type CellEditOptions<TResult extends ListResultOf> = {
	list: { updatesWith: (update: (current: TResult) => TResult) => RemoteQueryOverride[] };
	table: {
		cellEditSchema: v.GenericSchema<unknown, CellEdit>;
		cellsEditSchema: v.GenericSchema<unknown, CellEdit[]>;
	};
	// Sunucu komutu (command): düzenlemeleri kaydeder
	save: (edits: CellEdit[]) => { updates: (...overrides: RemoteQueryOverride[]) => Promise<unknown> };
	// Kayıt hatası (error) ya da bilgi mesajı (error null, message dolu). Örn: toaster.error
	onError?: (error: unknown, message?: string) => void;
};

export function createCellEdit<TResult extends ListResultOf>({ list, table, save, onError }: CellEditOptions<TResult>) {
	type TData = RowOf<TResult>;
	const toEdit = ({ row, field, value }: CellEditEvent<TData>): CellEdit => ({ id: row.id, field: field as string, value });

	// Geçici görünüm: listedeki ilgili kayıtlara yeni değerleri uygular
	const optimistic = (edits: CellEdit[]) =>
		list.updatesWith((result) => {
			const apply = (items: Row[]) =>
				items.map((item) => {
					const own = edits.filter((edit) => edit.id === item.id);
					return own.length ? { ...item, ...Object.fromEntries(own.map((edit) => [edit.field, edit.value])) } : item;
				});
			return (Array.isArray(result) ? apply(result) : { ...result, items: apply(result.items) }) as TResult;
		});

	const commit = async (events: CellEditEvent<TData>[]) => {
		const edits = v.parse(table.cellsEditSchema, events.map(toEdit)); // validateCell'den geçti; şemanın çıktısı (kırpılmış vb.) kaydedilir
		try {
			await save(edits).updates(...optimistic(edits));
		} catch (error) {
			onError?.(error);
		}
	};

	return {
		validateCell: (e: CellEditEvent<TData>) => {
			const result = v.safeParse(table.cellEditSchema, toEdit(e));
			return result.success ? undefined : result.issues[0].message;
		},
		onCellEdit: (e: CellEditEvent<TData>) => commit([e]),
		onCellsEdit: async (events: CellEditEvent<TData>[], { invalid }: { invalid: number }) => {
			if (invalid > 0) onError?.(null, t('dt_paste_invalid', { count: invalid }));
			if (events.length > 0) await commit(events);
		}
	};
}
