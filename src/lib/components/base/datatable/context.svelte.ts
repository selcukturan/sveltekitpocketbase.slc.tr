// https://github.com/vincjo/datatables/blob/main/src/lib/src/client/AbstractTableHandler.svelte.ts#L40

import type { Row, Column, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult } from './types';
import { getContext, setContext, tick } from 'svelte';
import { watch, ScrollState, AnimationFrames } from 'runed';
import { untrack, type Snippet } from 'svelte';

export interface MainProps<TData extends Row> {
	// Veri Yapısı
	data?: ListResult<TData>;
	columns: Column<TData>[]; // required
	footers?: Footer<TData>[];
	// Snippets (Render Fonksiyonları)
	toolbar?: Snippet;
	headerRow: Snippet<[hr: HeaderRowType<TData>]>; // required
	dataRow: Snippet<[dr: DataRowType<TData>]>; // required
	footerRow?: Snippet<[fr: FooterRowType<TData>]>;
	statusbar?: Snippet;
	// UI State & Styling
	pending?: boolean;
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
	// Veri Yapısı
	get propsData() {
		return this.#props.data;
	}
	get propsItems() {
		return this.#props.data?.items ?? [];
	}
	get propsTotalItems() {
		return this.#props.data?.totalItems ?? 0;
	}
	get propsPage() {
		return this.#props.data?.page ?? 1;
	}
	get propsPerPage() {
		return this.#props.data?.perPage ?? 30;
	}
	get propsTotalPages() {
		return this.#props.data?.totalPages ?? 0;
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
	get propsPending() {
		return this.#props.pending ?? false;
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
		this.#init();
	}

	// base variables
	el = $state<HTMLElement>();
	headerLength = $state(1);
	dataLength = $derived(this.propsItems.length);
	footerLength = $derived(this.propsFooters.length);

	// virtual scroll variables
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
			console.log(this.scroll.y);
			this.frames++;
			this.delta = args.delta;
			this.throttledY = this.scroll.y;
		},
		{ fpsLimit: () => this.fpsLimit }
	);

	// Manuel çalıştırılır. rowIndices güncellenir.
	updateVisibleIndexes = (force: boolean = false) => {
		const overscan = 10;
		const rowHeight = this.propsDataRowHeight;

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

	// `rowIndices` her değiştiğinde çalışır.
	virtualData = $derived.by(() => {
		const rawData = untrack(() => this.propsItems);

		const processedData: { data: TData; originalIndex: number }[] = [];

		for (let i = this.rowIndices.start; i <= this.rowIndices.end; i++) {
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
			console.log('Mevcut veri:', this.propsItems);
		},
		testHelper2: (index: number) => {
			console.log('Satır yüksekliği:', this.propsDataRowHeight);
		}
	};

	#init() {
		// Observer kurulumu
		/* useResizeObserver(
			() => this.el,
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				this.clientHeight = entry.contentRect.height;
			}
		); */

		// Veri değişimini izle (items her değiştiğinde visible indexleri güncelle)
		watch(
			() => this.propsItems,
			() => {
				tick().then(() => {
					this.updateVisibleIndexes(true);
				});
			}
		);

		// Scroll ve Yükseklik değişimini izle
		/* watch([() => this.throttledY, () => this.clientHeight], () => {
			console.log('this.clientHeight', this.clientHeight);
			this.updateVisibleIndexes();
		}); */

		$effect(() => {
			this.throttledY;
			this.clientHeight;
			untrack(() => {
				console.log('this.clientHeight', this.clientHeight);
				this.updateVisibleIndexes();
			});
		});
	}
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
