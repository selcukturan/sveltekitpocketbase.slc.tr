import type { RemoteQuery } from '$app/server';

import type { Row, Column, ColumnType, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult, Field, Width, Align } from './types.js';
import type { ListSource } from './list-state.svelte.js';

import { getContext, setContext, tick, untrack, type Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export type Borders = 'none' | 'horizontal' | 'vertical' | 'both';

// Kolona `width` verilmezse tipine göre bu değer kullanılır (tip yoksa 'text').
// minmax: en az Npx, kalan alan fr oranıyla paylaşılır; tablo genişledikçe kolonlar da genişler.
export const DEFAULT_COLUMN_WIDTHS: Record<ColumnType, Width> = {
	text: 'minmax(120px,1fr)',
	number: 'minmax(90px,0.75fr)',
	bool: 'minmax(70px,0.5fr)',
	date: 'minmax(110px,0.75fr)',
	datetime: 'minmax(160px,1fr)',
	list: 'minmax(140px,1fr)',
	json: 'minmax(160px,1.25fr)',
	actions: 'minmax(100px,0.5fr)'
};

// Kolonun geçerli genişlik tanımı: kullanıcı/props değeri, yoksa tip varsayılanı
export const widthOf = <TData>(col: Column<TData>): Width => col.width ?? DEFAULT_COLUMN_WIDTHS[col.type ?? 'text'];

// Ölçüm henüz yokken (ilk çizim) tahmini px: '130px' → 130, 'minmax(50px,1fr)' → 50
const estimatePx = (width: Width): number => {
	const match = /^(?:minmax\()?(\d+(?:\.\d+)?)px/.exec(width);
	return match ? parseFloat(match[1]) : 150;
};

export interface MainProps<TData extends Row> {
	// Data structure
	// `list` (createList) verilirse query, sort, onPagination ve onSort ondan okunur. Ayrı ayrı da verilebilir.
	list?: ListSource<ListResult<TData>> | ListSource<TData[]>;
	query?: RemoteQuery<ListResult<TData>> | RemoteQuery<TData[]> | RemoteQuery<TData>;
	sort?: string;
	// Table structure
	columns: Column<TData>[]; // required
	footers?: Footer<TData>[];
	// Snippets (Render Fonksiyonları)
	toolbar?: Snippet;
	// Verilmezse varsayılan satırlar çizilir (başlık: t(label), hücre: Value, alt: değer)
	headerRow?: Snippet<[hr: HeaderRowType<TData>]>;
	dataRow?: Snippet<[dr: DataRowType<TData>]>;
	footerRow?: Snippet<[fr: FooterRowType<TData>]>;
	actions?: Snippet<[row: TData]>; // type: 'actions' kolonunun içeriği (varsayılan dataRow'da)
	statusbar?: Snippet;
	settings?: boolean; // alt bardaki tablo ayarları popup'ı (varsayılan: true)
	// UI State & Styling
	borders?: Borders; // hücre çizgileri (varsayılan: 'horizontal'); kullanıcı ayarlar popup'ından değiştirebilir
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

	// Props doğrudan okunur (reaktif): sayfa columns/footers/freeze vb. değiştirirse tablo da değişir.
	#props!: MainProps<TData>;

	// Kullanıcının tablo içinde yaptığı değişiklikler (kolon genişletme/gizleme, freeze +/-).
	// Props salt okunur olduğu için ayrı tutulur; kolonlar `field` ile eşlenir, böylece sayfa kolon ekleyip
	// çıkarsa ya da sırasını değiştirse de ayarlar doğru kolonda kalır. (İleride localStorage'a yazılabilir.)
	#ui = $state<{
		columns: Record<string, Partial<Pick<Column<TData>, 'width' | 'hidden'>>>;
		freezeLeft?: number;
		freezeRight?: number;
		borders?: Borders;
	}>({ columns: {} });

	#currentData = $state<ListResult<TData> | undefined>(undefined); // watchCurrentChanged ile değişir

	// Data structure
	readonly list = $derived(this.#props.list);
	readonly query = $derived(this.#props.list ? this.#props.list.query : this.#props.query);
	readonly sort = $derived(this.#props.list?.sort ?? this.#props.sort);
	readonly items = $derived(this.#currentData?.items ?? []);
	readonly totalItems = $derived(this.#currentData?.totalItems ?? 0);
	readonly page = $derived(this.#currentData?.page ?? 1);
	readonly perPage = $derived(this.#currentData?.perPage ?? 30);
	readonly totalPages = $derived(this.#currentData?.totalPages ?? 0);
	// Table structure: props + kullanıcı ayarları
	readonly columns = $derived(this.#props.columns.map((col) => ({ ...col, ...this.#ui.columns[col.field] })));
	readonly footers = $derived(this.#props.footers ?? []);
	// Snippets (Render Fonksiyonları)
	readonly toolbar = $derived(this.#props.toolbar);
	readonly headerRow = $derived(this.#props.headerRow);
	readonly dataRow = $derived(this.#props.dataRow);
	readonly footerRow = $derived(this.#props.footerRow);
	readonly actions = $derived(this.#props.actions);
	readonly statusbar = $derived(this.#props.statusbar);
	readonly settings = $derived(this.#props.settings ?? true);
	// UI State & Styling
	readonly borders = $derived(this.#ui.borders ?? this.#props.borders ?? 'horizontal');
	// Kullanıcı props'tan farklı bir ayar yaptı mı ("Varsayılana dön" butonu için)
	readonly isLayoutChanged = $derived(
		Object.keys(this.#ui.columns).length > 0 || this.#ui.freezeLeft !== undefined || this.#ui.freezeRight !== undefined || this.#ui.borders !== undefined
	);
	readonly headerRowHeight = $derived(this.#props.headerRowHeight ?? 42);
	readonly dataRowHeight = $derived(this.#props.dataRowHeight ?? 35);
	readonly footerRowHeight = $derived(this.#props.footerRowHeight ?? 35);
	readonly freezeLeft = $derived(this.#ui.freezeLeft ?? this.#props.freezeLeft ?? 0);
	readonly freezeRight = $derived(this.#ui.freezeRight ?? this.#props.freezeRight ?? 0);
	// Özel Class Tanımları
	readonly tableClass = $derived(this.#props.tableClass);
	readonly containerClass = $derived(this.#props.containerClass);
	readonly mainClass = $derived(this.#props.mainClass);
	// Events
	readonly onPagination = $derived(this.#props.onPagination ?? this.#props.list?.paginate);
	readonly onRowClick = $derived(this.#props.onRowClick);
	readonly onSort = $derived(this.#props.onSort ?? this.#props.list?.setSort);

	constructor(props: MainProps<TData>) {
		this.#props = props;
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
		const current = query?.current;

		return untrack(() => {
			if (query && query.ready) {
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
		});
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
			// Diğer minmax kolonlar o anki genişliklerinde px'e sabitlenir; böylece sürüklerken kaymazlar
			this.columns.forEach((column, index) => {
				if (index !== originalIndex && !column.hidden && widthOf(column).startsWith('minmax')) {
					const width = this.#measuredWidths[column.field] ?? estimatePx(widthOf(column));
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
			this.#rowIndices = { start: start >= end ? 0 : start, end };
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

	// Scroll takibi: kaydırma olduğunda tek bir requestAnimationFrame planlanır (boştayken döngü çalışmaz)
	readonly trackTableScroll = (node: HTMLElement) => {
		let rafId = 0;
		const off = on(
			node,
			'scroll',
			() => {
				this.#currentScrollY = node.scrollTop;
				if (rafId) return;
				rafId = requestAnimationFrame(() => {
					rafId = 0;
					this.#rafY = this.#currentScrollY;
				});
			},
			{ passive: true }
		);
		return () => {
			off();
			cancelAnimationFrame(rafId);
		};
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
		const col = this.columns[originalIndex];
		if (col) this.helpers.setColumnProp(originalIndex, 'hidden', !col.hidden);
	};

	setColumnVisibility = (originalIndex: number, visible: boolean) => {
		this.helpers.setColumnProp(originalIndex, 'hidden', !visible);
	};

	isColumnVisible = (originalIndex: number) => {
		const col = this.columns[originalIndex];
		return col ? col.hidden !== true : false;
	};

	// ################################## END Columns Visibility ##########################################################################################################################

	// ################################## BEGIN Sticky Columns ##################################################################################################################

	// Başlık hücrelerinin gerçek genişliği (px), field ile. HeaderCell'deki measureColumn ile güncellenir.
	// minmax/fr kolonların genişliği ancak çizildikten sonra bilinir; freeze ofseti buradan hesaplanır.
	#measuredWidths = $state<Record<string, number>>({});

	readonly measureColumn = (field: string): Attachment => {
		return (node) => {
			if (!(node instanceof HTMLElement)) return;
			const observer = new ResizeObserver(([entry]) => {
				const width = entry.borderBoxSize?.[0]?.inlineSize ?? node.offsetWidth;
				if (this.#measuredWidths[field] !== width) this.#measuredWidths[field] = width;
			});
			observer.observe(node);
			return () => {
				observer.disconnect();
				delete this.#measuredWidths[field];
			};
		};
	};

	#columnPx = (col: Column<TData>) => this.#measuredWidths[col.field] ?? estimatePx(widthOf(col));

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
				cumulativeLeft += this.#columnPx(col.data);
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
				cumulativeRight += this.#columnPx(col.data);
			}
		}

		return offsets;
	});

	// Sınır: 0 ile görünür kolon sayısı arası
	#clampFreeze = (value: number) => Math.max(0, Math.min(value, this.visibleColumns.length));

	setFreezeLeft = () => this.helpers.setFreeze('freezeLeft', this.freezeLeft + 1);
	unsetFreezeLeft = () => this.helpers.setFreeze('freezeLeft', this.freezeLeft - 1);
	setFreezeRight = () => this.helpers.setFreeze('freezeRight', this.freezeRight + 1);
	unsetFreezeRight = () => this.helpers.setFreeze('freezeRight', this.freezeRight - 1);

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
		const columnsWidth = this.visibleColumns.map((col) => widthOf(col.data));
		return columnsWidth.join(' ');
	});

	// ################################## END Grid Template ##################################################################################################################

	// ################################## BEGIN Alignment ##################################################################################################################

	// Kolon hizası: açıkça verilmediyse tipe göre (number → sağ, bool/actions → orta)
	readonly alignOf = (col: Column<TData>, part: 'cell' | 'header' | 'footer' = 'cell'): Align => {
		const explicit = part === 'header' ? col.alignHeader : part === 'footer' ? col.alignFooter : undefined;
		if (explicit ?? col.align) return (explicit ?? col.align) as Align;
		if (col.type === 'number') return 'right';
		if (col.type === 'bool' || col.type === 'actions') return 'center';
		return 'left';
	};

	// ################################## END Alignment ####################################################################################################################

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
		// Kolonun kullanıcı ayarını değiştirir (props'taki tanım değişmez)
		setColumnProp: <K extends 'width' | 'hidden'>(colIndex: number, key: K, value: Column<TData>[K]) => {
			const field = this.#props.columns[colIndex]?.field;
			if (!field) return;
			this.#ui.columns[field] = { ...this.#ui.columns[field], [key]: value };
		},
		setFreeze: (key: 'freezeLeft' | 'freezeRight', value: number) => {
			this.#ui[key] = this.#clampFreeze(value);
		},
		setBorders: (value: Borders) => {
			this.#ui.borders = value;
		},
		// Kullanıcı ayarlarını siler; tablo props'taki hâline döner
		resetLayout: () => {
			this.#ui = { columns: {} };
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
