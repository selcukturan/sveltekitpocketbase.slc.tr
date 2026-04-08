import type { Row, Column, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult } from './types';
import { getContext, setContext, tick, untrack, type Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export interface MainProps<TData extends Row> {
	// Veri Yapısı
	current?: ListResult<TData>;
	columns: Column<TData>[]; // required
	footers?: Footer<TData>[];
	// Snippets (Render Fonksiyonları)
	toolbar?: Snippet;
	headerRow: Snippet<[hr: HeaderRowType<TData>]>; // required
	dataRow: Snippet<[dr: DataRowType<TData>]>; // required
	footerRow?: Snippet<[fr: FooterRowType<TData>]>;
	statusbar?: Snippet;
	// UI State & Styling
	loading?: boolean;
	error?: unknown;
	headerRowHeight?: number;
	dataRowHeight?: number;
	footerRowHeight?: number;
	// Özel Class Tanımları
	tableClass?: string;
	containerClass?: string;
	mainClass?: string;
}

class TableContext<TData extends Row> {
	// ############### BEGIN PROPS ###############
	// initialProps zaten bir Proxy olduğu için reaktivitesi kopmaz
	#props = $state() as MainProps<TData>;
	// Loading sırasında eski veriyi korumak için cache. current sadece gerçek veri geldiğinde güncellenir; loading sırasında eski veri korunur
	#cachedCurrent = $state<ListResult<TData> | undefined>(undefined);
	watchCurrentChanged: Attachment = () => {
		const c = this.#props.current;
		untrack(() => {
			if (c !== undefined) this.#cachedCurrent = c;
		});
	};
	// Veri Yapısı
	get propsCurrent() {
		return this.#cachedCurrent;
	}
	get items() {
		return this.#cachedCurrent?.items ?? [];
	}
	get totalItems() {
		return this.#cachedCurrent?.totalItems ?? 0;
	}
	get page() {
		return this.#cachedCurrent?.page ?? 1;
	}
	get perPage() {
		return this.#cachedCurrent?.perPage ?? 30;
	}
	get totalPages() {
		return this.#cachedCurrent?.totalPages ?? 0;
	}
	get propsColumns() {
		return this.#props.columns; // required
	}
	get propsFooters() {
		return this.#props.footers ?? [];
	}
	// Snippets (Render Fonksiyonları)
	get propsToolbar() {
		return this.#props.toolbar;
	}
	get propsHeaderRow() {
		return this.#props.headerRow; // required
	}
	get propsDataRow() {
		return this.#props.dataRow; // required
	}
	get propsFooterRow() {
		return this.#props.footerRow;
	}
	get propsStatusbar() {
		return this.#props.statusbar;
	}
	// UI State & Styling
	get propsLoading() {
		return this.#props.loading ?? false;
	}
	get propsError() {
		return this.#props.error;
	}
	get propsHeaderRowHeight() {
		return this.#props.headerRowHeight ?? 35;
	}
	get propsDataRowHeight() {
		return this.#props.dataRowHeight ?? 35;
	}
	get propsFooterRowHeight() {
		return this.#props.footerRowHeight ?? 35;
	}
	// Özel Class Tanımları
	get propsTableClass() {
		return this.#props.tableClass;
	}
	get propsContainerClass() {
		return this.#props.containerClass;
	}
	get propsMainClass() {
		return this.#props.mainClass;
	}
	// ############### END PROPS ###############

	constructor(initialProps: MainProps<TData>) {
		this.#props = initialProps;
	}

	el: HTMLDivElement | undefined = $state(undefined); // context'in bağlı olduğu ana element

	// base variables
	headerLength = $state(1);
	dataLength = $derived(this.items.length);
	footerLength = $derived(this.propsFooters.length);

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
		const rowHeight = this.propsDataRowHeight;

		let start = Math.max(0, Math.floor(this.#rafY / rowHeight) - overscan);
		let end = Math.min(this.dataLength - 1, Math.floor((this.#rafY + this.clientHeight) / rowHeight) + overscan);

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

		for (let i = 0; i <= this.propsColumns.length; i++) {
			const col = this.propsColumns[i];
			if (col && col.hidden !== true) {
				processedColumns.push({ data: col, originalIndex: i });
			}
		}

		return processedColumns;
	});

	gridTemplateRows = $derived.by(() => {
		const headerLength = this.headerLength;
		const headerRowHeight = this.propsHeaderRowHeight;
		const dataRowHeight = this.propsDataRowHeight;
		const footerRowHeight = this.propsFooterRowHeight;
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
			console.log('Satır yüksekliği:', this.propsDataRowHeight);
		}
	};

	readonly watchItemsChanged: Attachment = (node) => {
		if (!(node instanceof HTMLElement)) return;

		this.items;

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
		this.#rafY;
		this.clientHeight;
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
