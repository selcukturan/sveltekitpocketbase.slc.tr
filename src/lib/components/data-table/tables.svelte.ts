import type { Sources, RequiredSources, Row, FocucedCell, Footer, Field, Column, OnCellFocusChange, OnRowSelectionChange, OnTableAction, OnRowAction, OnActionParams } from './types';
import { getContext, setContext, untrack } from 'svelte';
import { tick } from 'svelte';

class Table<TData extends Row> {
	// ################################## BEGIN Constructor ################################################################
	element?: HTMLDivElement = $state();
	private set: Sources<TData> = $state({ id: '', columns: [] });
	readonly sources = (value: Sources<TData>) => (this.set = value);
	constructor(sources: Sources<TData>) {
		this.sources(sources);
	}
	// ################################## END Constructor #################################################################

	// ################################## BEGIN Default Sources ############################################################
	private readonly defaultSources: RequiredSources<TData> = {
		id: '',
		data: [],
		width: '100%',
		height: '100%',
		enableVirtualization: true,
		actions: {},
		rowSelection: 'none',
		rowSelectionColumnWidth: 50,
		rowAction: true,
		rowActionColumnWidth: 50,
		theadRowHeight: 40,
		tbodyRowHeight: 35,
		tfootRowHeight: 35,
		columns: [],
		footers: []
	};
	// ################################## END Default Sources ##############################################################

	// ################################## BEGIN Set Sources ################################################################
	// ... (set metodları aynı kalır: id, data, width, height, ...) ...
	readonly id = (value: RequiredSources<TData>['id']) => (this.set.id = value);
	readonly data = (value: RequiredSources<TData>['data']) => {
		this.clearSelectedRows();
		this.clearFocusedCell();
		// Data değiştiğinde görünür indexleri sıfırlamak veya yeniden hesaplamak iyi olabilir
		this.set.data = value;
		// Data değiştiğinde indexleri yeniden hesapla (opsiyonel, data uzunluğu değişirse zaten tetiklenir)
		console.log('readonly data - updateVisibleIndexes called');
		this.updateVisibleIndexes(true);
	};
	readonly width = (value: RequiredSources<TData>['width']) => (this.set.width = value);
	readonly height = (value: RequiredSources<TData>['height']) => (this.set.height = value);
	readonly enableVirtualization = (value: RequiredSources<TData>['enableVirtualization']) => {
		this.clearSelectedRows();
		this.clearFocusedCell();
		this.set.enableVirtualization = value;
		// Virtualization değiştiğinde indexleri yeniden hesapla
		console.log('readonly enableVirtualization - updateVisibleIndexes called');
		this.updateVisibleIndexes();
	};
	readonly actions = (value: RequiredSources<TData>['actions']) => (this.set.actions = value);
	readonly rowSelection = (value: RequiredSources<TData>['rowSelection']) => {
		this.clearSelectedRows();
		this.clearFocusedCell();
		this.set.rowSelection = value;
	};
	readonly rowSelectionColumnWidth = (value: RequiredSources<TData>['rowSelectionColumnWidth']) => (this.set.rowSelectionColumnWidth = value);
	readonly rowAction = (value: RequiredSources<TData>['rowAction']) => (this.set.rowAction = value);
	readonly rowActionColumnWidth = (value: RequiredSources<TData>['rowActionColumnWidth']) => (this.set.rowActionColumnWidth = value);
	readonly theadRowHeight = (value: RequiredSources<TData>['theadRowHeight']) => {
		this.set.theadRowHeight = value;
		console.log('readonly theadRowHeight - updateVisibleIndexes called');
		this.updateVisibleIndexes(); // Row height değişirse indexler değişir
	};
	readonly tbodyRowHeight = (value: RequiredSources<TData>['tbodyRowHeight']) => {
		this.set.tbodyRowHeight = value;
		console.log('readonly tbodyRowHeight - updateVisibleIndexes called');
		this.updateVisibleIndexes(); // Row height değişirse indexler değişir
	};
	readonly tfootRowHeight = (value: RequiredSources<TData>['tfootRowHeight']) => {
		this.set.tfootRowHeight = value;
		console.log('readonly tfootRowHeight - updateVisibleIndexes called');
		this.updateVisibleIndexes(); // Row height değişirse indexler değişir
	};
	readonly columns = (value: RequiredSources<TData>['columns']) => (this.set.columns = value);
	readonly footers = (value: RequiredSources<TData>['footers']) => {
		this.set.footers = value;
		console.log('readonly footers - updateVisibleIndexes called');
		this.updateVisibleIndexes(); // Footer değişirse indexler değişir
	};
	// ################################## END Set Sources ##################################################################

