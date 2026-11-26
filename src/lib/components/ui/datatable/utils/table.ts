import * as v from 'valibot';
import type { Align, Column, ColumnType, Width } from '../types.js';
import { defineFilters, type FilterDef, type FilterType } from './filter.js';
import { isValidSort } from './sort.js';

/**
 * Tablo tanımı: kolonlar ve kolon başına izinler tek yerde (page.shared.ts). Saf modül: sunucuda da kullanılır.
 * Satır tipini bilmez (alan adları string); tip kontrolü sayfada columnsFor<Item>() ile yapılır. Böylece veri kaynağı
 * koleksiyon, view ya da özel sorgu olabilir; Item her zaman listenin döndürdüğü tiptir.
 *
 * Kolon ayarları üç grup:
 *   sunum       label, type, width, align…, hidden, options      → istemci (columnsFor)
 *   izinler     sortable, filter, edit (hepsi opt-in)           → sunucu doğrular (listParamsSchema, cellEditSchema)
 *   satır kuralı editable: (row) => boolean (saf)               → istemci ve sunucu (canEdit)
 *
 * Sayfa sunumu değiştirebilir, izin veremez: columnsFor'daki override yalnızca sunumu ezer ve editable'ı daraltır;
 * prepend/append ile eklenen kolonlar istemcide yaşar (sıralanmaz, filtrelenmez, düzenlenmez).
 *
 * @example
 * // page.shared.ts
 * export const TABLE = defineTable({
 *   defaultSort: 'text_required',
 *   columns: {
 *     text_required: { label: 'dt_text_required', sortable: true, filter: true, edit: v.pipe(v.string(), v.trim(), v.nonEmpty()) },
 *     number_optional: { type: 'number', sortable: true, filter: true, edit: true },
 *     bool_optional: { type: 'bool', filter: true, edit: true, editable: (row) => !row.locked }
 *   }
 * });
 * // page.remote.ts: query(TABLE.listParamsSchema, …) · filter: TABLE.filters.toPb(pb, params.filterData)
 * //                 command(TABLE.cellEditSchema, …) · TABLE.canEdit(record, field)
 * // +page.svelte:   const columns = TABLE.columnsFor<Item>({ prepend: [...], override: {...} })
 */

type AnyRow = Record<string, unknown>;
type DataType = Exclude<ColumnType, 'actions' | 'select'>;

export type TableColumnDef = {
	// sunum
	label?: string; // çeviri anahtarı olabilir
	type?: DataType;
	width?: Width;
	align?: Align;
	alignHeader?: Align;
	alignFooter?: Align;
	hidden?: boolean;
	resizeable?: boolean;
	options?: readonly string[]; // seçim listesi: düzenleyici, seçim filtresi ve doğrulama
	// izinler (opt-in; sunucu doğrular)
	sortable?: boolean;
	filter?: boolean | FilterType; // true: türü kolondan (options → select, number, date, datetime, bool, diğer → text)
	edit?: boolean | v.GenericSchema; // true: türe göre varsayılan şema; şema verilirse o (örn. zorunlu metin)
	// satır kuralı (saf; sunucuda da çalışır)
	editable?: (row: AnyRow) => boolean;
};

// --- defaultSort'un derleme zamanı kontrolü ---
// sortable: true işaretli kolonların adları
// C henüz çıkarılmamışken (genel Record<string, …>) her alan kabul edilir: aksi hâlde TypeScript'in ilk çıkarım aşamasında
// defaultSort metni bağlamsal tipini kaybedip 'string'e genişler. Asıl denetim C kesinleşince yapılır.
export type SortableKeys<C> = string extends keyof C ? string : { [K in keyof C]: C[K] extends { sortable: true } ? K : never }[keyof C] & string;
// Parçadaki alan adı ('-alan' / '+alan' / 'alan')
type SortField<P extends string> = P extends `-${infer F}` ? F : P extends `+${infer F}` ? F : P;
// Metni virgülle parçalayıp her parçayı denetler (Seen: tekrar kontrolü). Geçerliyse S, değilse okunur bir hata tipi:
// editör "… 'Geçersiz defaultSort: …' tipine atanamaz" der. Boşluk kabul edilmez ('-a,b' yazın, '-a, b' değil).
type CheckSort<S extends string, K extends string, Seen extends string = never> = S extends `${infer Head},${infer Rest}`
	? SortField<Head> extends K
		? SortField<Head> extends Seen
			? `Geçersiz defaultSort: '${SortField<Head>}' tekrar ediyor`
			: CheckSort<Rest, K, Seen | SortField<Head>>
		: `Geçersiz defaultSort: '${SortField<Head>}' tanımda yok ya da sortable: true değil`
	: SortField<S> extends K
		? SortField<S> extends Seen
			? `Geçersiz defaultSort: '${SortField<S>}' tekrar ediyor`
			: true
		: `Geçersiz defaultSort: '${SortField<S>}' tanımda yok ya da sortable: true değil`;
