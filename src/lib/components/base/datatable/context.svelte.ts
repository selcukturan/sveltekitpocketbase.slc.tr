// https://github.com/vincjo/datatables/blob/main/src/lib/src/client/AbstractTableHandler.svelte.ts#L40
import type { Row, Column, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult } from './types';
import { getContext, setContext, tick } from 'svelte';
import { untrack, type Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import type { Action } from 'svelte/action';

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
	el: HTMLDivElement | undefined = $state(undefined); // context'in bağlı olduğu ana element (container)

	// base variables
	headerLength = $state(1);
	dataLength = $derived(this.propsItems.length);
	footerLength = $derived(this.propsFooters.length);

	// virtual scroll variables
	clientHeight = $state(0); // bind:clientHeight
	#scrollY = $state(0);
	#rafY = $state(0);
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
		const rawData = untrack(() => this.propsItems);

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
			console.log('Mevcut veri:', this.propsItems);
		},
		testHelper2: (index: number) => {
			console.log('Satır yüksekliği:', this.propsDataRowHeight);
		}
	};

	#init() {
		// Scroll takibi
		/* $effect(() => {
			const el = this.el;
			if (!el) return;
			const scroll = () => {
				this.#scrollY = el.scrollTop;
			};
			el.addEventListener('scroll', scroll, { passive: true });
			return () => el.removeEventListener('scroll', scroll);
		}); */

		// RAF döngüsü
		/* $effect(() => {
			const el = this.el;
			if (!el) return;
			const fps = 10;
			let rafId: number;
			let lastTime = 0;
			const loop = (timestamp: number) => {
				const interval = 1000 / fps;
				const elapsed = timestamp - lastTime;
				if (elapsed >= interval) {
					lastTime = timestamp - (elapsed % interval);
					this.#rafY = this.#scrollY;
				}
				rafId = requestAnimationFrame(loop);
			};
			rafId = requestAnimationFrame(loop);
			return () => cancelAnimationFrame(rafId);
		}); */

		// watch: Veri değişimini izle
		$effect(() => {
			this.propsItems;
			untrack(() => {
				tick().then(() => {
					this.updateVisibleIndexes(true);
				});
			});
		});

		// watch: Scroll ve Yükseklik değişimini izle
		$effect(() => {
			this.#rafY;
			this.clientHeight;
			untrack(() => {
				this.updateVisibleIndexes();
			});
		});
	}

	readonly mountAttach: Attachment = (node) => {
		const scroll = () => {
			console.log('node.scrollTop', node.scrollTop);
		};
		node.addEventListener('scroll', scroll, { passive: true });

		return () => {
			node.removeEventListener('scroll', scroll);
		};
	};
	readonly mountAction: Action = (node) => {
		// the node has been mounted in the DOM
		$effect(() => {
			// setup goes here
			const scroll = () => {
				console.log('node.scrollTop-action', node.scrollTop);
			};

			node.addEventListener('scroll', scroll, { passive: true });

			return () => {
				// teardown goes here
				node.removeEventListener('scroll', scroll);
			};
		});
	};

	readonly scrollAction: Action = (node) => {
		// the node has been mounted in the DOM
		$effect(() => {
			const scroll = () => {
				this.#scrollY = node.scrollTop;
				console.log('this.#scrollY', this.#scrollY);
			};
			node.addEventListener('scroll', scroll, { passive: true });
			return () => node.removeEventListener('scroll', scroll);
		});
	};

	readonly rafAction: Action = (node) => {
		// the node has been mounted in the DOM
		$effect(() => {
			const fps = 10;
			let rafId: number;
			let lastTime = 0;

			const loop = (timestamp: number) => {
				const interval = 1000 / fps;
				const elapsed = timestamp - lastTime;
				if (elapsed >= interval) {
					lastTime = timestamp - (elapsed % interval);
					this.#rafY = this.#scrollY;
					console.log('this.#rafY', this.#rafY);
				}
				rafId = requestAnimationFrame(loop);
			};

			rafId = requestAnimationFrame(loop);
			return () => cancelAnimationFrame(rafId);
		});
	};

	// Scroll takibi attachment'ı — {@attach context.scrollAttach}
	/* scrollAttach: Attachment = (node) => {
		console.log('scrollAttach çalıştı, node:', node);
		if (!(node instanceof HTMLElement)) return;

		const scroll = () => {
			this.#scrollY = node.scrollTop;
			console.log('this.#scrollY', this.#scrollY);
		};

		node.addEventListener('scroll', scroll, { passive: true });
		return () => node.removeEventListener('scroll', scroll);
	}; */

	// RAF döngüsü attachment'ı — {@attach context.rafAttach}
	/* rafAttach: Attachment = (node) => {
		console.log('rafAttach çalıştı, node:', node);
		if (!(node instanceof HTMLElement)) return;

		const fps = 10;
		let rafId: number;
		let lastTime = 0;

		const loop = (timestamp: number) => {
			const interval = 1000 / fps;
			const elapsed = timestamp - lastTime;
			if (elapsed >= interval) {
				lastTime = timestamp - (elapsed % interval);
				this.#rafY = this.#scrollY;
				console.log('this.#rafY', this.#rafY);
			}
			rafId = requestAnimationFrame(loop);
		};

		rafId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(rafId);
	}; */
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