	// ################################## BEGIN Properties ################################################################
	readonly get = $derived({ ...this.defaultSources, ...this.set });
	readonly visibleColumns = $derived(this.get.columns.map((col, index) => ({ ...col, oi: index })).filter((column) => !column.hidden));
	// ################################## END Properties ###############################################################

	// ################################## BEGIN General Variables ######################################################
	test = $state('test');
	private headerRowsCountState = $state(1);
	readonly headerRowsCount = $derived(this.headerRowsCountState);
	setHeaderRowsCount = (value: number) => {
		// Make it public if needed from outside
		this.headerRowsCountState = value;
		console.log('readonly setHeaderRowsCount - updateVisibleIndexes called');
		this.updateVisibleIndexes(); // Header count değişirse indexler değişir
	};
	private defaultOverscanThreshold = 4;

	// --- BEGIN OPTIMIZED STATE FOR VIRTUALIZATION ---
	private scrollTopState = $state(0);
	private clientHeightState = $state(0);
	// Görünür ve overscan indexlerini tutacak state'ler
	// Görünür ve overscan indexlerini TEK BİR obje içinde tut
	private rowIndices = $state.raw({
		visibleStart: undefined as number | undefined,
		visibleEnd: undefined as number | undefined,
		overscanStart: 0,
		overscanEnd: 0
	});
	// --- END OPTIMIZED STATE FOR VIRTUALIZATION ---

	readonly gridTemplateRows = $derived.by(() => {
		// virtualData'ya değil, ana dataya göre hesaplanmalı
		const dataLength = this.get.data.length;
		const repeatThead = this.headerRowsCount >= 1 ? `repeat(${this.headerRowsCount}, ${this.get.theadRowHeight}px)` : ``;
		// NOT: Burası tüm satırları grid'de tanımlar. Virtual scroll'da bu DOM'a eklenmez ama grid yapısı için gereklidir.
		const repeatTbody = dataLength > 0 ? `repeat(${dataLength}, ${this.get.tbodyRowHeight}px)` : ``;
		const repeatTfoot = this.get.footers.length > 0 ? `repeat(${this.get.footers.length}, ${this.get.tfootRowHeight}px)` : ``;
		return `${repeatThead} ${repeatTbody} ${repeatTfoot}`;
	});

	readonly gridTemplateColumns = $derived(
		/* ... aynı kalır ... */
		`${this.get.rowSelection !== 'none' ? this.get.rowSelectionColumnWidth + 'px' : ''}
		${this.visibleColumns.map((col) => col.width ?? `150px`).join(' ')}
		${this.get.rowAction ? this.get.rowActionColumnWidth + 'px' : ''}`
	);
	// ################################## END General Variables ########################################################

	// ################################## BEGIN Events ##########################################################
	// ... (Event tanımlamaları aynı kalır: onCellFocusChange, onRowSelectionChange, ...) ...
	// ***** onCellFocusChange Event *****
	readonly onCellFocusChange = (fn: OnCellFocusChange) => (this.onCellFocusChangeRun = fn);
	private onCellFocusChangeRun?: OnCellFocusChange;
	private onCellFocusChangeThis: OnCellFocusChange = (params) => {
		if (this.onCellFocusChangeRun != null) this.onCellFocusChangeRun(params);
	};
	// ***** onRowSelectionChange Event *****
	readonly onRowSelectionChange = (fn: OnRowSelectionChange) => (this.onRowSelectionChangeRun = fn);
	private onRowSelectionChangeRun?: OnRowSelectionChange;
	private onRowSelectionChangeThis: OnRowSelectionChange = (params) => {
		if (this.onRowSelectionChangeRun != null) this.onRowSelectionChangeRun(params);
	};
	// ***** onRowAction Event *****
	readonly onRowAction = (fn: OnRowAction) => (this.onRowActionRun = fn);
	private onRowActionRun?: OnRowAction;
	private onRowActionThis: OnRowAction = (params) => {
		if (this.onRowActionRun != null) this.onRowActionRun(params);
	};
	// ***** onTableAction Event *****
	readonly onTableAction = (fn: OnTableAction) => (this.onTableActionRun = fn);
	private onTableActionRun?: OnTableAction;
	private onTableActionThis: OnTableAction = (params) => {
		if (this.onTableActionRun != null) this.onTableActionRun(params);
	};
	// ################################## END Events ############################################################

