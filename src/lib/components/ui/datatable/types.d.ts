export type RowKey = string;
export type RowValue = unknown;
export type Row = {
	id: string | number; // required
} & Record<RowKey, RowValue>;

// Veri alanı ya da sanal alan. Sanal alanlar `_` ile başlar (örn: '_actions') ve satır verisinde karşılığı yoktur.
export type VirtualField = `_${string}`;
export type Field<TData> = Extract<keyof TData, string> | VirtualField;

// 100px | minmax(100px,1.25fr) | minmax(1fr,1.25fr)
export type Width = `${number}px` | `minmax(${number}px,${number}fr)` | `minmax(${number}fr,${number}fr)`;

// Hücrenin nasıl gösterileceği. Verilmezse değerden tahmin edilir (bkz. Value.svelte).
// 'actions': satır işlem butonları; DataTable'ın `actions` snippet'i ile çizilir.
// 'select': satır seçim kolonu (onay kutusu); `selection` prop'u 'single' | 'multiple' iken. Sıralanmaz, genişletilmez.
export type ColumnType = 'text' | 'number' | 'bool' | 'date' | 'datetime' | 'list' | 'json' | 'actions' | 'select';

export type Align = 'left' | 'center' | 'right';

export type Column<TData> = {
	field: Field<TData>; // required
	label?: string; // çeviri anahtarı olabilir: t(label) bulunamazsa label olduğu gibi gösterilir
	type?: ColumnType;
	hidden?: boolean;
	resizeable?: boolean;
	sortable?: boolean;
	align?: Align; // varsayılan: number/date/datetime → right, bool/actions → center, diğerleri → left
	alignHeader?: Align;
	alignFooter?: Align;
	width?: Width;
	// Hücre düzenleme (DataTable'a onCellEdit verilmeli). Düzenleyici tipe göre: text, number, bool (anında değişir),
	// date, datetime; `options` verilirse açılır liste. list/json/actions/select düzenlenmez.
	// Fonksiyon verilirse satır bazında karar verilir: editable: (row) => !row.locked
	// Kendi dataRow snippet'inde <DataCell editable={...}> bunu o hücre için geçersiz kılar.
	editable?: boolean | ((row: TData) => boolean);
	options?: readonly (string | { value: string; label: string })[];
};

export type VisibleColumn<TData> = {
	data: Column<TData>;
	originalIndex: number;
};
// --------------------------------------------------------------------------------------------------------------------------------------------
export type HeaderRowType<TData> = {
	headerIndex: number;
};
export type HeaderCellType<TData> = {
	label: Column<TData>['label'];
	col: VisibleColumn<TData>;
	colVisibleIndex: number;
};
// --------------------------------------------------------------------------------------------------------------------------------------------
export type DataRowType<TData> = {
	row: TData;
	rowVirtualIndex: number;
	rowOriginalIndex: number;
};
export type DataCellType<TData> = {
	value: unknown;
	col: VisibleColumn<TData>;
	colVisibleIndex: number;
};
// --------------------------------------------------------------------------------------------------------------------------------------------
type FooterValueType = unknown;
export type Footer<TData> = {
	[K in keyof TData]?: FooterValueType;
};
export type FooterRowType<TData> = {
	footerRow: Footer<TData>;
	footerIndex: number;
};
export type FooterCellType<TData> = {
	value: FooterValueType;
	col: VisibleColumn<TData>;
	colVisibleIndex: number;
};

export type ListResult<TData> = {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: Array<TData>;
};
