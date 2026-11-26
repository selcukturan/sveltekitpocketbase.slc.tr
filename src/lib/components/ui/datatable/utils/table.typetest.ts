// Tip testi (çalışmaz, yalnızca `npm run check` ile derlenir): defineTable'ın derleme zamanı güvenceleri.
// Her @ts-expect-error satırı bir hatayı yakalamak zorunda; yakalamazsa svelte-check "kullanılmayan ts-expect-error" der.
// Hiçbir yerden içe aktarılmaz.
import * as v from 'valibot';
import { defineTable } from './table.js';

const TABLE = defineTable({
	defaultSort: 'name',
	columns: {
		name: { sortable: true, filter: true, edit: v.pipe(v.string(), v.nonEmpty()) },
		price: { type: 'number', sortable: true, filter: true, edit: true, editable: (row) => !row.locked },
		kind: { options: ['a', 'b'], filter: true, edit: true }
	}
});

type Good = { id: string; name: string; price: number; kind: string; locked: boolean };
type Missing = { id: string; name: string; price: number }; // 'kind' yok (örn. view bu alanı döndürmüyor)

export const ok = TABLE.columnsFor<Good>({
	prepend: [{ field: '_select', type: 'select' }],
	override: { price: { width: '90px', editable: (row) => row.price < 100 }, kind: { editable: false } },
	append: [{ field: '_total', label: 'Toplam', type: 'number' }]
});

// @ts-expect-error: tanımdaki bir alan satır tipinde yok
export const missingField = TABLE.columnsFor<Missing>();
// @ts-expect-error: override izin veremez (sortable sunum alanı değil)
export const grantSort = TABLE.columnsFor<Good>({ override: { name: { sortable: true } } });
// @ts-expect-error: override editable'ı genişletemez (yalnızca false ya da ek kural)
export const widenEdit = TABLE.columnsFor<Good>({ override: { kind: { editable: true } } });
// @ts-expect-error: sayfanın eklediği kolon sıralanamaz
export const extraSort = TABLE.columnsFor<Good>({ append: [{ field: '_x', sortable: true }] });
// @ts-expect-error: sayfanın eklediği kolon düzenlenemez
export const extraEdit = TABLE.columnsFor<Good>({ append: [{ field: '_x', editable: true }] });
// @ts-expect-error: tanımda olmayan alan ezilemez
export const unknownOverride = TABLE.columnsFor<Good>({ override: { nope: { width: '90px' } } });

// --- defaultSort (derleme zamanı) ---
const columns = { a: { sortable: true }, b: { sortable: true }, c: {} } as const;
export const sortAsc = defineTable({ defaultSort: 'a', columns });
export const sortDescMulti = defineTable({ defaultSort: '-a,b', columns });
export const sortPlus = defineTable({ defaultSort: '+b,-a', columns });
export const sortEmpty = defineTable({ defaultSort: '', columns });
// @ts-expect-error: sortable olmayan kolon
export const sortNotSortable = defineTable({ defaultSort: 'c', columns });
// @ts-expect-error: tanımda olmayan alan (yazım hatası)
export const sortTypo = defineTable({ defaultSort: '-aa', columns });
// @ts-expect-error: çoklu sıralamada sonraki parça geçersiz
export const sortMultiBad = defineTable({ defaultSort: 'a,-x', columns });
// @ts-expect-error: aynı alan iki kez
export const sortDuplicate = defineTable({ defaultSort: 'a,-a', columns });
// editable fonksiyonu olsa da (parametresi tipli ya da tipsiz) denetlenir
// @ts-expect-error: yazım hatası, editable parametresi tipsiz
export const sortUntypedFn = defineTable({ defaultSort: 'nam', columns: { name: { sortable: true, editable: (row) => !row.locked } } });
// @ts-expect-error: yazım hatası, editable parametresi tipli
export const sortTypedFn = defineTable({ defaultSort: 'nam', columns: { name: { sortable: true, editable: (row: Record<string, unknown>) => !row.locked } } });
export const sortFnOk = defineTable({ defaultSort: '-name', columns: { name: { sortable: true, editable: (row) => !row.locked } } });
