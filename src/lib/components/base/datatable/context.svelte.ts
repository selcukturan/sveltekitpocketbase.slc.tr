import type { Column, Footer, Row, ListResult } from './types';
import { getContext, setContext, tick } from 'svelte';
import { watch, ScrollState, AnimationFrames, useResizeObserver } from 'runed';
import { untrack } from 'svelte';

class TableContext<TData extends Row> {
	// required DataTable props
	rawData = $state<ListResult<TData>>({
		page: 1,
		perPage: 30,
		totalItems: 0,
		totalPages: 0,
		items: []
	});
	columns = $state<Column<TData>[]>([]);
	footers = $state<Footer<TData>[]>([]);
	headerRowHeight = $state(35);
	dataRowHeight = $state(35);
	footerRowHeight = $state(35);

	// Context variables
	allRows = $derived($state.snapshot(this.rawData.items));
	el = $state<HTMLElement>();
	headerLength = $state(1);
	dataLength = $derived(this.allRows.length);
	footerLength = $derived(this.footers.length);
	clientHeight = $state(0);
	throttledY = $state(0);
	fpsLimit = $state(60);
	frames = $state(0);
	delta = $state(0);
	rowIndices = $state.raw({
		start: 0,
		end: 0
	});
	scroll = new ScrollState({ element: () => this.el });
	animation = new AnimationFrames(
		(args) => {
			this.frames++;
			this.delta = args.delta;
			this.throttledY = this.scroll.y;
		},
		{ fpsLimit: () => this.fpsLimit }
	);

	constructor(data: ListResult<TData>, columns: Column<TData>[], footers: Footer<TData>[]) {
		// https://github.com/vincjo/datatables/blob/main/src/lib/src/client/AbstractTableHandler.svelte.ts#L40
		this.rawData = data;
		this.columns = columns;
		this.footers = footers;

		useResizeObserver(
			() => this.el,
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				this.clientHeight = entry.contentRect.height;
			}
		);

		watch(
			() => this.rawData,
			() => {
				tick().then(() => {
					this.updateVisibleIndexes(true);
				});
			}
		);

		watch([() => this.throttledY, () => this.clientHeight], () => {
			this.updateVisibleIndexes();
		});
	}

	updateVisibleIndexes = (force: boolean = false) => {
		const overscan = 10;
		const rowHeight = this.dataRowHeight;

		let start = Math.max(0, Math.floor(this.throttledY / rowHeight) - overscan);
		let end = Math.min(this.dataLength - 1, Math.floor((this.throttledY + this.clientHeight) / rowHeight) + overscan);

		const indicesChanged = start !== this.rowIndices.start || end !== this.rowIndices.end;

		if (force || indicesChanged) {
			this.rowIndices = {
				start: start >= end ? 0 : start,
				end: end
			};
		}
	};

	virtualData = $derived.by(() => {
		const rawData = untrack(() => this.allRows);

		const processedData: { data: TData; originalIndex: number }[] = [];

		for (let i = this.rowIndices.start; i <= this.rowIndices.end; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row as TData, originalIndex: i });
			}
		}

		return processedData;
	});

	visibleColumns = $derived.by(() => {
		const processedColumns: { data: Column<TData>; originalIndex: number }[] = [];

		for (let i = 0; i <= this.columns.length; i++) {
			const col = this.columns[i];
			if (col && col.hidden !== true) {
				processedColumns.push({ data: col, originalIndex: i });
			}
		}

		return processedColumns;
	});

	gridTemplateRows = $derived.by(() => {
		const headerLength = this.headerLength;
		const headerRowHeight = this.headerRowHeight;
		const dataRowHeight = this.dataRowHeight;
		const footerRowHeight = this.footerRowHeight;
		const footerLength = this.footerLength;
		const itemLength = this.dataLength;

		const headerRowRepeat = headerLength >= 1 ? `repeat(${headerLength}, ${headerRowHeight}px)` : ``;
		const dataRowRepeat = itemLength > 0 ? `repeat(${itemLength}, ${dataRowHeight}px)` : ``;
		const footerRowRepeat = footerLength > 0 ? `repeat(${footerLength}, ${footerRowHeight}px)` : ``;

		return [headerRowRepeat, dataRowRepeat, footerRowRepeat].join(' ');
	});

	gridTemplateColumns = $derived.by(() => {
		const columnsWidth = this.visibleColumns.map((col) => col.data.width ?? `150px`);
		return columnsWidth.join(' ');
	});
}

const key = Symbol('SLC-DATATABLE-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createTableContext<TData extends Row>(
	data: ListResult<TData>,
	columns: Column<TData>[],
	footers: Footer<TData>[]
) {
	return setContext(key, new TableContext<TData>(data, columns, footers));
}
export function getTableContext<TData extends Row>() {
	return getContext<ReturnType<typeof createTableContext<TData>>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
