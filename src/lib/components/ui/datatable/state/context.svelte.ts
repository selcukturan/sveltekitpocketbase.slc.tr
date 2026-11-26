import type { Row, Column, ColumnType, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult, Field, Width, Align } from '../types.js';
import type { ListSource } from './list-state.svelte.js';
import { GridCursor, type CellPos, type CellRange } from './navigation.svelte.js';
import { RowSelection, type SelectionMode, type RowId } from './selection.svelte.js';
import { CellEditor, type CellEditEvent } from './editing.svelte.js';
import { parseSort, nextSort } from '../utils/sort.js';

import { getContext, setContext, untrack, type Snippet } from 'svelte';
import { t } from '#lib/app/localization/index.js';
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

let tableUid = 0; // hücre id'leri için (aria-activedescendant): sayfada birden çok tablo olabilir

// Hücre olaylarının parametresi
export type CellEvent<TData> = {
	row: TData;
	rowIndex: number; // yüklü verideki sıra
	field: Field<TData>;
	colIndex: number; // görünür kolon sırası
	value: unknown;
	event: MouseEvent;
};
export type ActiveCell<TData> = Omit<CellEvent<TData>, 'event' | 'value'>;

// onLoad: tabloda yeni veri göründü. reason 'query': yeni sorgu (ilk yükleme, sayfa, sıralama, arama);
// 'refresh': aynı sorgunun tazelenmesi (mutasyon sonrası, withOverride ile optimistik güncelleme dahil)
export type LoadEvent<TData> = ListResult<TData> & { reason: 'query' | 'refresh' };

// Seçili hücre alanları ve özeti (onRangeChange, alt bar). ranges: Ctrl ile çoklu seçimde birden çok alan
// (son eleman şu anki). Örtüşen hücreler bir kez sayılır; sayısal toplam yalnızca number değerlerden.
export type RangeInfo = { ranges: CellRange[]; count: number; numericCount: number; sum: number; average: number | undefined };

// onVisibleRowsChange: ekranda (en az bir kısmı) görünen veri satırları; sticky başlık/footer altındakiler sayılmaz.
// Veri yoksa first 0, last -1. Örn. sonsuz kaydırma (last sona yaklaşınca sonraki sayfa), görünenler için ek veri.
export type VisibleRows = { first: number; last: number; total: number };

// Sanal kaydırmada çizilen satır: key, satırın yuvası (bkz. virtualData)
type VirtualKey = number | 'spare';
type VirtualEntry<TData> = { data: TData; originalIndex: number; key: VirtualKey };