// string extends S: S çıkarılamadıysa (genel string) derleme zamanında denetlenmez; çalışma zamanı denetimi (isValidSort) kalır.
export type ValidSort<S extends string, K extends string> = string extends S ? S : S extends '' ? S : CheckSort<S, K> extends true ? S : CheckSort<S, K>;

export type TableDef<C extends Record<string, TableColumnDef>, S extends string = string> = {
	columns: C;
	// sortable alanlardan; '-' azalan, çoklu: '-number_optional,text_required' ('' = PocketBase varsayılanı).
	// Derleme zamanında denetlenir (ValidSort); çalışma zamanında da (isValidSort).
	defaultSort: ValidSort<S, SortableKeys<C>>;
	perPage?: number; // varsayılan sayfa boyutu (30)
};

// Sayfanın ezebileceği sunum alanları; editable yalnızca daraltır (false ya da tanımdaki kuralla VE'lenen ek kural)
type Presentation = 'label' | 'type' | 'width' | 'align' | 'alignHeader' | 'alignFooter' | 'hidden' | 'resizeable';
export type ColumnOverride<TData> = Partial<Pick<Column<TData>, Presentation>> & { editable?: false | ((row: TData) => boolean) };
// Sayfanın eklediği kolon (sanal: '_select', '_actions' ya da hesaplanan): sıralanmaz, filtrelenmez, düzenlenmez
export type ExtraColumn<TData> = Omit<Column<TData>, 'sortable' | 'editable' | 'options'>;

export type ColumnsForOptions<TData, K extends string> = {
	prepend?: ExtraColumn<TData>[];
	append?: ExtraColumn<TData>[];
	override?: Partial<Record<K, ColumnOverride<TData>>>;
	order?: string[]; // alan sırası; listede olmayanlar mevcut sıralarıyla sona
};

const MAX_PER_PAGE = 1000;

// filter: true → kolon tipinden filtre türü
const filterTypeOf = (col: TableColumnDef): FilterType => {
	if (typeof col.filter === 'string') return col.filter;
	if (col.options) return 'select';
	if (col.type === 'number') return 'number';
	if (col.type === 'date') return 'date';
	if (col.type === 'datetime') return 'datetime'; // gün sınırları uygulama saat diliminde
	if (col.type === 'bool') return 'bool';
	return 'text';
};

// edit: true → DataTable düzenleyicisinin verdiği değer tipine göre şema (bkz. state/editing.svelte.ts)
const editSchemaOf = (col: TableColumnDef): v.GenericSchema => {
	if (typeof col.edit === 'object') return col.edit;
	if (col.options) return v.nullable(v.picklist(col.options as string[]));
	if (col.type === 'number') return v.nullable(v.number());
	if (col.type === 'bool') return v.boolean();
	if (col.type === 'date') return v.nullable(v.pipe(v.string(), v.isoDate()));
	if (col.type === 'datetime') return v.nullable(v.pipe(v.string(), v.nonEmpty()));
	if (col.type === 'list' || col.type === 'json') throw new Error('list/json kolonları düzenlenemez.');
	return v.pipe(v.string(), v.trim());
};