	readonly actionTrigger = (params: OnActionParams) => {
		/* ... aynı kalır ... */
		if (params.type === 'row') {
			this.onRowActionThis(params);
		} else if (params.type === 'table') {
			this.onTableActionThis(params);
		}
	};

	// ################################## BEGIN Vertical Virtual Data (OPTIMIZED) ########################################
	// Bazı durumlarda (data değişimi gibi) index güncellemesini zorlamak için bayrak
	// private forceIndexUpdate = false;
	// GÖRÜNÜR INDEKSLERİ GÜNCELLEYEN METOD (Scroll/Resize tarafından çağrılır)
	readonly updateVisibleIndexes = (force: boolean = false) => {
		// 1. Başlangıç Kontrolleri ve Resetleme (Değişiklik varsa)
		if (this.get.enableVirtualization === false || this.element == null) {
			this.scrollTopState = 0;
			this.clientHeightState = 0;
			// Sadece mevcut state resetlenmemişse resetle
			if (this.rowIndices.visibleStart !== undefined || this.rowIndices.overscanStart !== 0) {
				// console.log("Resetting indices due to virtualization disabled or no element."); // Debug
				this.rowIndices = { visibleStart: undefined, visibleEnd: undefined, overscanStart: 0, overscanEnd: 0 };
			}
			return;
		}

		const scrollTop = this.element.scrollTop;
		const clientHeight = this.element.clientHeight;

		// 2. Erken Çıkış Kontrolü (forceIndexUpdate'i de dikkate alarak)
		//    Bu kontrolün *neden* geçildiğini takip etmek için bir değişken tutalım.
		let proceedDueToForce = false;
		if (scrollTop === this.scrollTopState && clientHeight === this.clientHeightState) {
			if (!force) {
				return; // Scroll/boyut değişmedi VE zorlanmadı, çık.
			} else {
				// Scroll/boyut değişmedi AMA zorlandı, devam et.
				proceedDueToForce = true;
			}
		}
		// Eğer buraya geldiysek ya scroll/boyut değişti ya da zorlandı.

		this.scrollTopState = scrollTop;
		this.clientHeightState = clientHeight;

		// 3. Hesaplama İçin Gerekli Değerler
		const headerRowsHeight = this.headerRowsCount * this.get.theadRowHeight;
		const footerRowsHeight = this.get.footers.length * this.get.tfootRowHeight;
		const dataRowHeight = this.get.tbodyRowHeight;
		const dataLength = this.get.data.length;
		const overscanThreshold = this.defaultOverscanThreshold;

		// 4. Veri Yok veya Satır Yüksekliği Geçersizse Resetleme (Değişiklik varsa)
		if (dataLength === 0 || dataRowHeight <= 0) {
			// Sadece mevcut state resetlenmemişse resetle
			if (this.rowIndices.visibleStart !== undefined || this.rowIndices.overscanStart !== 0) {
				// console.log("Resetting indices due to no data or invalid row height."); // Debug
				this.rowIndices = { visibleStart: undefined, visibleEnd: undefined, overscanStart: 0, overscanEnd: 0 };
			}
			return;
		}

		// 5. Yeni Index'leri Hesapla
		const currentContentHeight = Math.max(0, clientHeight - headerRowsHeight - footerRowsHeight); // Negatif olmamasını sağla
		const visibleStartIndex = Math.max(0, Math.floor(scrollTop / dataRowHeight));
		const visibleEndIndex = Math.min(dataLength - 1, Math.floor((scrollTop + currentContentHeight) / dataRowHeight));
		const overscanStartIndex = Math.max(0, visibleStartIndex - overscanThreshold);
		const overscanEndIndex = Math.min(dataLength - 1, visibleEndIndex + overscanThreshold);

		// 6. Mevcut Index'lerle Karşılaştır
		const currentIndices = this.rowIndices;
		const indicesChanged =
			visibleStartIndex !== currentIndices.visibleStart ||
			visibleEndIndex !== currentIndices.visibleEnd ||
			overscanStartIndex !== currentIndices.overscanStart ||
			overscanEndIndex !== currentIndices.overscanEnd;

		// 7. State'i Güncelle: Indexler Değiştiyse VEYA Güncelleme Zorlandıysa
		//    Not: proceedDueToForce yalnızca scroll/boyut değişmediğinde true olabilir.
		//    Eğer scroll/boyut değiştiyse, indicesChanged büyük ihtimalle true olur
		//    ama garanti olması için her iki durumu da (||) kontrol ederiz.
		if (indicesChanged || proceedDueToForce) {
			// console.log(`Indices changed (${indicesChanged}) or update forced (${proceedDueToForce}), updating state:`, { visibleStart: visibleStartIndex, visibleEnd: visibleEndIndex, overscanStart: overscanStartIndex, overscanEnd: overscanEndIndex }); // Debug
			this.rowIndices = {
				visibleStart: visibleStartIndex,
				visibleEnd: visibleEndIndex,
				overscanStart: overscanStartIndex,
				overscanEnd: overscanEndIndex
			};
		} else {
			// console.log('Indices did not change and update not forced, skipping state update.'); // Debug
			// Indexler değişmedi VE güncelleme zorlanmadı (yani sadece scroll/boyut değişti ama indexler aynı kaldı)
		}
	};