// onKeyDown'a verilen bağlam: tuş anındaki aktif hücre, aralık ve seçili satırlar
export type KeyContext<TData extends Row> = { cell: ActiveCell<TData> | undefined; ranges: CellRange[]; selected: TData['id'][] };

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
	actions: 'minmax(100px,0.5fr)',
	select: '44px'
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
	// Tek veri kaynağı: createList sonucu (sorgu, sıralama, sayfalama). Sorgu ListResult (sayfalı) ya da dizi döndürebilir.
	list: ListSource<ListResult<TData>> | ListSource<TData[]>; // required
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
	// Sağ tık menüsünün öğeleri (<dt.MenuItem>). Verilirse menüyü tablo açar, konumlandırır ve kapatır; ContextMenu tuşu ya da
	// Shift+F10 aktif hücrede açar. row: sağ tıklanan satır.
	contextMenu?: Snippet<[row: TData]>;
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
	onRowClick?: (row: TData) => void; // tek tıklama (hücre içindeki buton/link hariç)
	onRowActivate?: (row: TData) => void; // çift tıklama ya da Enter: satırı aç (örn. düzenleme drawer'ı)
	onCellClick?: (e: CellEvent<TData>) => void;
	onCellDblClick?: (e: CellEvent<TData>) => void;
	onActiveCellChange?: (cell: ActiveCell<TData> | undefined) => void;
	// Satır seçimi: 'single' | 'multiple' (varsayılan 'none'). Onay kutuları için kolonlara { field: '_select', type: 'select' } eklenir.
	selection?: SelectionMode;
	// Başlangıç seçimi (yalnızca kurulurken okunur). Sonrası tablonun kendi durumu: değiştirmek için table.helpers
	// (setSelected, deselect, clearSelection), izlemek için onSelectionChange.
	selected?: RowId[];
	onSelectionChange?: (ids: RowId[]) => void;
	// Hücre düzenleme: `editable: true` kolonlarda değişiklik buradan bildirilir; sayfa kaydeder ve sorguyu tazeler.
	// Yeni değeri hemen göstermek için `.updates(...list.updatesWith(...))` (SvelteKit withOverride) kullanılır;
	// istek hata verirse override kendiliğinden geri alınır (hatayı göstermek sayfanın işi, örn. toast).
	onCellEdit?: (e: CellEditEvent<TData>) => void | Promise<void>;
	// Tabloda yeni veri göründü (bkz. LoadEvent)
	onLoad?: (e: LoadEvent<TData>) => void;
	// Sorgu hata verdi (tablo ayrıca kendi mesaj kartını gösterir)
	onError?: (error: App.Error) => void;
	// Grid odaktayken basılan tuş; yerleşik davranıştan önce çağrılır. e.preventDefault() yerleşik davranışı engeller.
	// Örn. Delete ile seçili satırları silmek. (Düzenleyici açıkken çağrılmaz.)
	onKeyDown?: (e: KeyboardEvent, ctx: KeyContext<TData>) => void;
	// Hücrede sağ tık (contextMenu snippet'i yerine kendi menünüzü çizmek için). Verilirse tarayıcının menüsü açılmaz;
	// hücre aralık dışındaysa aktif olur.
	onContextMenu?: (e: CellEvent<TData>) => void;
	// Görünen satırlar değişti (kaydırma, boyut, veri); her karede değil, yalnızca aralık değişince
	onVisibleRowsChange?: (rows: VisibleRows) => void;
	// Seçili hücre aralığı değişti (sayfa özeti saklamak isterse kendi $state'ine yazar)
	onRangeChange?: (range: RangeInfo | undefined) => void;
	// Koşullu satır görünümü: satırın tüm hücrelerine eklenecek class (örn. vadesi geçen satır)
	rowClass?: (row: TData) => string | undefined;
	// Ctrl/⌘+C panoya yazıldıktan sonra. Tablo kendi "Kopyalandı" bildirimini gösterir; bu callback ek iş için. partial: çoklu seçim tek blok
	// hâline getirilemedi (alanlar ne aynı kolonlarda ne aynı satırlarda), yalnızca son alan kopyalandı.
	onCopy?: (info: { rows: number; cols: number; partial: boolean }) => void;
	// Toplu kayıt (Ctrl+V ile yapıştırma): tek istekte kaydetmek için. Verilmezse her hücre için onCellEdit çağrılır.
	// invalid: çözümlenemeyen ya da validateCell'den geçmeyip kaydedilmeyen hücre sayısı (kullanıcıya bildirmek için).
	onCellsEdit?: (edits: CellEditEvent<TData>[], info: { invalid: number }) => void | Promise<void>;
	// Kaydetmeden önce doğrulama (forms'taki preflight gibi): mesaj döndürürse kaydedilmez, düzenleyici açık kalır.
	validateCell?: (e: CellEditEvent<TData>) => string | undefined;
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
	readonly query = $derived(this.list.query);
	readonly sort = $derived(this.list.sort);
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
	readonly contextMenu = $derived(this.#props.contextMenu);
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
	readonly onRowClick = $derived(this.#props.onRowClick);
	readonly rowClass = $derived(this.#props.rowClass);

	readonly #uid = ++tableUid;
	readonly cellId = (pos: CellPos) => `slc-dt${this.#uid}-r${pos.row}-c${pos.col}`;

	// Aktif hücre ve klavye gezinmesi (bkz. navigation.svelte.ts)
	readonly cursor: GridCursor;
	// Satır seçimi (bkz. selection.svelte.ts)
	readonly selection: RowSelection<TData>;
	// Hücre düzenleme (bkz. editing.svelte.ts)
	readonly editor: CellEditor<TData>;
	readonly activeCellId = $derived.by(() => (this.cursor.active ? this.cellId(this.cursor.active) : undefined));

	// Seçili satır id'leri: tablonun kendi durumu (başlangıç: props.selected)
	#selected = $state<RowId[]>([]);

	constructor(props: MainProps<TData>) {
		this.#props = props;
		this.#selected = props.selected ?? [];

		this.selection = new RowSelection<TData>({
			mode: () => this.#props.selection ?? 'none',
			items: () => this.items as TData[],
			value: () => this.#selected,
			setValue: (ids) => (this.#selected = ids),
			onChange: (ids) => this.#props.onSelectionChange?.(ids)
		});
		this.editor = new CellEditor<TData>({
			items: () => this.items as TData[],
			column: (col) => this.visibleColumns[col]?.data,
			canSave: () => this.#props.onCellEdit !== undefined,
			save: (e) => this.#props.onCellEdit?.(e),
			validate: (e) => this.#props.validateCell?.(e),
			saveMany: (edits, info) => this.#props.onCellsEdit?.(edits, info),
			canSaveMany: () => this.#props.onCellsEdit !== undefined,
			focusGrid: () => this.el?.focus({ preventScroll: true }),
			move: (pos) => this.cursor.set(pos, { scroll: true })
		});
		this.cursor = new GridCursor({
			el: () => this.el,
			rowCount: () => this.dataLength,
			colCount: () => this.visibleColumns.length,
			dataRowHeight: () => this.dataRowHeight,
			headerHeight: () => this.headerLength * this.headerRowHeight,
			footerHeight: () => (this.dataLength > 0 ? this.footerLength * this.footerRowHeight : 0),
			clientHeight: () => this.clientHeight,
			cellId: this.cellId,
			onChange: (pos) => this.#props.onActiveCellChange?.(pos ? this.#activeCell(pos) : undefined),
			onActivate: (pos) => {
				const row = this.items[pos.row];
				if (row) this.#props.onRowActivate?.(row);
			}
		});

		// onError: her yeni hata bir kez bildirilir
		let reportedError: unknown;
		$effect(() => {
			const error = this.query?.error;
			if (error && error !== reportedError) untrack(() => this.#props.onError?.(error));
			reportedError = error;
		});

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
	menu = $state<{ x: number; y: number; row: TData }>(); // açık sağ tık menüsü (konum: viewport, fixed)
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
				// Aktif hücre: yeni sorguda ilk satır (aynı kolon); tazelemede aynı id'li satır, yoksa aynı sıra (kırpılır)
				const active = this.cursor.active;
				const activeId = active ? this.items[active.row]?.id : undefined;
				const isNewQuery = query !== this.#shownQuery;
				if (isNewQuery) {
					this.#shownQuery = query;
					if (this.el) this.el.scrollTop = 0;
					this.#currentScrollY = 0;
					this.#rafY = 0;
				}
				queueMicrotask(() => {
					if (isNewQuery) this.editor.cancel();
					if (!active) return;
					const index = isNewQuery ? 0 : this.items.findIndex((row) => row.id === activeId);
					// Tazelemede aktif kayıt yerinde kaldıysa dokunulmaz: hücre aralığı (örn. yapıştırılan alan) korunur
					if (index === active.row && index < this.items.length) return;
					this.cursor.set({ row: index >= 0 ? index : active.row, col: active.col });
				});
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
				} else {
					this.paginable = false;
					this.#currentData = undefined;
				}
				const data = this.#currentData;
				if (data) queueMicrotask(() => this.#props.onLoad?.({ ...data, reason: isNewQuery ? 'query' : 'refresh' }));
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
	// Pencere hep aynı boyda (#windowSize satır): görünen alan en fazla ceil(alan / satır) + 1 satıra değer, üstüne her iki
	// yandan OVERSCAN. Listenin uçlarında pencere kayar ama kısalmaz; satır geri dönüşümü bu sabit boya dayanır (virtualData).
	#windowSize = $derived(Math.ceil(Math.max(0, this.clientHeight - this.headerLength * this.headerRowHeight) / this.dataRowHeight) + 2 + 2 * TableContext.OVERSCAN);
	#visibleStart = $derived(Math.max(0, Math.min(Math.floor(this.#rafY / this.dataRowHeight) - TableContext.OVERSCAN, this.dataLength - this.#windowSize)));
	#visibleEnd = $derived(Math.min(this.dataLength - 1, this.#visibleStart + this.#windowSize - 1));

	// Aktif satır görünür aralığın dışındaysa (kaydırıldı) yine de çizilir: hücresi DOM'da kalır,
	// aria-activedescendant boşa düşmez ve klavyeyle dönünce scrollIntoView edilebilir. Sayı derived'ı:
	// imleç aralık içinde gezerken virtualData yeniden hesaplanmaz.
	#pinnedRow = $derived.by(() => {
		const row = this.cursor.active?.row;
		return row !== undefined && row < this.dataLength && (row < this.#visibleStart || row > this.#visibleEnd) ? row : -1;
	});

	// Gerçekten görünen satırlar (overscan'siz). i. satırın üstü: başlık + i × satır; veri alanı başlık ile footer arası.
	#firstVisible = $derived(Math.min(Math.floor(this.#rafY / this.dataRowHeight), this.dataLength - 1));
	#lastVisible = $derived(
		Math.min(
			this.dataLength - 1,
			Math.ceil(
				(this.#rafY + this.clientHeight - this.headerLength * this.headerRowHeight - (this.dataLength > 0 ? this.footerLength * this.footerRowHeight : 0)) /
					this.dataRowHeight
			) - 1
		)
	);
	// Sayı derived'larından: yalnızca aralık ya da veri sayısı değişince yeni nesne (onVisibleRowsChange)
	readonly visibleRows = $derived.by((): VisibleRows => {
		const total = this.dataLength;
		return total === 0 ? { first: 0, last: -1, total } : { first: Math.max(0, this.#firstVisible), last: Math.max(0, this.#lastVisible), total };
	});

	// Satır geri dönüşümü: {#each} satırları kayıt id'si yerine pencere içindeki "yuva" ile anahtarlanır (key = i % windowSize).
	// Pencere ardışık ve sabit boyda olduğu için yuvalar benzersizdir ve hep aynı kümedir. Kaydırınca yukarıdan çıkan
	// satırın yuvasını aşağıdan giren alır: bileşenler ve DOM düğümleri silinip yeniden oluşturulmaz, yalnızca props (dr)
	// değişir. Yuva sayısı yalnızca yükseklik/yoğunluk değişince değişir (o zaman satırlar bir kez yeniden kurulur).
	// Not: sayfanın kendi dataRow snippet'inde yerel $state tutulursa satırla değil yuvayla kalır (bkz. belge).
	// Sabitlenen (aktif, pencere dışındaki) satır kendi yuvasını korur: pencereden çıkarken yeniden kurulmaz (düzenleyici
	// ve odak yerinde kalır). Penceredeki aynı yuvaya düşen tek satır 'spare' anahtarını alır.
	// Dizi yuva sırasındadır: kaydırırken {#each} düğüm de taşımaz (görsel sıra grid-row-start'tan gelir, DOM sırası önemsiz).
	virtualData = $derived.by(() => {
		const items = this.items;
		const start = this.#visibleStart;
		const end = this.#visibleEnd;
		const slots = this.#windowSize;
		const pinned = this.#pinnedRow;
		const pinnedSlot = pinned >= 0 ? pinned % slots : -1;
		const prev = this.#prevEntries;
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const next = new Map<VirtualKey, VirtualEntry<TData>>();
		const processedData: VirtualEntry<TData>[] = [];

		// Değişmeyen satır önceki nesnesini korur: {#each} o yuvayı güncellemez, hücreleri yeniden hesaplanmaz.
		// Yeni nesne yalnızca yuvaya giren (ya da verisi değişen) satır için üretilir.
		const add = (data: TData, originalIndex: number, key: VirtualKey) => {
			const old = prev.get(key);
			const entry = old && old.data === data && old.originalIndex === originalIndex ? old : { data, originalIndex, key };
			next.set(key, entry);
			processedData.push(entry);
		};
		for (let i = start; i <= end; i++) {
			const row = items[i];
			if (row) add(row as TData, i, i % slots === pinnedSlot ? 'spare' : i % slots);
		}
		if (pinned >= 0) add(items[pinned] as TData, pinned, pinnedSlot);
		this.#prevEntries = next;

		const order = (key: VirtualKey) => (key === 'spare' ? slots : key);
		return processedData.sort((a, b) => order(a.key) - order(b.key));
	});
	#prevEntries = new Map<VirtualKey, VirtualEntry<TData>>(); // reaktif değil: yalnızca virtualData'nın önceki sonucu

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

	// Hücre etkileşimleri: her hücreye ayrı dinleyici yerine grid'de tek dinleyici (sanal kaydırmada hücreler sürekli
	// oluşturulup silindiği için). Hücrenin konumu data-row / data-col attribute'larından okunur.
	static readonly #INTERACTIVE =
		'button, a, input, select, textarea, label, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="menuitem"], [role="option"]';

	#activeCell = (pos: CellPos): ActiveCell<TData> => ({
		row: this.items[pos.row] as TData,
		rowIndex: pos.row,
		field: this.visibleColumns[pos.col]?.data.field,
		colIndex: pos.col
	});

	// Basılı sürüklemede aralık: imlecin altındaki hücre aralığın ucu olur. İmleç veri alanının kenarına (başlık/footer/
	// sabit kolonların sınırına) yaklaşınca ya da dışına çıkınca tablo o yöne kaydırılır (karede bir kez, mesafeyle hızlanır).
	static readonly #DRAG_EDGE = 32; // px: kenara bu kadar yaklaşınca kaydırma başlar
	static readonly #DRAG_MAX_SPEED = 40; // px/kare

	#dragRange = (node: HTMLElement, down: PointerEvent) => {
		let x = down.clientX;
		let y = down.clientY;
		let rafId = 0;
		const edge = TableContext.#DRAG_EDGE;
		const speed = (d: number) => Math.sign(d) * Math.min(TableContext.#DRAG_MAX_SPEED, Math.abs(d) / 2);

		const frame = () => {
			rafId = 0;
			const rect = node.getBoundingClientRect();
			const pad = this.scrollPadding;
			const top = rect.top + pad.top;
			const bottom = rect.top + node.clientHeight - pad.bottom;
			const left = rect.left + pad.left;
			const right = rect.left + node.clientWidth - pad.right;

			const dy = y < top + edge ? y - (top + edge) : y > bottom - edge ? y - (bottom - edge) : 0;
			const dx = x < left + edge ? x - (left + edge) : x > right - edge ? x - (right - edge) : 0;
			if (dx || dy) node.scrollBy(speed(dx), speed(dy));

			// Hücre: nokta dikeyde veri alanına (başlık/footer hariç), yatayda grid'e kırpılır (sabit kolonlar seçilebilsin)
			const px = Math.max(rect.left + 1, Math.min(x, rect.left + node.clientWidth - 1));
			const py = Math.max(top + 1, Math.min(y, bottom - 1));
			const cell = document.elementFromPoint(px, py)?.closest<HTMLElement>('[data-slc-table-datacell]');
			if (cell && node.contains(cell)) {
				const pos = { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
				if (this.visibleColumns[pos.col]?.data.type !== 'select') this.cursor.set(pos, { extend: true });
			}
			if (dx || dy) rafId = requestAnimationFrame(frame); // kenarda beklerken kaydırma sürsün
		};

		const offMove = on(window, 'pointermove', (e: PointerEvent) => {
			x = e.clientX;
			y = e.clientY;
			if (!rafId) rafId = requestAnimationFrame(frame);
		});
		const stop = () => {
			cancelAnimationFrame(rafId);
			offMove();
			offUp();
			offCancel();
		};
		const offUp = on(window, 'pointerup', stop);
		const offCancel = on(window, 'pointercancel', stop);
	};

	// Kopyalanabilir/sayılabilir kolon mu (seçim ve işlem kolonları değil)
	#isDataColumn = (col: number) => {
		const type = this.visibleColumns[col]?.data.type;
		return type !== undefined ? type !== 'select' && type !== 'actions' : this.visibleColumns[col] !== undefined;
	};

	// Seçili alanların özeti (Excel'in durum çubuğu gibi). Örtüşen hücreler bir kez sayılır.
	readonly rangeInfo = $derived.by((): RangeInfo | undefined => {
		const ranges = this.cursor.ranges;
		if (ranges.length === 0) return undefined;
		const seen: Record<string, true> = {};
		let count = 0;
		let numericCount = 0;
		let sum = 0;
		for (const r of ranges) {
			for (let i = r.top; i <= r.bottom; i++) {
				const row = this.items[i] as Record<string, unknown> | undefined;
				if (!row) continue;
				for (let c = r.left; c <= r.right; c++) {
					if (!this.#isDataColumn(c) || seen[`${i}:${c}`]) continue;
					seen[`${i}:${c}`] = true;
					count++;
					const value = row[this.visibleColumns[c].data.field];
					if (typeof value === 'number' && Number.isFinite(value)) {
						numericCount++;
						sum += value;
					}
				}
			}
		}
		return { ranges, count, numericCount, sum, average: numericCount > 0 ? sum / numericCount : undefined };
	});

	// Seçimi (yoksa aktif hücreyi) sekmeyle ayrılmış metin (TSV) olarak panoya kopyalar; Excel'e yapıştırılabilir.
	// Seçim ve işlem kolonları atlanır. Değerler ham hâliyle (tarih PocketBase biçiminde, liste virgülle).
	// Çoklu seçim (Excel gibi): alanlar aynı kolonlardaysa satırlar alt alta, aynı satırlardaysa kolonlar yan yana
	// birleştirilir; ikisi de değilse yalnızca son alan kopyalanır (partial).
	// "Kopyalandı" bildirimi: tablonun sağ üstünde birkaç saniye görünür (DataTable çizer). id: art arda kopyada yeniden canlansın
	copyNotice = $state<{ id: number; text: string; warning: boolean }>();
	#copyNoticeTimer: ReturnType<typeof setTimeout> | undefined;
	#showCopyNotice = (count: number, partial: boolean) => {
		clearTimeout(this.#copyNoticeTimer);
		this.copyNotice = { id: (this.copyNotice?.id ?? 0) + 1, text: t(partial ? 'dt_copied_partial' : 'dt_copied', { count }), warning: partial };
		this.#copyNoticeTimer = setTimeout(() => (this.copyNotice = undefined), partial ? 5000 : 2500);
	};

	readonly copyRange = (): boolean => {
		const active = this.cursor.active;
		if (!active) return false;
		const selected = this.cursor.ranges.length > 0 ? this.cursor.ranges : [{ top: active.row, bottom: active.row, left: active.col, right: active.col }];
		const first = selected[0];
		const sameCols = selected.every((r) => r.left === first.left && r.right === first.right);
		const sameRows = selected.every((r) => r.top === first.top && r.bottom === first.bottom);
		const partial = !sameCols && !sameRows;
		const ranges = partial ? [selected[selected.length - 1]] : selected;

		const text = (value: unknown) => {
			if (value === null || value === undefined) return '';
			if (Array.isArray(value)) return value.join(', ');
			if (typeof value === 'object') return JSON.stringify(value);
			return String(value).replace(/[\t\r\n]+/g, ' '); // hücre içi sekme/satır sonu TSV'yi bozmasın
		};
		const colsOf = (r: CellRange) => {
			const cols: number[] = [];
			for (let c = r.left; c <= r.right; c++) if (this.#isDataColumn(c)) cols.push(c);
			return cols;
		};
		const valueAt = (row: number, col: number) => text((this.items[row] as Record<string, unknown> | undefined)?.[this.visibleColumns[col].data.field]);

		let lines: string[];
		let cols: number;
		if (sameRows && !sameCols) {
			// Yan yana: kolonlar soldan sağa (aynı kolon bir kez)
			const all = [...ranges]
				.sort((a, b) => a.left - b.left)
				.flatMap(colsOf)
				.filter((c, i, list) => list.indexOf(c) === i);
			cols = all.length;
			lines = [];
			for (let row = first.top; row <= first.bottom; row++) lines.push(all.map((c) => valueAt(row, c)).join('\t'));
		} else {
			// Alt alta (tek alan da bu yol): satırlar yukarıdan aşağı, örtüşen satır bir kez
			const all = colsOf(ranges[0]);
			cols = all.length;
			const rows: number[] = [];
			const seen: Record<number, true> = {};
			for (const r of ranges)
				for (let row = r.top; row <= r.bottom; row++)
					if (!seen[row]) {
						seen[row] = true;
						rows.push(row);
					}
			lines = rows.sort((a, b) => a - b).map((row) => all.map((c) => valueAt(row, c)).join('\t'));
		}
		if (cols === 0) return false;
		navigator.clipboard
			?.writeText(lines.join('\n'))
			.then(() => {
				this.#showCopyNotice(lines.length * cols, partial);
				this.#props.onCopy?.({ rows: lines.length, cols, partial });
			})
			.catch(() => {
				// izin yok ya da güvenli bağlam değil: sessizce geç
			});
		return true;
	};

	readonly trackInteractions: Attachment = (node) => {
		if (!(node instanceof HTMLElement)) return;

		// Olayın geldiği veri hücresi; hücre içindeki buton/link/input'tan geldiyse interactive: true
		const hitCell = (e: Event) => {
			if (!(e.target instanceof Element)) return;
			const cell = e.target.closest<HTMLElement>('[data-slc-table-datacell]');
			if (!cell || !node.contains(cell)) return;
			const pos = { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
			const row = this.items[pos.row];
			if (!row || Number.isNaN(pos.col)) return;
			const interactive = e.target.closest(TableContext.#INTERACTIVE);
			return { pos, row, interactive: interactive !== null && cell.contains(interactive) };
		};

		const cellEvent = (pos: CellPos, row: TData, event: MouseEvent): CellEvent<TData> => {
			const field = this.visibleColumns[pos.col]?.data.field;
			return { row, rowIndex: pos.row, field, colIndex: pos.col, value: (row as Record<string, unknown>)[field], event };
		};

		// Tıklama ile çift tıklama ayrılmaz (gecikme olmasın): tıklamanın işi (hücreyi aktif yapmak) iki kez çalışsa da aynı sonucu verir
		const isSelectColumn = (col: number) => this.visibleColumns[col]?.data.type === 'select';

		// Hücreye basınca aktif olur; Shift ile aktif hücreden buraya aralık. Farede basılı sürükleme aralık seçer.
		// Seçim kolonu ve hücre içi butonlar aralığa katılmaz.
		const offPointerDown = on(node, 'pointerdown', (e: PointerEvent) => {
			if (e.button !== 0) return;
			const hit = hitCell(e);
			if (!hit) return;
			const rangeable = !hit.interactive && !isSelectColumn(hit.pos.col);
			// Ctrl/⌘: seçime yeni alan ekler (sürüklenirse bu alan genişler); Shift: son alanı genişletir
			if (rangeable && (e.ctrlKey || e.metaKey) && !e.shiftKey) this.cursor.addRange(hit.pos);
			else this.cursor.set(hit.pos, { extend: e.shiftKey && rangeable });
			if (rangeable && e.pointerType === 'mouse') this.#dragRange(node, e);
		});

		const offClick = on(node, 'click', (e: MouseEvent) => {
			const hit = hitCell(e);
			if (!hit) return;
			const selection = this.selection;
			// Seçim kolonu: tıklama değiştirir, Shift aralık seçer (satır tıklaması sayılmaz)
			if (isSelectColumn(hit.pos.col)) {
				if (e.shiftKey) selection.selectRange(hit.row.id);
				else selection.toggle(hit.row.id);
				return;
			}
			this.#props.onCellClick?.(cellEvent(hit.pos, hit.row, e));
			if (hit.interactive) return;
			// Satır seçimi yalnızca seçim kolonu ve klavyeyle (Space/Ctrl+A): hücre tıklaması satırı seçmez (aktif satır ayrı renklenir)
			this.onRowClick?.(hit.row);
		});
		// Ctrl/⌘+V: tarayıcının paste olayı (pano izni gerekmez). Düzenleyici açıkken olay input'tan gelir, ona karışılmaz.
		const offPaste = on(node, 'paste', (e: ClipboardEvent) => {
			if (e.target !== node) return;
			const active = this.cursor.active;
			const text = e.clipboardData?.getData('text/plain');
			if (!active || !text) return;
			const areas = this.cursor.ranges.length > 0 ? this.cursor.ranges : [{ top: active.row, bottom: active.row, left: active.col, right: active.col }];
			const pasted = this.editor.paste(text, areas);
			if (!pasted) return;
			e.preventDefault();
			if (pasted.select) this.cursor.selectRange(pasted.select); // doldurmada seçim olduğu gibi kalır
		});
		const offContextMenu = on(node, 'contextmenu', (e: MouseEvent) => {
			const onContextMenu = this.#props.onContextMenu;
			const hit = hitCell(e);
			if ((!onContextMenu && !this.contextMenu) || !hit || hit.interactive) return;
			e.preventDefault();
			if (!this.cursor.inRange(hit.pos.row, hit.pos.col)) this.cursor.set(hit.pos); // aralık içindeyse aralık korunur
			onContextMenu?.(cellEvent(hit.pos, hit.row, e));
			if (this.contextMenu) this.menu = { x: e.clientX, y: e.clientY, row: hit.row };
		});
		const offDblClick = on(node, 'dblclick', (e: MouseEvent) => {
			const hit = hitCell(e);
			if (!hit || hit.interactive || isSelectColumn(hit.pos.col)) return;
			this.#props.onCellDblClick?.(cellEvent(hit.pos, hit.row, e));
			// Düzenlenebilir hücrede çift tıklama düzenler; diğerlerinde satırı açar
			if (!this.editor.start(hit.pos)) this.#props.onRowActivate?.(hit.row);
		});
		const offKeyDown = on(node, 'keydown', (e: KeyboardEvent) => {
			if (e.target !== node) {
				// Odak hücre içindeki bir butonda (örn. drawer kapanınca tarayıcı odağı Düzenle butonuna geri verir):
				// Tab / Esc / oklar odağı grid'e, yani aktif hücreye döndürür. Enter/Space butonun kendisinde kalır.
				const inCell = e.target instanceof Element && e.target.closest('[data-slc-table-datacell]') !== null;
				const back = e.key === 'Tab' || e.key === 'Escape' || e.key.startsWith('Arrow');
				if (!inCell || !back) return;
				e.preventDefault();
				node.focus({ preventScroll: true });
				if (!e.key.startsWith('Arrow')) return; // oklar ayrıca hareket ettirir
			}
			const onKeyDown = this.#props.onKeyDown;
			if (onKeyDown) {
				const active = this.cursor.active;
				onKeyDown(e, { cell: active ? this.#activeCell(active) : undefined, ranges: this.cursor.ranges, selected: this.selection.ids as TData['id'][] });
				if (e.defaultPrevented) return;
			}
			// ContextMenu tuşu ya da Shift+F10: sağ tık menüsü aktif hücrenin üzerinde açılır
			if (this.contextMenu && (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10'))) {
				const active = this.cursor.active;
				const row = active ? this.items[active.row] : undefined;
				const rect = active ? document.getElementById(this.cellId(active))?.getBoundingClientRect() : undefined;
				if (row && rect) {
					e.preventDefault();
					this.menu = { x: rect.left + 8, y: rect.bottom, row: row as TData };
				}
				return;
			}
			// Ctrl/⌘+C aralığı (yoksa aktif hücreyi) kopyalar. Sıra: imleç (Esc önce aralığı kapatır), sonra satır seçimi.
			if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C') && !e.shiftKey && !e.altKey) {
				if (this.copyRange()) e.preventDefault();
				return;
			}
			// Düzenlenebilir hücrede F2/Enter/yazma düzenlemeyi başlatır (Enter diğer hücrelerde satırı açar: cursor)
			if (this.editor.handleKey(e, this.cursor.active) || this.cursor.handleKey(e) || this.selection.handleKey(e, this.cursor.active?.row)) e.preventDefault();
		});

		// Odak koruma: tabloda odaklı eleman (örn. silinen satırdaki Sil butonu) DOM'dan kalkarsa odak body'ye düşer;
		// grid'e, yani aktif hücreye geri verilir. MutationObserver zamanlamadan bağımsızdır: Svelte'in async modunda
		// DOM güncellemesi remote sorgular bitene kadar ertelenebildiği için tick()/$effect.pre güvenilir değil.
		// Firefox kaldırılan eleman için focusout göndermediği için focusout'a da dayanılmaz.
		// Satırlar yeniden kullanıldığı için (virtualData) eleman DOM'da kalıp başka bir kaydı gösterebilir (örn. silinen
		// satırın yuvasına sonraki kayıt geçer): satırın kaydı (data-row-id) değişince de odak grid'e döner. Yoksa odak
		// başka kaydın Sil butonunda kalırdı.
		let lastFocused: Element | null = null;
		let lastRowId: string | null = null;
		const rowIdOf = (el: Element) => el.closest('[data-row-id]')?.getAttribute('data-row-id') ?? null;
		const offFocusIn = on(node, 'focusin', (e: FocusEvent) => {
			lastFocused = e.target instanceof Element ? e.target : null;
			lastRowId = lastFocused ? rowIdOf(lastFocused) : null;
		});
		const observer = new MutationObserver(() => {
			if (!lastFocused || lastFocused === node) return;
			if (lastFocused.isConnected && (lastRowId === null || rowIdOf(lastFocused) === lastRowId)) return;
			const stale = lastFocused;
			lastFocused = null;
			const active = document.activeElement;
			if (!active || active === document.body || active === stale) node.focus({ preventScroll: true });
		});
		observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-row-id'] });

		return () => {
			offPointerDown();
			offClick();
			offDblClick();
			offPaste();
			offContextMenu();
			offKeyDown();
			offFocusIn();
			observer.disconnect();
		};
	};

	// ################################## END Virtual Scroll ##################################################################################################################

	// ################################## BEGIN Columns Visibility ##################################################################################################################

	// `this.columns` her değiştiğinde ve gizleme durumu değiştiğinde çalışır.
	visibleColumns = $derived.by(() => {
		const processedColumns: { data: Column<TData>; originalIndex: number }[] = [];

		for (let i = 0; i < this.columns.length; i++) {
			const col = this.columns[i];
			// Seçim kolonu yalnızca selection 'single' | 'multiple' iken görünür
			if (col && col.hidden !== true && !(col.type === 'select' && !this.selection.enabled)) {
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

	// Grid'in scroll-padding'i: scrollIntoView aktif hücreyi sticky başlık/footer/sabit kolonların altında bırakmaz.
	// Aktif hücre sabit bir kolondaysa yatay padding kalkar: sticky hücre zaten görünür, padding onu "örtülü" sayıp
	// gereksiz yatay kaydırmaya yol açardı.
	readonly scrollPadding = $derived.by(() => {
		const layout = this.columnLayout;
		let left = 0;
		let right = 0;
		this.visibleColumns.forEach((col, i) => {
			if (layout[i]?.freezeLeft) left += this.#columnPx(col.data);
			else if (layout[i]?.freezeRight) right += this.#columnPx(col.data);
		});
		const activeCol = this.cursor.active?.col;
		const activeSticky = activeCol !== undefined && layout[activeCol]?.sticky === true;
		return {
			top: this.headerLength * this.headerRowHeight,
			bottom: this.dataLength > 0 ? this.footerLength * this.footerRowHeight : 0,
			left: activeSticky ? 0 : left,
			right: activeSticky ? 0 : right
		};
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
		if (col.type === 'bool' || col.type === 'actions' || col.type === 'select') return 'center';
		return 'left';
	};

	// ################################## END Alignment ####################################################################################################################

	// ################################## BEGIN Sorting Helpers ##############################################################################################################

	// Sıralama metni (PocketBase: '-a,b') ayrıştırılmış hâliyle; çoklu sıralamada sıra öncelik demek (bkz. sort.ts)
	readonly sortEntries = $derived(parseSort(this.sort));

	readonly getColumnSortDirection = (field: Field<TData>): 'asc' | 'desc' | undefined => this.sortEntries.find((e) => e.field === field)?.dir;

	// Çoklu sıralamada önceliği (1'den); tek kolon sıralanıyorsa ya da kolon sıralamada değilse undefined
	readonly getColumnSortIndex = (field: Field<TData>): number | undefined => {
		if (this.sortEntries.length < 2) return undefined;
		const index = this.sortEntries.findIndex((e) => e.field === field);
		return index >= 0 ? index + 1 : undefined;
	};

	// multi (Ctrl/⌘): diğer kolonların sıralaması korunur; değilse yalnızca bu kolon. İstek sürerken yok sayılır.
	readonly toggleSort = (field: Field<TData>, multi = false) => {
		if (!this.busy) this.list.setSort(nextSort(this.sort, field, multi));
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
		// Aralığı (yoksa aktif hücreyi) panoya kopyalar (örn. sağ tık menüsünden)
		copy: () => this.copyRange(),
		// Odağı tabloya (aktif hücreye) verir
		focus: () => this.el?.focus({ preventScroll: true }),
		// Satır seçimi (değişiklikler onSelectionChange ile de bildirilir). Seçim sayfalar arası korunur.
		getSelected: () => this.selection.ids as TData['id'][],
		setSelected: (ids: TData['id'][]) => this.selection.set(ids),
		deselect: (ids: TData['id'][]) => this.selection.deselect(ids),
		clearSelection: () => this.selection.clear(),
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
