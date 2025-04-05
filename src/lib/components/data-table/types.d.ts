export type RowKey = string;
export type RowValue = unknown;
export type Row = Record<RowKey, RowValue> & {
	oi?: number; // original row index
};

export type Field<TData> = Extract<keyof TData, RowKey> | '_selection' | '_action';

// 100px | 1.25fr | minmax(100px,1.25fr) | minmax(1.25fr,100px) | minmax(1fr,1.25fr) | minmax(100px,200px)
export type Width =
	| `${number}px`
	| `${number}fr`
	| `minmax(${number}px,${number}fr)`
	| `minmax(${number}fr,${number}px)`
	| `minmax(${number}fr,${number}fr)`
	| `minmax(${number}px,${number}px)`;

export type Column<TData> = {
	field: Field<TData>; // field required
	label?: string;
	hidden?: boolean;
	resizeable?: boolean;
	editable?: boolean;
	align?: 'left' | 'center' | 'right';
	alignHeader?: 'left' | 'center' | 'right';
	alignFooter?: 'left' | 'center' | 'right';
	width?: Width;
	oi?: number; // original column index
};

export type Footer<TData> = Partial<Record<Field<TData>, string>>;

export type Sources<TData> = {
	id: string; // required
	data?: TData[];
	width?: string;
	height?: string;
	enableVirtualization?: boolean;
	rowSelection?: 'none' | 'single' | 'multiple';
	rowSelectionColumnWidth?: number;
	actions?: {
		tableActions?: { label: string; action: string }[];
		rowActions?: { label: string; action: string }[];
	};
	rowAction?: boolean;
	rowActionColumnWidth?: number;
	theadRowHeight?: number;
	tbodyRowHeight?: number;
	tfootRowHeight?: number;
	columns: Column<TData>[]; // required
	footers?: Footer<TData>[];
};
export type RequiredSources<TData> = Required<Sources<TData>>;

export type FocucedCell = {
	rowIndex?: number;
	colIndex?: number;
	originalCell?: `${number}_${number}`;
	tabIndex?: number;
};

export type OnActionParams = { type: 'row' | 'table'; rowIndex?: number; action: string };
// Events Types
export type OnCellFocusChange = (params: { rowIndex: number; colIndex: number }) => void;
export type OnRowSelectionChange = (params: { selectedRows: number[] }) => void;
export type OnRowAction = (params: OnActionParams) => void;
export type OnTableAction = (params: OnActionParams) => void;