	// OPTIMIZED virtualData: Sadece index state'lerine ve focus state'ine bağımlı
	readonly virtualData = $derived.by(() => {
		if (this.get.enableVirtualization === false) return []; // Virtualization kapalıysa boş dizi

		const startIndex = this.rowIndices.overscanStart;
		const endIndex = this.rowIndices.overscanEnd;
		const dataLength = this.get.data.length; // Sadece uzunluk kontrolü için

		// Geçerli indexler yoksa veya data yoksa boş dizi
		if (startIndex == null || endIndex == null || dataLength === 0 || startIndex > endIndex) return [];

		const processedData: TData[] = [];

		// Görünür aralıktaki verileri işle (slice yok!)
		for (let i = startIndex; i <= endIndex; i++) {
			// Doğrudan index ile erişim ve snapshot (opsiyonel, satır objesi reaktif değilse gerekmeyebilir)
			const row = $state.snapshot(this.get.data[i]) as TData;
			if (row) {
				// Ekstra kontrol
				processedData.push({ ...row, oi: i });
			}
		}

		// Odaklanmış hücre mantığı (state'ten okunur)
		const focusedCell = untrack(() => this.getFocusedCell); // Odak değişimi $derived'i tetiklemesin diye untrack
		const focusedRowIndex = focusedCell?.rowIndex;

		if (typeof focusedRowIndex === 'number' && focusedRowIndex < dataLength) {
			// Odaklanmış satır zaten işlenen aralıkta mı?
			const isFocusedRowAlreadyIncluded = focusedRowIndex >= startIndex && focusedRowIndex <= endIndex;

			if (!isFocusedRowAlreadyIncluded) {
				// Eğer dahil değilse, odaklanmış satırı al ve ekle
				const focusedCellRow: TData = $state.snapshot(this.get.data[focusedRowIndex]) as TData;
				if (focusedCellRow) {
					const rowWithOi = { ...focusedCellRow, oi: focusedRowIndex };
					if (focusedRowIndex < startIndex) {
						processedData.unshift(rowWithOi); // Başa ekle
					} else {
						// focusedRowIndex > endIndex olmalı
						processedData.push(rowWithOi); // Sona ekle
					}
				}
			}
		}

		return processedData;
	});

	// ################################## END Vertical Virtual Data (OPTIMIZED) ##########################################

	// ################################## BEGIN Keyboard Navigation Methods (OPTIMIZED) ############################################
	readonly getPageUpRowIndex = () => {
		const visibleStartIndex = this.rowIndices.visibleStart;
		const clientHeight = this.clientHeightState;
		const dataRowHeight = this.get.tbodyRowHeight;

		if (visibleStartIndex == null || clientHeight <= 0 || dataRowHeight <= 0) return undefined;

		return visibleStartIndex - Math.floor(clientHeight / dataRowHeight) + 1 + this.defaultOverscanThreshold;
	};

