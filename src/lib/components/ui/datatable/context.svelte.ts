import type { Row, Column, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult, Field, Width } from './types';
import type { RemoteQuery } from '@sveltejs/kit';
import { getContext, setContext, tick, untrack, type Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export interface MainProps<TData extends Row> {
	// Data structure
	query?: RemoteQuery<ListResult<TData>> | RemoteQuery<TData[]> | RemoteQuery<TData>;
	sort?: string;
	// Table structure
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
	freezeLeft?: number;
	freezeRight?: number;
	// Özel Class Tanımları
	tableClass?: string;
	containerClass?: string;
	mainClass?: string;
	// events
	onPagination?: ({ page, perPage }: { page: number; perPage: number }) => void;
	onRowClick?: (row: TData) => void;
	onSort?: (sort: string) => void;
}

class TableContext<TData extends Row> {
	// ############### BEGIN PROPS ###############

	#mainProps!: MainProps<TData>;
	#queryProps!: () => MainProps<TData>['query'];
	#sortProps!: () => MainProps<TData>['sort'];

	#currentData = $state<ListResult<TData> | undefined>(undefined); // watchCurrentChanged ile değişir

	// Data structure
	readonly query = $derived(this.#queryProps());
	readonly sort = $derived(this.#sortProps());
	readonly items = $derived(this.#currentData?.items ?? []);
	readonly totalItems = $derived(this.#currentData?.totalItems ?? 0);
	readonly page = $derived(this.#currentData?.page ?? 1);
	readonly perPage = $derived(this.#currentData?.perPage ?? 30);
	readonly totalPages = $derived(this.#currentData?.totalPages ?? 0);
	// Table structure
	readonly columns = $derived(this.#mainProps.columns); // required
	readonly footers = $derived(this.#mainProps.footers ?? []);
	// Snippets (Render Fonksiyonları)
	readonly toolbar = $derived(this.#mainProps.toolbar);
	readonly headerRow = $derived(this.#mainProps.headerRow); // required
	readonly dataRow = $derived(this.#mainProps.dataRow); // required
	readonly footerRow = $derived(this.#mainProps.footerRow);
	readonly statusbar = $derived(this.#mainProps.statusbar);
	// UI State & Styling
	readonly headerRowHeight = $derived(this.#mainProps.headerRowHeight ?? 35);
	readonly dataRowHeight = $derived(this.#mainProps.dataRowHeight ?? 35);
	readonly footerRowHeight = $derived(this.#mainProps.footerRowHeight ?? 35);
	readonly freezeLeft = $derived(this.#mainProps.freezeLeft ?? 0);
	readonly freezeRight = $derived(this.#mainProps.freezeRight ?? 0);
	// Özel Class Tanımları
	readonly tableClass = $derived(this.#mainProps.tableClass);
	readonly containerClass = $derived(this.#mainProps.containerClass);
	readonly mainClass = $derived(this.#mainProps.mainClass);
	// Events
	readonly onPagination = $derived(this.#mainProps.onPagination);
	readonly onRowClick = $derived(this.#mainProps.onRowClick);
	readonly onSort = $derived(this.#mainProps.onSort);

	constructor(initialProps: MainProps<TData>) {
		this.#mainProps = $state({
			...initialProps,
			query: undefined,
			sort: undefined,
			// Genişlik ve gizlilik vb. mutasyonların reaktif çalışabilmesi için klonluyoruz:
			columns: $state.snapshot(initialProps.columns) as unknown as Column<TData>[],
			footers: initialProps.footers ? ($state.snapshot(initialProps.footers) as unknown as Footer<TData>[]) : undefined
		});

		this.#queryProps = () => initialProps.query;
		this.#sortProps = () => initialProps.sort;
	}

	// ############### END PROPS ###############

	// ################################## BEGIN Base Variables ##################################################################################################################

	el: HTMLDivElement | undefined = $state(undefined); // context'in bağlı olduğu ana element
	paginable = $state(false);
	headerLength = $state(1);
	dataLength = $derived(this.items.length);
	footerLength = $derived(this.footers.length);

	// ################################## END Base Variables ##################################################################################################################

	// ################################## BEGIN Current/Query Data Watch ##################################################################################################################
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
	// ################################## END Current/Query Data Watch ##################################################################################################################

	// ################################## BEGIN Column Resize ##################################################################################################################

	#colResizePointerDownClientX = 0;
	#colResizePointerDownWidth = 0;
	#colResizeIsAllWidth = false;

	private setColumnWidth = (colIndex: number, width: number, field: Field<TData>) => {
		const minWidth = 50;
		if (width > minWidth) {
			this.helpers.setColumnProp(colIndex, 'width', `${Math.max(minWidth, width)}px` as Width);
		}
	};

	readonly colResizeUpdate = (event: PointerEvent, originalIndex: number, field: Field<TData>) => {
		const width = this.#colResizePointerDownWidth + (event.clientX - this.#colResizePointerDownClientX);
		this.setColumnWidth(originalIndex, width, field);

		if (!this.#colResizeIsAllWidth) {
			this.columns.forEach((column, index) => {
				if (index !== originalIndex && column?.width?.startsWith('minmax')) {
					const width = this.el?.querySelector(`div[role="columnheader"][data-coi="${index}"]`)?.getBoundingClientRect().width || 100;
					this.setColumnWidth(index, width, field);
				}
			});
			this.#colResizeIsAllWidth = true;
		}
	};

	readonly colResizePointerAttach = (callback: (event: PointerEvent) => void): Attachment => {
		return (node) => {
			if (!(node instanceof HTMLElement)) return;
			const pointerdown = (event: PointerEvent) => {
				if ((event.pointerType === 'mouse' && event.button === 2) || (event.pointerType !== 'mouse' && !event.isPrimary)) return;

				const parentNode = node.parentNode;
				if (!parentNode || !(parentNode instanceof HTMLElement)) return;

				this.#colResizePointerDownClientX = event.clientX;
				this.#colResizePointerDownWidth = parentNode.getBoundingClientRect().width;
				this.#colResizeIsAllWidth = false;

				node.setPointerCapture(event.pointerId);
				event.preventDefault();

				const onpointerup = () => {
					node.releasePointerCapture(event.pointerId);
					window.removeEventListener('pointermove', callback, false);
					window.removeEventListener('pointerup', onpointerup, false);
				};

				window.addEventListener('pointermove', callback, false);
				window.addEventListener('pointerup', onpointerup, false);
			};

			node.addEventListener('pointerdown', pointerdown, {
				capture: true,
				passive: false
			});

			return () => {
				node.removeEventListener('pointerdown', pointerdown);
			};
		};
	};

	// ################################## END Column Resize ##################################################################################################################

	// ################################## BEGIN Virtual Scroll ##################################################################################################################

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

	// ################################## END Virtual Scroll ##################################################################################################################

	// ################################## BEGIN Columns Visibility ##################################################################################################################

	// `this.columns` her değiştiğinde ve gizleme durumu değiştiğinde çalışır.
	visibleColumns = $derived.by(() => {
		const processedColumns: { data: Column<TData>; originalIndex: number }[] = [];

		for (let i = 0; i < this.columns.length; i++) {
			const col = this.columns[i];
			if (col && col.hidden !== true) {
				processedColumns.push({ data: col, originalIndex: i });
			}
		}

		return processedColumns;
	});
	toggleColumnVisibility = (originalIndex: number) => {
		const col = this.#mainProps.columns[originalIndex];
		if (col) {
			this.helpers.setColumnProp(originalIndex, 'hidden', !col.hidden);
		}
	};

	setColumnVisibility = (originalIndex: number, visible: boolean) => {
		const col = this.#mainProps.columns[originalIndex];
		if (col) {
			this.helpers.setColumnProp(originalIndex, 'hidden', !visible);
		}
	};

	isColumnVisible = (originalIndex: number) => {
		const col = this.#mainProps.columns[originalIndex];
		return col ? col.hidden !== true : false;
	};

	// ################################## END Columns Visibility ##########################################################################################################################

	// ################################## BEGIN Sticky Columns ##################################################################################################################

	stickyOffsets = $derived.by(() => {
		const offsets: Record<string, { left?: number; right?: number }> = {};
		let cumulativeLeft = 0;

		const visibleCols = this.visibleColumns;
		const freezeL = this.freezeLeft;
		const freezeR = this.freezeRight;

		for (let i = 0; i < visibleCols.length; i++) {
			const col = visibleCols[i];
			const isFrozenLeft = i < freezeL;
			if (isFrozenLeft) {
				offsets[col.data.field as string] = { left: cumulativeLeft };
				const w = col.data.width ?? '150px';
				const widthPx = parseFloat(w) || 150;
				cumulativeLeft += widthPx;
			}
		}

		let cumulativeRight = 0;
		for (let i = visibleCols.length - 1; i >= 0; i--) {
			const col = visibleCols[i];
			const isFrozenRight = i >= visibleCols.length - freezeR;
			if (isFrozenRight) {
				offsets[col.data.field as string] = {
					...offsets[col.data.field as string],
					right: cumulativeRight
				};
				const w = col.data.width ?? '150px';
				const widthPx = parseFloat(w) || 150;
				cumulativeRight += widthPx;
			}
		}

		return offsets;
	});

	setFreezeLeft = () => {
		if (this.#mainProps.freezeLeft !== undefined) {
			const v = this.#mainProps.freezeLeft;
			this.helpers.setMainProps('freezeLeft', v + 1);
		}
	};

	unsetFreezeLeft = () => {
		if (this.#mainProps.freezeLeft !== undefined) {
			const v = this.#mainProps.freezeLeft;
			this.helpers.setMainProps('freezeLeft', v - 1);
		}
	};

	setFreezeRight = () => {
		if (this.#mainProps.freezeRight !== undefined) {
			const v = this.#mainProps.freezeRight;
			this.helpers.setMainProps('freezeRight', v + 1);
		}
	};

	unsetFreezeRight = () => {
		if (this.#mainProps.freezeRight !== undefined) {
			const v = this.#mainProps.freezeRight;
			this.helpers.setMainProps('freezeRight', v - 1);
		}
	};

	// ################################## END Sticky Columns ##################################################################################################################

	// ################################## BEGIN Grid Template ##################################################################################################################

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

	// ################################## END Grid Template ##################################################################################################################

	// ################################## BEGIN Sorting Helpers ##############################################################################################################

	readonly getColumnSortDirection = (field: Field<TData>): 'asc' | 'desc' | undefined => {
		const currentSort = this.sort;
		if (!currentSort) return undefined;
		if (currentSort === field) return 'asc';
		if (currentSort === `-${field}`) return 'desc';
		return undefined;
	};

	readonly toggleSort = (field: Field<TData>) => {
		const currentDir = this.getColumnSortDirection(field);
		const nextSort = currentDir === undefined ? field : currentDir === 'asc' ? `-${field}` : '';

		if (this.onSort) {
			this.onSort(nextSort);
		}
	};

	// ################################## END Sorting Helpers ################################################################################################################

	// ################################## BEGIN Helpers ##################################################################################################################

	readonly helpers = {
		setMainProps: <K extends keyof MainProps<TData>>(key: K, value: MainProps<TData>[K]) => {
			if (key === 'freezeRight') {
				// console.log('freezeRight değiştirilecek.', value);
			}

			// Değişikliğin yapıldığı an:
			// console.log('freezeRight değiştiriliyor.', value);

			// 🔼 - Veri Değişmeden Önceki Kodlar Yukarıda
			this.#mainProps[key] = value;
			// 🔽 - Veri Değiştikten Sonraki Kodlar Aşağıda

			if (key === 'freezeRight') {
				// console.log('freezeRight değiştirildi.', value);
			}
		},
		setColumnProp: <K extends keyof Column<TData>>(colIndex: number, key: K, value: Column<TData>[K]) => {
			const col = this.#mainProps.columns[colIndex];
			if (col) {
				if (key === 'width') {
					// console.log('Kolon genişliği değiştirilecek.', value);
				}

				// Değişikliğin yapıldığı an:
				// console.log('Kolon genişliği değiştiriliyor.', value);

				// 🔼 - Veri Değişmeden Önceki Kodlar Yukarıda
				col[key] = value;
				// 🔽 - Veri Değiştikten Sonraki Kodlar Aşağıda

				if (key === 'width') {
					// console.log('Kolon genişliği değiştirildi.', value);
				}
			}
		},
		testHelper1: () => {
			console.log('Mevcut veri:', this.#mainProps.freezeLeft);
		},
		testHelper2: (index: number) => {
			console.log('Satır yüksekliği:' + index, this.#mainProps.freezeRight);
		}
	};

	// ################################## END Helpers ##################################################################################################################
}

// ################################## BEGIN Export Table Context ##############################################################################################################################

const key = Symbol('SLC-DATATABLE-CONTEXT');

export function createTableContext<TData extends Row>(initialProps: MainProps<TData>) {
	return setContext(key, new TableContext<TData>(initialProps));
}

export function getTableContext<TData extends Row>() {
	return getContext<ReturnType<typeof createTableContext<TData>>>(key);
}

// ################################## END Export Table Context ################################################################################################################################
