/**
 * Width
 *
 * 100px |
 * 1.25fr |
 * minmax(100px,1.25fr) |
 * minmax(1.25fr,100px) |
 * minmax(1fr,1.25fr) |
 * minmax(100px,200px)
 */
export type Width = `${number}px` | `${number}fr` | `minmax(${number}px,${number}fr)` | `minmax(${number}fr,${number}px)` | `minmax(${number}fr,${number}fr)` | `minmax(${number}px,${number}px)`;

export type TableColumnType = {
	label: string;
	field: string;
	type: 'string' | 'number';
	hidden?: boolean;
	resizeable?: boolean;
	editable?: boolean;
	align?: 'left' | 'center' | 'right';
	alignHeader?: 'left' | 'center' | 'right';
	alignFooter?: 'left' | 'center' | 'right';
	width?: Width;
};

export type FooterType = {
	[key: string]: `str(${string})` | `sum(${number})` | `avg(${number})` | `cnt()`;
};

export type SettingsType = {
	columns?: TableColumnType[];
	footers?: FooterType[];
	columnSelect?: boolean;
	columnAction?: boolean;
	element?: HTMLTableElement;
	theadRowHeight?: string;
	tbodyRowHeight?: string;
	tfootRowHeight?: string;
};

//##################################################################################################################
// export type TableDataRowValueType = string | number | boolean | object | any[] | Date | null | undefined;
// export type TableDataRowValueType = { [key: string]: any  }
export type TableDataRowValueType = unknown | object | any[];
export type TableDataRowType = {
	[key: string]: TableDataRowValueType;
	sysOriginalIndex?: number;
};

/**
 * let value: unknown;
 *
 * value = 42; // number
 * value = "hello"; // string
 * value = true; // boolean
 *
 * # Tür kontrolü yapmadan kullanamazsınız
 * let num: number = value; # Hata verir
 *
 * # Tür kontrolü yaparak kullanabilirsiniz
 * if (typeof value === "number") {
 *    let num: number = value; // Hata vermez
 * }
 */
