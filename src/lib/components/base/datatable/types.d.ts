export type RowKey = string;
export type RowValue = unknown;
export type Row = Record<RowKey, RowValue>;
export type Row = {
	id: string | number; // required
} & Record<RowKey, RowValue>;

export type Field<TData> = Extract<keyof TData, RowKey>;

export type Column<TData> = {
	field: Field<TData>; // required
	label?: string;
	hidden?: boolean;
};

export type VisibleColumn<TData> = {
	data: Column<TData>;
	originalIndex: number;
};

export type Footer<TData> = Partial<Record<Field<TData>, string>>;
