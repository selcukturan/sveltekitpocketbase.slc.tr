import type { Settings, DefaultSettings, Row, FocucedCell, Footers } from './types';
import { getContext, setContext } from 'svelte';

class Table<TData extends Row> {
	private readonly defaultSettings: DefaultSettings<TData> = {
		selectionColumn: false,
		actionColumn: false,
		theadRowHeight: 35,
		tbodyRowHeight: 35,
		tfootRowHeight: 35,
		columns: [],
		footers: []
	};

	// ################################## BEGIN Constructor ###############################################################
	element!: HTMLTableElement;
	setData: TData[] = $state([]); // orjinal data. veriyi değiştirirken bu değişken kullanılacak. `table.setData`
	setSettings: Settings<TData> = $state({}); // orjinal settings. ayarları değiştirirken bu değişken kullanılacak. `table.setSettings`
	constructor(data: TData[] = [], settings: Settings<TData> = {}) {
		this.setData = data;
		this.setSettings = settings;
	}
	// ################################## END Constructor ###############################################################

	// ################################## BEGIN Properties ###############################################################
	// derived data. verileri okurken bu değişken kullanılacak. `table.data`
	data = $derived.by(() => {
		const rowHeight = this.settings.tbodyRowHeight;
		const overscanThreshold = this.overscanThreshold;
		const clientHeight = this.clientHeight;
		const scrollTop = this.scrollTop;
		const dataLength = this.setData.length;

		const rowVisibleStartIndex = Math.floor(scrollTop / rowHeight);
		const rowVisibleEndIndex = Math.min(dataLength - 1, Math.floor((scrollTop + clientHeight) / rowHeight));
		const rowOverscanStartIndex = Math.max(0, rowVisibleStartIndex - overscanThreshold);
		const rowOverscanEndIndex = Math.min(dataLength - 1, rowVisibleEndIndex + overscanThreshold);

		return this.setData.slice(rowOverscanStartIndex, rowOverscanEndIndex + 1).map((row, index) => {
			return {
				...row,
				originalRowIndex: rowOverscanStartIndex + index
			};
		});
	});
	// derived settings. ayarları okurken bu değişken kullanılacak. `table.settings`
	settings = $derived({ ...this.defaultSettings, ...this.setSettings });
	// derived columns. kolon bilgileri okurken bu değişken kullanılacak. `table.columns`
	columns = $derived(
		this.settings.columns
			?.map((col, index) => {
				return {
					...col,
					originalColIndex: index
				};
			})
			.filter((column) => !column.hidden)
	);
	// derived footers. alt bilgi satırı bilgileri okurken bu değişken kullanılacak. `table.footers`
	footers = $derived.by(() => {
		const footers = this.settings.footers;
		const columns = this.columns;
		return footers.map((footer) => {
			const footerRow: Partial<Footers<TData>> = {};
			columns.forEach((column) => {
				footerRow[column.field] = footer[column.field];
			});
			return footerRow as Footers<TData>;
		});
	});
	// ################################## END Properties ###############################################################

	focusedCell?: FocucedCell = $state();
	scrollTop = $state(0);
	lastScrollTop = 0;
	clientHeight = $state(0);
	headerRowCount = 1;
	footerRowCount = 1;
	overscanThreshold = $state(0);
	gridTemplateRows = $derived.by(() => {
		if (this.setData.length === 0) {
			return `repeat(${this.headerRowCount}, ${this.settings.theadRowHeight}px) repeat(${this.footerRowCount}, ${this.settings.tfootRowHeight}px)`;
		} else {
			return `repeat(${this.headerRowCount}, ${this.settings.theadRowHeight}px) repeat(${this.setData.length}, ${this.settings.tbodyRowHeight}px) repeat(${this.footerRowCount}, ${this.settings.tfootRowHeight}px)`;
		}
	});
	gridTemplateColumns = $derived(this.columns.map(() => `150px`).join(' '));
}

// ################################## BEGIN Export Table Context ###############################################################
const SLC_TABLE_CONTEXT_KEY = Symbol('SLC_TABLE_CONTEXT_KEY');
export function setTable<TData extends Row>(data: TData[], settings?: Settings<TData>): Table<TData> {
	const table = new Table(data, settings);
	setContext(SLC_TABLE_CONTEXT_KEY, table);
	return table;
}
export function getTable<TData extends Row>() {
	return getContext<ReturnType<typeof setTable<TData>>>(SLC_TABLE_CONTEXT_KEY);
}
// ################################## END Export Table Context #################################################################
export type { Settings, Row };