	readonly getPageDownRowIndex = () => {
		const visibleEndIndex = this.rowIndices.visibleEnd;
		const clientHeight = this.clientHeightState;
		const dataRowHeight = this.get.tbodyRowHeight;

		if (visibleEndIndex == null || clientHeight <= 0 || dataRowHeight <= 0) return undefined;

		return visibleEndIndex + Math.floor(clientHeight / dataRowHeight) - 1 - this.defaultOverscanThreshold;
	};
	// ################################## END Keyboard Navigation Methods ###############################################

	// ################################## BEGIN Set Focused Cell State ##################################################
	focusedCell?: FocucedCell = $state();
	readonly getFocusedCell = $derived(this.focusedCell);
	private setFocusedCell = (param?: FocucedCell) => {
		// undefined kabul etmeli
		this.focusedCell = param;
		// Odak değiştiğinde virtualData'nın bunu bilmesi için (eğer gerekirse)
		// trigger etmeye gerek YOK, virtualData zaten focusedCell'i dolaylı okuyor (untrack ile okusa da)
		// Ancak, odaklanan hücrenin görünür olması için scroll gerekebilir.
	};
	private clearFocusedCell = () => this.setFocusedCell(undefined);

	private setFocusedCellTabIndex = async (focucedCell?: FocucedCell) => {
		// undefined kabul etmeli
		// ... tabindex mantığı aynı kalabilir ...
		if (this.element != null && focucedCell != null && focucedCell.rowIndex != null && focucedCell.colIndex != null) {
			const focusedCellNode = this.element.querySelector<HTMLDivElement>(`:scope > [role="row"] > [data-cell="${focucedCell.rowIndex}_${focucedCell.colIndex}"]`);
			if (focusedCellNode && focusedCellNode.querySelector<Element & HTMLOrSVGElement>('[tabindex="0"]')) {
				// Eğer hücre içinde focuslanabilir eleman varsa, hücrenin tabindex'i -1 olur
				this.setFocusedCell({ ...focucedCell, tabIndex: -1 });
				return; // State güncellendi, çık
			}
		}
		// Diğer durumlarda veya ilk atamada state'i doğrudan set et
		this.setFocusedCell(focucedCell);
		await tick(); // DOM güncellemesi için bekle (opsiyonel)
	};

	private focusCellNode = () => {
		const nextFocusedCellNode = this.element?.querySelector<HTMLDivElement>(':scope > [role="row"] > [data-focused]');
		if (nextFocusedCellNode == null) return;

		nextFocusedCellNode.scrollIntoView({ block: 'nearest', inline: 'nearest' });
		const elementToFocus = nextFocusedCellNode.querySelector<Element & HTMLOrSVGElement>('[tabindex="0"]') ?? nextFocusedCellNode;
		elementToFocus.focus({ preventScroll: true });
	};

	readonly focusCell = async ({ cellToFocus }: { cellToFocus: Required<FocucedCell> }) => {
		await this.setFocusedCellTabIndex(cellToFocus); // tabindex durumunu ve focucedCell state'ini günceller.

		// pageup veya pagedown gibi uzun atlamalar olduğunda, yani scan edilmiş tüm virtual datanın da uzağına gidilmek istendiğinde, virtual data bir kez güncellenir.
		// bu güncelleme setFocusedCellState ile değişen state'i baz alarak focuslanacak hücre bilgilerini virtual dataya pinler ve dom'u günceller.
		// artık uzaktaki hücre dom'da oluşturulmuştur.
		const focusedCellNode = this.element?.querySelector<HTMLDivElement>(`:scope > [role="row"] > [data-cell="${cellToFocus.rowIndex}_${cellToFocus.colIndex}"]`);
		if (this.get.enableVirtualization === true && !focusedCellNode) {
			/* const { rowOverscanStartIndex, rowOverscanEndIndex } = this.findVisibleRowIndexs({}); */
			this.updateVisibleIndexes(true);
			if (
				(this.rowIndices.overscanStart != null && cellToFocus.rowIndex <= this.rowIndices.overscanStart) ||
				(this.rowIndices.overscanEnd != null && cellToFocus.rowIndex >= this.rowIndices.overscanEnd)
			) {
				/* await this.setVirtualDataDerivedTrigger(`focus_${cellToFocus.originalCell}`); */
				await this.setFocusedCellTabIndex(cellToFocus); // dom'da yeni görünür olduğundan, tabindex durumunu yeniden güncellemek için.
			}
		}

		// satır başında ve satır sonunda 4'er tane overscan satır olduğu için, scrollIntoView sayesinde scroll tetiklenir ve virtual data bir kez güncellenir.
		this.focusCellNode();

		this.onCellFocusChangeThis({ rowIndex: cellToFocus.rowIndex, colIndex: cellToFocus.colIndex });
	};
	// ################################## END Set Focused Cell State #####################################################

