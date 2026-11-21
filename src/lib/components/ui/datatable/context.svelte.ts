import type { RemoteQuery } from '$app/server';

import type { Row, Column, ColumnType, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult, Field, Width, Align } from './types.js';
import type { ListSource } from './list-state.svelte.js';

import { getContext, setContext, untrack, type Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export type Borders = 'none' | 'horizontal' | 'vertical' | 'both';
export type Density = 'compact' | 'normal' | 'relaxed';

// Veri satırı yüksekliği (px). Değerler makaledeki öneriden: sık 40, normal 48, rahat 56.
export const DENSITY_ROW_HEIGHTS: Record<Density, number> = { compact: 40, normal: 48, relaxed: 56 };

// Kullanıcının tablo içinde yaptığı değişiklikler; `persist` verilirse localStorage'da saklanır
type UiState<TData> = {
	columns: Record<string, Partial<Pick<Column<TData>, 'width' | 'hidden'>>>;
	freezeLeft?: number;
	freezeRight?: number;
	borders?: Borders;
	density?: Density;
};

const STORAGE_PREFIX = 'slc-dt:';

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

const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;

export type ColumnLayout = {
	gridColumn: string;
	freezeLeft: boolean;
	freezeRight: boolean;
	sticky: boolean;
	boundaryLeft: boolean; // son sol sabit kolon (gölge + çizgi)
	boundaryRight: boolean; // ilk sağ sabit kolon
	left?: string;
	right?: string;
	justifyCell: (typeof JUSTIFY)[Align];
	textAlignHeader: Align;
	justifyFooter: (typeof JUSTIFY)[Align];
};

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
	density?: Density; // satır yoğunluğu (varsayılan: 'compact'); kullanıcı ayarlar popup'ından değiştirebilir
	// Verilirse kullanıcı ayarları (genişlik, gizleme, freeze, kenarlık, yoğunluk) bu anahtarla localStorage'da saklanır.
	// Uygulamada tekil olmalı, örn: persist="grapes-crud-simple"
	persist?: string;
	headerRowHeight?: number;
	dataRowHeight?: number; // verilirse density'nin yerine geçer (kullanıcı yoğunluk seçerse o geçerli olur)
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

	// Kullanıcının tablo içinde yaptığı değişiklikler (kolon genişletme/gizleme, freeze +/-, kenarlık, yoğunluk).
	// Props salt okunur olduğu için ayrı tutulur; kolonlar `field` ile eşlenir, böylece sayfa kolon ekleyip
	// çıkarsa ya da sırasını değiştirse de ayarlar doğru kolonda kalır. `persist` verilirse localStorage'da saklanır.
	#ui = $state<UiState<TData>>({ columns: {} });

	#currentData = $state<ListResult<TData> | undefined>(undefined); // watchCurrentChanged ile değişir

	// Data structure
	readonly list = $derived(this.#props.list);
	readonly query = $derived(this.#props.list ? this.#props.list.query : this.#props.query);
	readonly sort = $derived(this.#props.list?.sort ?? this.#props.sort);
	readonly loaded = $derived(this.#currentData !== undefined); // ilk veri geldi mi (alt bar iskeleti için)
	// İstek sürüyor: sayfalama/sıralama kontrolleri kilitlenir, art arda tıklamalar yeni istek başlatmaz
	readonly busy = $derived(this.query?.loading === true);
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
		Object.keys(this.#ui.columns).length > 0 ||
			this.#ui.freezeLeft !== undefined ||
			this.#ui.freezeRight !== undefined ||
			this.#ui.borders !== undefined ||
			this.#ui.density !== undefined
	);
	readonly density = $derived(this.#ui.density ?? this.#props.density ?? 'compact');
	readonly headerRowHeight = $derived(this.#props.headerRowHeight ?? 44); // en sık veri satırından (40) yüksek
	readonly dataRowHeight = $derived(this.#ui.density ? DENSITY_ROW_HEIGHTS[this.#ui.density] : (this.#props.dataRowHeight ?? DENSITY_ROW_HEIGHTS[this.density]));
	readonly footerRowHeight = $derived(this.#props.footerRowHeight ?? 40);
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

		// Kalıcı ayarlar: ilk açılışta okunur, her değişiklikte yazılır. (SSR kapalı; yine de localStorage
		// gizli pencerede/engelliyken hata verebileceği için try/catch.) Varsayılan hâldeyse kayıt silinir.
		const key = props.persist ? STORAGE_PREFIX + props.persist : undefined;
		if (key) {
			try {
				const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
				if (saved && typeof saved === 'object' && saved.columns && typeof saved.columns === 'object') this.#ui = saved;
			} catch {
				// bozuk kayıt ya da erişim yok: varsayılanla devam
			}
			$effect(() => {
				const snapshot = $state.snapshot(this.#ui);
				const changed = this.isLayoutChanged;
				try {
					if (changed) localStorage.setItem(key, JSON.stringify(snapshot));
					else localStorage.removeItem(key);
				} catch {
					// kota dolu ya da erişim yok: ayarlar yalnızca bu oturumda kalır
				}
			});
		}
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

	// Gösterilen verinin geldiği sorgu. ListState her sayfa/sıralama/aramada yeni bir sorgu örneği üretir;
	// refresh() ve .updates() ise aynı örneği tazeler. Yeni bir sorgunun verisi gelince tablo en üste kaydırılır,
	// tazelemede (örn. kayıt silindikten sonra) kullanıcının konumu korunur.
	#shownQuery: unknown = undefined;

	watchCurrentChanged = () => {
		const query = this.query;
		const current = query?.current;

		return untrack(() => {
			if (query && query.ready) {
				if (query !== this.#shownQuery) {
					this.#shownQuery = query;
					if (this.el) this.el.scrollTop = 0;
					this.#currentScrollY = 0;
					this.#rafY = 0;
				}
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

	static readonly MIN_COLUMN_WIDTH = 50;

	// Sürüklenen kolonun anlık genişliği. Sürükleme boyunca yalnızca grid şablonu (gridTemplateColumns) bunu okur;
	// columns/visibleColumns değişmediği için hücreler her karede yeniden hesaplanmaz. Bırakınca #ui'ye yazılır.
	#drag = $state<{ field: string; width: number } | undefined>(undefined);
	readonly resizingField = $derived(this.#drag?.field);

	// Sürükleme başlarken diğer minmax kolonlar o anki genişliklerinde px'e sabitlenir; böylece kaymazlar
	#pinFlexibleColumns = (exceptIndex: number) => {
		this.columns.forEach((column, index) => {
			if (index !== exceptIndex && !column.hidden && widthOf(column).startsWith('minmax')) {
				const width = Math.round(this.#measuredWidths[column.field] ?? estimatePx(widthOf(column)));
				this.helpers.setColumnProp(index, 'width', `${Math.max(TableContext.MIN_COLUMN_WIDTH, width)}px` as Width);
			}
		});
	};

	// HeaderCell'deki tutamağa bağlanır. Pointer capture ile olaylar tutamakta kalır (window dinleyicisi gerekmez);
	// pointermove karede en fazla bir kez uygulanır.
	readonly colResizeAttach = (originalIndex: number): Attachment => {
		return (node) => {
			if (!(node instanceof HTMLElement)) return;

			return on(node, 'pointerdown', (event: PointerEvent) => {
				if ((event.pointerType === 'mouse' && event.button !== 0) || !event.isPrimary) return;
				const cell = node.parentElement;
				const field = this.columns[originalIndex]?.field;
				if (!cell || !field) return;

				event.preventDefault();
				event.stopPropagation();
				node.setPointerCapture(event.pointerId);

				const startX = event.clientX;
				const startWidth = cell.getBoundingClientRect().width;
				let lastX = startX;
				let rafId = 0;
				let moved = false;

				const widthAt = (x: number) => Math.max(TableContext.MIN_COLUMN_WIDTH, Math.round(startWidth + x - startX));
				const apply = () => {
					rafId = 0;
					if (!moved) {
						moved = true;
						this.#pinFlexibleColumns(originalIndex); // yalnızca ilk harekette; tıklama genişlikleri değiştirmesin
					}
					this.#drag = { field, width: widthAt(lastX) };
				};

				const offMove = on(node, 'pointermove', (e: PointerEvent) => {
					lastX = e.clientX;
					if (!rafId && lastX !== startX) rafId = requestAnimationFrame(apply);
				});
				const finish = () => {
					offMove();
					offUp();
					offCancel();
					cancelAnimationFrame(rafId);
					if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
					if (moved) this.helpers.setColumnProp(originalIndex, 'width', `${widthAt(lastX)}px` as Width);
					this.#drag = undefined;
				};
				const offUp = on(node, 'pointerup', finish);
				const offCancel = on(node, 'pointercancel', finish);
			});
		};
	};

	// ################################## END Column Resize ##################################################################################################################

	// ################################## BEGIN Virtual Scroll ##################################################################################################################

	// Yalnızca görünen veri satırları (+ üst/alt OVERSCAN satır) DOM'a çizilir. Grid'in satır şablonu tüm satırları
	// kapsadığı için (gridTemplateRows) scroll yüksekliği doğrudur; her hücre grid-row-start ile kendi yerine oturur.
	static readonly OVERSCAN = 10;

	#currentScrollY = 0; // scroll event'inde güncellenir
	#rafY = $state(0); // requestAnimationFrame ile güncellenir (karede en fazla bir kez)
	clientHeight = $state(0); // bind:clientHeight

	// Başlık sticky olduğu için veri alanı scrollTop + başlık yüksekliğinden başlar; i. satır başlık + i * satır yüksekliğinde.
	// Bu yüzden ilk görünen satır floor(scrollTop / satır yüksekliği). Footer'lar sticky olup alttan örter, overscan karşılar.
	// start/end ayrı sayı derived'ları: scroll her karede değişse de virtualData yalnızca aralık değişince yeniden hesaplanır.
	#visibleStart = $derived(Math.max(0, Math.min(Math.floor(this.#rafY / this.dataRowHeight) - TableContext.OVERSCAN, this.dataLength - 1)));
	#visibleEnd = $derived(
		Math.min(this.dataLength - 1, Math.ceil((this.#rafY + this.clientHeight - this.headerLength * this.headerRowHeight) / this.dataRowHeight) + TableContext.OVERSCAN)
	);

	// Aralık ya da veri değişince yeniden hesaplanır
	virtualData = $derived.by(() => {
		const items = this.items;
		const processedData: { data: TData; originalIndex: number }[] = [];

		for (let i = this.#visibleStart; i <= this.#visibleEnd; i++) {
			const row = items[i];
			if (row) processedData.push({ data: row as TData, originalIndex: i });
		}

		return processedData;
	});

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

	// Satır tıklaması: her hücreye ayrı dinleyici yerine grid'de tek dinleyici (sanal kaydırmada hücreler sürekli
	// oluşturulup silindiği için). Hücre içindeki buton/link/input tıklamaları satır tıklaması sayılmaz.
	static readonly #INTERACTIVE =
		'button, a, input, select, textarea, label, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="menuitem"], [role="option"]';

	readonly trackRowClick: Attachment = (node) => {
		if (!(node instanceof HTMLElement)) return;
		return on(node, 'click', (e: MouseEvent) => {
			const onRowClick = this.onRowClick;
			if (!onRowClick || !(e.target instanceof Element)) return;
			const cell = e.target.closest('[data-slc-table-datacell]');
			if (!cell || !node.contains(cell)) return;
			const interactive = e.target.closest(TableContext.#INTERACTIVE);
			if (interactive && cell.contains(interactive)) return;
			const row = this.items[Number(cell.getAttribute('data-row'))];
			if (row) onRowClick(row);
		});
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
		const drag = this.#drag;
		return this.visibleColumns.map((col) => (drag && col.data.field === drag.field ? `${drag.width}px` : widthOf(col.data))).join(' ');
	});

	// Kolon başına yerleşim bilgisi; görünür sıra (colVisibleIndex) ile okunur. Hücre başına ~10 derived yerine
	// kolon başına bir kez hesaplanır: sanal kaydırmada her yeni satırın hücreleri hazır değeri okur.
	// Kolonlar, freeze ya da sabit kolonların genişliği değişince yeniden hesaplanır.
	readonly columnLayout = $derived.by((): ColumnLayout[] => {
		const cols = this.visibleColumns;
		const n = cols.length;
		const fl = this.freezeLeft;
		const fr = this.freezeRight;
		const offsets = this.stickyOffsets;

		return cols.map((col, i) => {
			const freezeLeft = i < fl;
			const freezeRight = i >= n - fr;
			const offset = offsets[col.data.field];
			return {
				gridColumn: `${i + 1} / ${i + 2}`,
				freezeLeft,
				freezeRight,
				sticky: freezeLeft || freezeRight,
				boundaryLeft: freezeLeft && i === fl - 1,
				boundaryRight: freezeRight && i === n - fr,
				left: freezeLeft && offset?.left !== undefined ? `${offset.left}px` : undefined,
				right: freezeRight && offset?.right !== undefined ? `${offset.right}px` : undefined,
				justifyCell: JUSTIFY[this.alignOf(col.data, 'cell')],
				textAlignHeader: this.alignOf(col.data, 'header'),
				justifyFooter: JUSTIFY[this.alignOf(col.data, 'footer')]
			};
		});
	});

	// ################################## END Grid Template ##################################################################################################################

	// ################################## BEGIN Alignment ##################################################################################################################

	// Kolon hizası: açıkça verilmediyse tipe göre (number/date/datetime → sağ, bool/actions → orta)
	readonly alignOf = (col: Column<TData>, part: 'cell' | 'header' | 'footer' = 'cell'): Align => {
		const explicit = part === 'header' ? col.alignHeader : part === 'footer' ? col.alignFooter : undefined;
		if (explicit ?? col.align) return (explicit ?? col.align) as Align;
		// sayı ve tarihler sabit biçimli: sağa dayalıyken basamaklar alt alta gelir, karşılaştırması kolay olur
		if (col.type === 'number' || col.type === 'date' || col.type === 'datetime') return 'right';
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

		if (this.onSort && !this.busy) {
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
		setDensity: (value: Density) => {
			this.#ui.density = value;
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
