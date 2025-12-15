export type RowKey = string;
export type RowValue = unknown;
export type Row = Record<RowKey, RowValue>;
export type Row = {
	id: string | number; // required
} & Record<RowKey, RowValue>;

export type Field<TData> = Extract<keyof TData, string>;

// 100px | minmax(100px,1.25fr) | minmax(1fr,1.25fr)
export type Width = `${number}px` | `minmax(${number}px,${number}fr)` | `minmax(${number}fr,${number}fr)`;

export type Column<TData> = {
	field: Field<TData>; // required
	label?: string;
	hidden?: boolean;
	resizeable?: boolean;
	editable?: boolean;
	align?: 'left' | 'center' | 'right';
	alignHeader?: 'left' | 'center' | 'right';
	alignFooter?: 'left' | 'center' | 'right';
	width?: Width;
};

export type VisibleColumn<TData> = {
	data: Column<TData>;
	originalIndex: number;
};
// --------------------------------------------------------------------------------------------------------------------------------------------
export type HeaderRowType<TData> = {
	test: string;
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
	value: TData[Field<TData>];
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

type ListResult<TData> = {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: Array<TData>;
};