export function defineTable<const C extends Record<string, TableColumnDef>, const S extends string>(def: TableDef<C, S>) {
	type K = Extract<keyof C, string>;
	const entries = Object.entries(def.columns) as [K, TableColumnDef][];

	// --- sıralama ---
	const sortable = entries.filter(([, col]) => col.sortable).map(([field]) => field as string);
	const defaultSort = def.defaultSort as string; // tip denetimi ValidSort'ta; gövdede düz metin
	if (!isValidSort(defaultSort, sortable)) throw new Error(`defaultSort sıralanabilir alanlardan olmalı: ${defaultSort}`);

	// --- filtreler ---
	const filters = defineFilters(
		Object.fromEntries(
			entries
				.filter(([, col]) => col.filter)
				.map(([field, col]): [string, FilterDef] => [field, { type: filterTypeOf(col), options: col.options, label: col.label ?? field }])
		)
	);

	// --- liste parametreleri: istemciden yalnızca sayfa, sayfa boyutu, sıralama ve filtre (expand/fields sunucuda sabit) ---
	const listParamsSchema = v.object({
		page: v.optional(v.fallback(v.pipe(v.number(), v.integer(), v.minValue(1)), 1), 1),
		perPage: v.optional(v.fallback(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(MAX_PER_PAGE)), def.perPage ?? 30), def.perPage ?? 30),
		options: v.object({
			sort: v.optional(
				v.pipe(
					v.string(),
					v.check((sort) => isValidSort(sort, sortable), 'Geçersiz sıralama alanı.')
				),
				defaultSort
			)
		}),
		filterData: filters.schema,
		timestamp: v.optional(v.fallback(v.number(), 0), 0)
	});

	// --- hücre düzenleme ---
	const editable = entries.filter(([, col]) => col.edit);
	const cellId = { id: v.pipe(v.string(), v.nonEmpty()) };
	const options = editable.map(([field, col]) => v.object({ ...cellId, field: v.literal(field as string), value: editSchemaOf(col) }));
	// Düzenlenebilir kolon yoksa her istek reddedilir
	const cellEditSchema: v.GenericSchema<unknown, { id: string; field: string; value: unknown }> = options.length
		? (v.variant('field', options as [(typeof options)[number], ...(typeof options)[number][]]) as v.GenericSchema<
				unknown,
				{ id: string; field: string; value: unknown }
			>)
		: (v.pipe(
				v.unknown(),
				v.check(() => false, 'Düzenlenebilir alan yok.')
			) as unknown as v.GenericSchema<unknown, { id: string; field: string; value: unknown }>);
	const cellsEditSchema = v.pipe(v.array(cellEditSchema), v.minLength(1), v.maxLength(1000));

	// Sunucu: alan düzenlenebilir mi ve satır kuralı izin veriyor mu (kural varsa kaydın güncel hâli verilmeli)
	const canEdit = (row: AnyRow, field: string) => {
		const col = def.columns[field as K] as TableColumnDef | undefined;
		return Boolean(col?.edit) && (col?.editable ? col.editable(row) : true);
	};
	// Satır kuralı olan alanlar: sunucu bunlarda kaydı okuyup canEdit ile denetler
	const ruleFields = new Set(entries.filter(([, col]) => col.edit && col.editable).map(([field]) => field as string));

	// --- sayfa: kolonlar (tip kontrolü burada: tanımdaki her alan Item'da olmalı) ---
	const columnsFor = <TData extends Record<K, unknown>>(opts: ColumnsForOptions<TData, K> = {}): Column<TData>[] => {
		const extra = (col: ExtraColumn<TData>): Column<TData> => ({ ...col, sortable: false, editable: false });
		const base = entries.map(([field, col]): Column<TData> => {
			const override = opts.override?.[field];
			const { editable: narrow, ...presentation } = override ?? {};
			const rule = col.editable as ((row: TData) => boolean) | undefined;
			let editableValue: Column<TData>['editable'] = Boolean(col.edit) && narrow !== false;
			if (editableValue && (rule || narrow)) editableValue = (row: TData) => (rule ? rule(row) : true) && (narrow ? narrow(row) : true);
			return {
				field: field as Column<TData>['field'],
				label: col.label,
				type: col.type,
				width: col.width,
				align: col.align,
				alignHeader: col.alignHeader,
				alignFooter: col.alignFooter,
				hidden: col.hidden,
				resizeable: col.resizeable,
				options: col.options,
				sortable: Boolean(col.sortable),
				editable: editableValue,
				...presentation
			};
		});
		const all = [...(opts.prepend ?? []).map(extra), ...base, ...(opts.append ?? []).map(extra)];
		if (!opts.order) return all;
		const rank = (col: Column<TData>) => {
			const i = opts.order!.indexOf(col.field as string);
			return i === -1 ? opts.order!.length : i;
		};
		return all
			.map((col, i) => ({ col, i }))
			.sort((a, b) => rank(a.col) - rank(b.col) || a.i - b.i)
			.map(({ col }) => col);
	};

	return { columns: def.columns, sortable, defaultSort, filters, listParamsSchema, cellEditSchema, cellsEditSchema, canEdit, ruleFields, columnsFor };
}

export type Table = ReturnType<typeof defineTable>;
