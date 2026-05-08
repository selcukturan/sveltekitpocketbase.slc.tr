import type { Row, Column, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult } from './types';
import type { RemoteQuery } from '@sveltejs/kit';
import { getContext, setContext, tick, untrack, type Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export interface MainProps<TData extends Row> {
	query?: RemoteQuery<ListResult<TData>> | RemoteQuery<TData[]> | RemoteQuery<TData>;
	columns: Column<TData>[]; // required
	footers?: Footer<TData>[];
	// Snippets (Render Fonksiyonları)
	toolbar?: Snippet;
	headerRow: Snippet<[hr: HeaderRowType<TData>]>; // required
	dataRow: Snippet<[dr: DataRowType<TData>]>; // required
	footerRow?: Snippet<[fr: FooterRowType<TData>]>;
	statusbar?: Snippet;
	// UI State & Styling
	headerRowHeight?: number;
	dataRowHeight?: number;
	footerRowHeight?: number;
	// Özel Class Tanımları
	tableClass?: string;
	containerClass?: string;
	mainClass?: string;
	// events
	onPagination?: ({ page, perPage }: { page: number; perPage: number }) => void;
}

class TableContext<TData extends Row> {
	// ############### BEGIN PROPS ###############

	// initialProps zaten bir Proxy olduğu için reaktivitesi kopmaz
	#props = $state() as MainProps<TData>;

	paginable = $state<boolean>(false);

	// Current Data
	#currentData = $state<ListResult<TData> | undefined>(undefined);
	readonly query = $derived(this.#props.query);

	watchCurrentChanged = () => {
		const query = this.query;

		if (query && query.ready) {
			const current = query.current;

			if (current && typeof current === 'object' && 'items' in current) {
				this.paginable = true;
				this.#currentData = current as ListResult<TData>;
			} else if (Array.isArray(current)) {
				this.paginable = false;
				this.#currentData = {
					items: current,
					page: 1,
					perPage: current.length,
					totalItems: current.length,
					totalPages: 1
				};
			} else if (current) {
				this.paginable = false;
				this.#currentData = {
					items: [current as TData],
					page: 1,
					perPage: 1,
					totalItems: 1,
					totalPages: 1
				};
			} else {
				this.paginable = false;
				this.#currentData = undefined;
			}
		}
	};

	// Data structure
	readonly items = $derived(this.#currentData?.items ?? []);
	readonly totalItems = $derived(this.#currentData?.totalItems ?? 0);
	readonly page = $derived(this.#currentData?.page ?? 1);
	readonly perPage = $derived(this.#currentData?.perPage ?? 30);
	readonly totalPages = $derived(this.#currentData?.totalPages ?? 0);
	// Table structure
	readonly columns = $derived(this.#props.columns); // required
	readonly footers = $derived(this.#props.footers ?? []);
	// Snippets (Render Fonksiyonları)
	readonly toolbar = $derived(this.#props.toolbar);
	readonly headerRow = $derived(this.#props.headerRow); // required
	readonly dataRow = $derived(this.#props.dataRow); // required
	readonly footerRow = $derived(this.#props.footerRow);
	readonly statusbar = $derived(this.#props.statusbar);
	// UI State & Styling
	readonly headerRowHeight = $derived(this.#props.headerRowHeight ?? 35);
	readonly dataRowHeight = $derived(this.#props.dataRowHeight ?? 35);
	readonly footerRowHeight = $derived(this.#props.footerRowHeight ?? 35);
	// Özel Class Tanımları
	readonly tableClass = $derived(this.#props.tableClass);
	readonly containerClass = $derived(this.#props.containerClass);
	readonly mainClass = $derived(this.#props.mainClass);
	// Events
	readonly onPagination = $derived(this.#props.onPagination);
	// ############### END PROPS ###############

	constructor(initialProps: MainProps<TData>) {
		this.#props = initialProps;
	}

	el: HTMLDivElement | undefined = $state(undefined); // context'in bağlı olduğu ana element

	// base variables
	headerLength = $state(1);
	dataLength = $derived(this.items.length);
	footerLength = $derived(this.footers.length);

	// virtual scroll variables
	#currentScrollY = 0; // scroll event'inde güncellenir
	#rafY = $state(0); // requestAnimationFrame ile güncellenir
	clientHeight = $state(0); // bind:clientHeight
	#rowIndices = $state.raw({
		start: 0,
		end: 0
	});

	// Manuel çalıştırılır. rowIndices güncellenir.
	updateVisibleIndexes = (force: boolean = false) => {
		const overscan = 10;
		const rowHeight = this.dataRowHeight;

		const start = Math.max(0, Math.floor(this.#rafY / rowHeight) - overscan);
		const end = Math.min(this.dataLength - 1, Math.floor((this.#rafY + this.clientHeight) / rowHeight) + overscan);

		const indicesChanged = start !== this.#rowIndices.start || end !== this.#rowIndices.end;

		if (force || indicesChanged) {
			this.#rowIndices = {
				start: start >= end ? 0 : start,
				end: end
			};
		}
	};

	// `rowIndices` her değiştiğinde çalışır.
	virtualData = $derived.by(() => {
		const rawData = untrack(() => this.items);

		const processedData: { data: TData; originalIndex: number }[] = [];

		for (let i = this.#rowIndices.start; i <= this.#rowIndices.end; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row as TData, originalIndex: i });
			}
		}

		return processedData;
	});

	// `propsColumns` her değiştiğinde çalışır.
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

	helpers = {
		testHelper1: () => {
			console.log('Mevcut veri:', this.items);
		},
		testHelper2: (index: number) => {
			console.log('Satır yüksekliği:' + index, this.dataRowHeight);
		}
	};

	readonly watchItemsChanged: Attachment = (node) => {
		if (!(node instanceof HTMLElement)) return;

		void this.items;

		const cleanup = untrack(() => {
			tick().then(() => {
				this.updateVisibleIndexes(true);
			});
			return () => {
				// cleanup code
			};
		});

		return cleanup;
	};

	readonly watchScrollAndClientHeight = () => {
		void this.#rafY;
		void this.clientHeight;
		untrack(() => this.updateVisibleIndexes());
	};

	// Scroll takibi
	readonly trackTableScroll = (node: HTMLElement) => {
		return on(
			node,
			'scroll',
			() => {
				this.#currentScrollY = node.scrollTop;
			},
			{ passive: true }
		);
	};
	// requestAnimationFrame döngüsü
	readonly trackTableRaf: Attachment = (node) => {
		// mount
		if (!(node instanceof HTMLElement)) return;

		// setup
		const fps = 60; // saniyede 60 güncelleme için
		let rafId: number;
		let lastTime = 0;

		const loop = (timestamp: number) => {
			const interval = 1000 / fps;
			const elapsed = timestamp - lastTime;
			if (elapsed >= interval) {
				lastTime = timestamp - (elapsed % interval);
				this.#rafY = this.#currentScrollY;
			}
			rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);

		// cleanup
		return () => cancelAnimationFrame(rafId);
	};
}

const key = Symbol('SLC-DATATABLE-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createTableContext<TData extends Row>(initialProps: MainProps<TData>) {
	return setContext(key, new TableContext<TData>(initialProps));
}
export function getTableContext<TData extends Row>() {
	return getContext<ReturnType<typeof createTableContext<TData>>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
