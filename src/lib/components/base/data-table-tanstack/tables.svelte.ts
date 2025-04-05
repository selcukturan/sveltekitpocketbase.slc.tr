import { type ColumnDef, type TableOptionsResolved, getCoreRowModel, createSvelteTable } from './tanstack';
import type { SettingsType, SettingsDefType } from './types';
import { createVirtualizer } from './tanstack/virtual';
import { getContext, setContext } from 'svelte';

class Table<TData> {
	private readonly defaultSettings: SettingsDefType = {
		selectionColumn: true,
		actionColumn: true,
		theadRowHeight: 35,
		tbodyRowHeight: 35,
		tfootRowHeight: 35
	};

	// ################################## BEGIN Constructor ###############################################################
	element!: HTMLTableElement;
	setData: TData[] = $state([]);
	setColumns: ColumnDef<TData>[] = $state([]);
	setSettings: SettingsType = $state({});
	constructor(data: TData[] = [], columns: ColumnDef<TData>[] = [], settings: SettingsType = {}) {
		this.setData = data;
		this.setColumns = columns;
		this.setSettings = settings;
	}
	// ################################## END Constructor ###############################################################

	// ################################## BEGIN Properties ###############################################################
	settings: SettingsDefType = $derived({ ...this.defaultSettings, ...this.setSettings });
	// ################################## END Properties ###############################################################

	// ################################## BEGIN Create Tanstack Table ###############################################################
	options: TableOptionsResolved<TData> = $derived({
		data: this.setData,
		columns: this.setColumns,
		getCoreRowModel: getCoreRowModel(),
		state: { columnPinning: {} },
		onStateChange: () => {},
		renderFallbackValue: null,
		columnResizeMode: 'onChange',
		defaultColumn: {
			size: 200,
			minSize: 50,
			maxSize: 500
		},
		debugTable: true
	});
	tanstack = $derived(createSvelteTable(this.options));
	rows = $derived(this.tanstack.getRowModel().rows);
	virtualizer = $derived(
		createVirtualizer({
			count: this.rows.length,
			estimateSize: () => this.settings.tbodyRowHeight,
			getScrollElement: () => this.element,
			overscan: 0
		})
	);
	// ################################## END Create Tanstack Table ###############################################################

	public getGridTemplateRows = () => {
		return `repeat(1,${this.settings.theadRowHeight}px) repeat(${this.rows.length},${this.settings.tbodyRowHeight}px) repeat(1,${this.settings.tfootRowHeight}px)`;
	};
	public getGridTemplateColumns = () => {
		return this.tanstack
			.getHeaderGroups()[0]
			.headers.map((header) => (header.getSize() ? `${header.getSize()}px` : `100px`))
			.join(' ');
	};
}

// ################################## BEGIN Export Table Context ###############################################################
const SLC_TABLE_CONTEXT_KEY = Symbol('SLC_TABLE_CONTEXT_KEY');
export function setTable<TData>(data: TData[], columns: ColumnDef<TData>[], settings?: SettingsType): Table<TData> {
	const table = new Table(data, columns, settings);
	setContext(SLC_TABLE_CONTEXT_KEY, table);
	return table;
}
/* export function xgetTable<TData>(): Table<TData> {
	return getContext<Table<TData>>(SLC_TABLE_CONTEXT_KEY);
} */
export function getTable<TData>() {
	return getContext<ReturnType<typeof setTable<TData>>>(SLC_TABLE_CONTEXT_KEY);
}
//
// ################################## END Export Table Context #################################################################
