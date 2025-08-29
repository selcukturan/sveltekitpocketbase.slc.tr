export type RowKey = string;
export type RowValue = unknown;
export type Row = Record<RowKey, RowValue>;

export type Field<TData> = Extract<keyof TData, RowKey>;

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

export type Footer<TData> = Partial<Record<Field<TData>, string>>;

export type Sources<TData> = {
	id: string; // required
	data?: TData[];
	width?: string;
	height?: string;
	rowSelection?: 'none' | 'single' | 'multiple' | 'multiple-all';
	rowSelectionColumnWidth?: number;
	subtotal?: boolean;
	actions?: {
		tableActions?: { label: string; action: string }[];
		rowActions?: { label: string; action: string }[];
	};
	rowAction?: boolean;
	rowActionColumnWidth?: number;
	zebra?: boolean;
	hoverableRows?: boolean;
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

// Events Types
export type OnCellFocusChange = (params: {
	rowIndex: number;
	colIndex: number;
}) => void;
export type OnRowSelectionChange = (params: { selectedRows: number[] }) => void;
export type OnCellEdit = (params: {
	newValue: unknown;
	oldValue: unknown;
	rowIndex: number;
	colIndex: number;
	field: Field<TData>;
}) => void;
export type OnColumnResize = (params: {
	colIndex: number;
	width: number;
	field: Field<TData>;
}) => void;
export type OnVirtualDataChange = (params: {
	visibleStart?: number;
	visibleEnd?: number;
	overscanStart?: number;
	overscanEnd?: number;
	scrollTop?: number;
	clientHeight?: number;
	focusedCellRowIndex?: number;
}) => void;
export type OnActionParams = {
	type: 'data' | 'header' | 'footer';
	rowIndex: number;
	action: string;
};
export type OnRowAction = (params: OnActionParams) => void;
export type OnTableAction = (params: OnActionParams) => void;
