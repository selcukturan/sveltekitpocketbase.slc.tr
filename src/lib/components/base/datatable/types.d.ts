export type RowKey = string;
export type RowValue = unknown;
export type Row = Record<RowKey, RowValue>;
export type Row = {
	id: string | number; // required
} & Record<RowKey, RowValue>;

export type Field<TData> = Extract<keyof TData, string>;

// 100px | minmax(100px,1.25fr) | minmax(1fr,1.25fr)
export type Width =
	| `${number}px`
	| `minmax(${number}px,${number}fr)`
	| `minmax(${number}fr,${number}fr)`;

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
	columns: VisibleColumn<TData>[];
	dataLength: number;
	headerHeight: number;
	headerCount: number;
};
export type HeaderCellType<TData> = {
	label: Column<TData>['label'];
	col: VisibleColumn<TData>;
	colVisibleIndex: number;
};
// --------------------------------------------------------------------------------------------------------------------------------------------
export type DataRowType<TData> = {
	row: TData;
	columns: VisibleColumn<TData>[];
	rowVirtualIndex: number;
	rowOriginalIndex: number;
	dataLength: number;
	dataHeight: number;
	headerCount: number;
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
	columns: VisibleColumn<TData>[];
	footerIndex: number;
	dataLength: number;
	footerLength: number;
	footerHeight: number;
	headerCount: number;
};
export type FooterCellType<TData> = {
	value: FooterValueType;
	col: VisibleColumn<TData>;
	colVisibleIndex: number;
};
