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