	// ################################## BEGIN Row Selection Methods ####################################################
	// ... (Row selection metodları aynı kalır: selectedRows, getSelectedRows, ...) ...
	private selectedRows: number[] = $state.raw([]); // Private state manager
	readonly getSelectedRows = $derived(this.selectedRows); // Public readonly getter
	private setSelectedRows = (param: number[]) => (this.selectedRows = param); // Private set method
	private clearSelectedRows = () => (this.selectedRows = []); // Private clear methods

	readonly toggleRowSelection = async (rowIndex: number) => {
		if (this.get.rowSelection === 'none') return;

		const selectedRows = $state.snapshot(this.getSelectedRows); // Snapshot alarak çalışmak daha güvenli olabilir
		const index = selectedRows.indexOf(rowIndex);

		if (this.get.rowSelection === 'single') {
			this.setSelectedRows(index === -1 ? [rowIndex] : []);
		} else if (this.get.rowSelection === 'multiple') {
			if (index === -1) {
				this.setSelectedRows([...selectedRows, rowIndex]);
			} else {
				this.setSelectedRows(selectedRows.filter((idx) => idx !== rowIndex));
			}
		}

		// await tick();
		this.onRowSelectionChangeThis({ selectedRows: this.getSelectedRows });
	};

	readonly toggleAllRows = async (select: boolean) => {
		if (this.get.rowSelection !== 'multiple') return;

		if (select) {
			this.setSelectedRows(Array.from({ length: this.get.data.length }, (_, i) => i));
		} else {
			this.clearSelectedRows();
		}
		// await tick();
		this.onRowSelectionChangeThis({ selectedRows: this.getSelectedRows });
	};
	// ################################## END Row Selection Methods ######################################################

	// ################################## BEGIN General Methods ##########################################################
	readonly setColumnWidth = (ci: number, min: number, width: number) => {
		/* ... aynı kalır ... */
		// Bu metodun columns state'ini güncellemesi $derived'leri tetikler (örn. gridTemplateColumns)
		const currentColumns = $state.snapshot(this.set.columns) as Column<TData>[]; // Önce snapshot al
		if (currentColumns && currentColumns[ci]) {
			currentColumns[ci].width = `${Math.max(min, width)}px`;
			this.columns(currentColumns); // Güncellenmiş dizi ile state'i set et
		}
	};
	readonly getFooter = ({ field, foot }: { field: Field<TData>; foot: Footer<TData> }): number | string => {
		/* ... aynı kalır ... */
		const footer = foot[field];
		if (footer == null) return '';
		const dataSnapshot = $state.snapshot(this.get.data) as TData[]; // Hesaplama için snapshot

		return footer === 'count'
			? dataSnapshot.length
			: footer === 'avg'
				? dataSnapshot.reduce((acc, row) => {
						const value = row[field];
						return typeof value === 'number' ? acc + value : acc;
					}, 0) / (dataSnapshot.length || 1) // 0'a bölmeyi engelle
				: footer === 'sum'
					? dataSnapshot.reduce((acc, row) => {
							const value = row[field];
							return typeof value === 'number' ? acc + value : acc;
						}, 0)
					: footer;
	};

	// findVisibleRowIndexs metodu artık doğrudan kullanılmıyor,
	// logic'i updateVisibleIndexes içine taşındı.
	// private findVisibleRowIndexs: (...) => { ... } = (...) => { ... }; // KALDIRILDI veya private helper yapıldı

	// ################################## END General Methods ################################################################
}

// ################################## BEGIN Export Table Context ###############################################################
export function createTable<TData extends Row>(sources: Sources<TData>) {
	return setContext(sources.id, new Table<TData>(sources));
}
export function getTable<TData extends Row>(id: string) {
	return getContext<ReturnType<typeof createTable<TData>>>(id);
}
// ################################## END Export Table Context #################################################################

export type { Sources, Row };
