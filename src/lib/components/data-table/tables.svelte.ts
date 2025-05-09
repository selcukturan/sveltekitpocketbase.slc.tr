import type { Sources, RequiredSources, Row, FocucedCell, Footer, Field, OnCellFocusChange, OnRowSelectionChange, OnTableAction, OnRowAction, OnActionParams } from './types';
import { getContext, setContext, untrack } from 'svelte';
import { tick } from 'svelte';

class Table<TData extends Row> {
	// ################################## BEGIN Constructor ################################################################
	element?: HTMLDivElement = $state();
	private set: Sources<TData> = $state({ id: '', columns: [] }); // orjinal sources. kaynaklar/sources değiştirilirken bu değişken kullanılacak. `table.set`
	readonly sources = (value: Sources<TData>) => (this.set = value); // Set All Sources Method
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
	readonly id = (value: RequiredSources<TData>['id']) => (this.set.id = value);
	readonly data = (value: RequiredSources<TData>['data']) => {
		this.clearSelectedRows();
		this.clearFocusedCell();
		this.set.data = value;
	};
	readonly width = (value: RequiredSources<TData>['width']) => (this.set.width = value);
	readonly height = (value: RequiredSources<TData>['height']) => (this.set.height = value);
	readonly enableVirtualization = (value: RequiredSources<TData>['enableVirtualization']) => {
		this.clearSelectedRows();
		this.clearFocusedCell();
		this.set.enableVirtualization = value;
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
	readonly theadRowHeight = (value: RequiredSources<TData>['theadRowHeight']) => (this.set.theadRowHeight = value);
	readonly tbodyRowHeight = (value: RequiredSources<TData>['tbodyRowHeight']) => (this.set.tbodyRowHeight = value);
	readonly tfootRowHeight = (value: RequiredSources<TData>['tfootRowHeight']) => (this.set.tfootRowHeight = value);
	readonly columns = (value: RequiredSources<TData>['columns']) => (this.set.columns = value);
	readonly footers = (value: RequiredSources<TData>['footers']) => (this.set.footers = value);
	// ################################## END Set Sources ##################################################################

	// ################################## BEGIN Properties ################################################################
	// derived sources. kaynaklar/sources okunurken bu değişken kullanılacak. `table.get`
	readonly get = $derived({ ...this.defaultSources, ...this.set });
	// derived columns. kolon bilgileri okunurken bu değişken kullanılacak. `table.columns`
	readonly visibleColumns = $derived(
		this.get.columns
			.map((col, index) => {
				return {
					...col,
					oi: index // original column index
				};
			})
			.filter((column) => !column.hidden)
	);
	// ################################## END Properties ###############################################################

	// ################################## BEGIN General Variables ######################################################
	test = $state('test');

	private headerRowsCountState = $state(1);
	readonly headerRowsCount = $derived(this.headerRowsCountState);
	private setHeaderRowsCount = (value: number) => (this.headerRowsCountState = value);

	public defaultOverscanThreshold = 4;

	readonly gridTemplateRows = $derived.by(() => {
		const repeatThead = this.headerRowsCount >= 1 ? `repeat(${this.headerRowsCount}, ${this.get.theadRowHeight}px)` : ``;
		const repeatTbody = this.get.data.length > 0 ? `repeat(${this.get.data.length}, ${this.get.tbodyRowHeight}px)` : ``;
		const repeatTfoot = this.get.footers.length > 0 ? `repeat(${this.get.footers.length}, ${this.get.tfootRowHeight}px)` : ``;
		return `${repeatThead} ${repeatTbody} ${repeatTfoot}`;
	});

	readonly gridTemplateColumns = $derived(
		`${this.get.rowSelection !== 'none' ? this.get.rowSelectionColumnWidth + 'px' : ''} 
		${this.visibleColumns.map((col) => col.width ?? `150px`).join(' ')} 
		${this.get.rowAction ? this.get.rowActionColumnWidth + 'px' : ''}`
	);
	// ################################## END General Variables ########################################################

	// ################################## BEGIN Events ##########################################################
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
		if (params.type === 'row') {
			this.onRowActionThis(params);
		} else if (params.type === 'table') {
			this.onTableActionThis(params);
		}
	};

	// ################################## BEGIN Vertical Virtual Data ##################################################
	focusedCellState?: FocucedCell = $state();
	cachedScrollTop = undefined as number | undefined;
	cachedClientHeight = undefined as number | undefined;
	rowIndices = $state.raw({
		visibleStart: undefined as number | undefined,
		visibleEnd: undefined as number | undefined,
		overscanStart: undefined as number | undefined,
		overscanEnd: undefined as number | undefined,
		scrollTop: undefined as number | undefined,
		clientHeight: undefined as number | undefined,
		focusedCellRowIndex: undefined as number | undefined
	});

	readonly updateVisibleIndexes = (force: boolean = false) => {
		// 1. Cache Değerleri.
		const scrollTop = this.cachedScrollTop;
		const clientHeight = this.cachedClientHeight;
		const focusedCellRowIndex = this.focusedCellState?.rowIndex;

		// 2. Erken Çıkış Kontrolü.
		if (scrollTop == null || clientHeight == null) {
			return;
		}

		// 3. Mevcut Index Değerleri. Odaklanmış Satır Değişti mi?
		const currentIndices = this.rowIndices;
		const focusedChanged = focusedCellRowIndex !== currentIndices.focusedCellRowIndex;

		// 4. Erken Çıkış Kontrolü
		if (currentIndices.scrollTop === scrollTop && currentIndices.clientHeight === clientHeight && !force && !focusedChanged) {
			return;
		}

		//############################### Eğer buraya geldiysek *YA* scroll/boyut değişti *YA* güncelleme zorlandı *YA DA* odaklanmış satır değişti.

		// 5. Hesaplama İçin Gerekli Değerler
		const headerRowsHeight = this.headerRowsCount * this.get.theadRowHeight;
		const footerRowsHeight = this.get.footers.length * this.get.tfootRowHeight;
		const dataRowHeight = this.get.tbodyRowHeight;
		const dataLength = this.get.data.length;
		const overscanThreshold = this.defaultOverscanThreshold;

		// 6. Erken Çıkış Kontrolü (Veri Yok veya Satır Yüksekliği Geçersizse Resetle).
		if (dataLength === 0 || dataRowHeight <= 0) {
			// Sadece mevcut state resetlenmemişse resetle.
			if (this.rowIndices.visibleStart !== undefined || this.rowIndices.overscanStart !== undefined) {
				this.rowIndices = {
					visibleStart: undefined,
					visibleEnd: undefined,
					overscanStart: undefined,
					overscanEnd: undefined,
					scrollTop: undefined,
					clientHeight: undefined,
					focusedCellRowIndex: undefined
				};
			}
			return;
		}

		// 7. Yeni Indexleri Hesapla
		const currentContentHeight = Math.max(0, clientHeight - headerRowsHeight - footerRowsHeight); // Negatif olmamasını sağla
		const visibleStartIndex = Math.max(0, Math.floor(scrollTop / dataRowHeight));
		const visibleEndIndex = Math.min(dataLength - 1, Math.floor((scrollTop + currentContentHeight) / dataRowHeight));
		const overscanStartIndex = Math.max(0, visibleStartIndex - overscanThreshold);
		const overscanEndIndex = Math.min(dataLength - 1, visibleEndIndex + overscanThreshold);

		// 8. Mevcut Overscan Indexler Değişti mi?
		const indicesChanged = overscanStartIndex !== currentIndices.overscanStart || overscanEndIndex !== currentIndices.overscanEnd;

		// 9. Mevcut Odaklanmış Satır, Yeni Index Aralığında mı?
		const isFocusedRowAlreadyIncluded =
			currentIndices.focusedCellRowIndex && currentIndices.focusedCellRowIndex >= overscanStartIndex && currentIndices.focusedCellRowIndex <= overscanEndIndex;

		// 10. State'i Güncelle: Indexler Değiştiyse VEYA Güncelleme Zorlandıysa
		if (indicesChanged || force || (focusedChanged && !isFocusedRowAlreadyIncluded)) {
			this.rowIndices = {
				visibleStart: visibleStartIndex,
				visibleEnd: visibleEndIndex,
				overscanStart: overscanStartIndex,
				overscanEnd: overscanEndIndex,
				scrollTop: scrollTop,
				clientHeight: clientHeight,
				focusedCellRowIndex: focusedCellRowIndex
			};
		} else {
			// Indexler değişmedi, güncelleme zorlanmadı ve odaklanmış satır zaten mevcut aralıkta
		}
	};

	readonly virtualData = $derived.by(() => {
		const startIndex = this.rowIndices.overscanStart;
		const endIndex = this.rowIndices.overscanEnd;
		const focusedCellRowIndex = this.rowIndices.focusedCellRowIndex;
		const rawData = this.get.data;
		const dataLength = rawData.length; // Sadece uzunluk kontrolü için

		// Geçerli indexler yoksa veya data yoksa boş dizi
		if (startIndex == null || endIndex == null || dataLength === 0 || startIndex > endIndex) return [];

		const processedData: Array<{ data: TData; roi: number }> = [];

		for (let i = startIndex; i <= endIndex; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row, roi: i });
			}
		}

		if (typeof focusedCellRowIndex === 'number' && focusedCellRowIndex < dataLength) {
			// Odaklanmış satır zaten işlenen aralıkta mı?
			const isFocusedRowAlreadyIncluded = focusedCellRowIndex >= startIndex && focusedCellRowIndex <= endIndex;
			if (!isFocusedRowAlreadyIncluded) {
				// Eğer dahil değilse, odaklanmış satırı al ve ekle
				const focusedCellRow = rawData[focusedCellRowIndex];
				if (focusedCellRow) {
					const rowWithRoi = { data: focusedCellRow, roi: focusedCellRowIndex };
					if (focusedCellRowIndex < startIndex) {
						processedData.unshift(rowWithRoi); // Başa ekle
					} else {
						// focusedCellRowIndex > endIndex olmalı
						processedData.push(rowWithRoi); // Sona ekle
					}
				}
			}
		}

		return processedData;
	});
	// ################################## END Vertical Virtual Data ####################################################

	// ################################## BEGIN Keyboard Navigation Methods ############################################
	/* readonly getPageUpRowIndex = () => {
		const { rowVisibleStartIndex, currentHeight, dataRowHeight } = this.findVisibleRowIndexs({});
		if (rowVisibleStartIndex == null || currentHeight == null || dataRowHeight == null) return undefined;

		return rowVisibleStartIndex - Math.floor(currentHeight / dataRowHeight) + 1;
	};
	readonly getPageDownRowIndex = () => {
		const { rowVisibleEndIndex, currentHeight, dataRowHeight } = this.findVisibleRowIndexs({});
		if (rowVisibleEndIndex == null || currentHeight == null || dataRowHeight == null) return undefined;

		return rowVisibleEndIndex + Math.floor(currentHeight / dataRowHeight) - 1;
	}; */
	// ################################## END Keyboard Navigation Methods ###############################################

	// ################################## BEGIN Set Focused Cell State ##################################################
	private focusedCell?: FocucedCell = $state();
	readonly getFocusedCell = $derived(this.focusedCell); // reactive state getter
	private setFocusedCell = (param: FocucedCell) => (this.focusedCell = param);
	private clearFocusedCell = () => (this.focusedCell = undefined);

	private setFocusedCellTabIndex = async (focucedCell: FocucedCell) => {
		// Fokuslanacak hücre elementinin içinde, tabindex'i 0 olan fokuslanılabilir bir element varsa, hücre elementinin tabindex'ini -1 yap.
		if (this.element != null && focucedCell != null && focucedCell.rowIndex != null && focucedCell.colIndex != null) {
			const focusedCellNode = this.element.querySelector<HTMLDivElement>(`:scope > [role="row"] > [data-cell="${focucedCell.rowIndex}_${focucedCell.colIndex}"]`);
			if (focusedCellNode && focusedCellNode.querySelector<Element & HTMLOrSVGElement>('[tabindex="0"]')) {
				this.setFocusedCell({ ...focucedCell, tabIndex: -1 });
			}
		}
		this.setFocusedCell(focucedCell);
		await tick();
	};

	private focusCellNode = () => {
		const nextFocusedCellNode = this.element?.querySelector<HTMLDivElement>(':scope > [role="row"] > [data-focused]');
		if (nextFocusedCellNode == null) return;

		nextFocusedCellNode.scrollIntoView({ block: 'nearest', inline: 'nearest' });
		const elementToFocus = nextFocusedCellNode.querySelector<Element & HTMLOrSVGElement>('[tabindex="0"]') ?? nextFocusedCellNode;
		elementToFocus.focus({ preventScroll: true });
	};

	/* readonly focusCell = async ({ cellToFocus, triggerVirtual = false }: { cellToFocus: Required<FocucedCell>; triggerVirtual?: boolean }) => {
		await this.setFocusedCellTabIndex(cellToFocus); // tabindex durumunu ve focucedCell state'ini günceller.

		// pageup veya pagedown gibi uzun atlamalar olduğunda, yani scan edilmiş tüm virtual datanın da uzağına gidilmek istendiğinde, virtual data bir kez güncellenir.
		// bu güncelleme setFocusedCellState ile değişen state'i baz alarak focuslanacak hücre bilgilerini virtual dataya pinler ve dom'u günceller.
		// artık uzaktaki hücre dom'da oluşturulmuştur.
		if (this.get.enableVirtualization === true && triggerVirtual === true) {
			const { rowOverscanStartIndex, rowOverscanEndIndex } = this.findVisibleRowIndexs({});
			if ((rowOverscanStartIndex != null && cellToFocus.rowIndex <= rowOverscanStartIndex) || (rowOverscanEndIndex != null && cellToFocus.rowIndex >= rowOverscanEndIndex)) {
				await this.setVirtualDataDerivedTrigger(`focus_${cellToFocus.originalCell}`);
				await this.setFocusedCellTabIndex(cellToFocus); // dom'da yeni görünür olduğundan, tabindex durumunu yeniden güncellemek için.
			}
		}

		// satır başında ve satır sonunda 4'er tane overscan satır olduğu için, scrollIntoView sayesinde scroll tetiklenir ve virtual data bir kez güncellenir.
		this.focusCellNode();

		this.onCellFocusChangeThis({ rowIndex: cellToFocus.rowIndex, colIndex: cellToFocus.colIndex });
	}; */
	// ################################## END Set Focused Cell State #####################################################

	// ################################## BEGIN Row Selection Methods ##############################################################
	private selectedRows: number[] = $state.raw([]); // Private state manager
	readonly getSelectedRows = $derived(this.selectedRows); // Public readonly getter
	private setSelectedRows = (param: number[]) => (this.selectedRows = param); // Private set method
	private clearSelectedRows = () => (this.selectedRows = []); // Private clear methods

	// Public methods with business logic
	// Bir satırın seçimini değiştirir
	readonly toggleRowSelection = async (rowIndex: number) => {
		if (this.get.rowSelection === 'none') return;

		const selectedRows = this.getSelectedRows;
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

		await tick();
		this.onRowSelectionChangeThis({ selectedRows: this.getSelectedRows });
	};

	// Tüm satırları seçer veya seçimi kaldırır
	readonly toggleAllRows = async (select: boolean) => {
		if (this.get.rowSelection !== 'multiple') return;

		if (select) {
			this.setSelectedRows(Array.from({ length: this.get.data.length }, (_, i) => i)); // Tüm satırları seç
		} else {
			this.clearSelectedRows(); // Tüm seçimleri kaldır
		}
		await tick();
		this.onRowSelectionChangeThis({ selectedRows: this.getSelectedRows });
	};
	// ################################## END Row Selection Methods ################################################################

	// ################################## BEGIN Cell Edit ##################################################
	editingCell: boolean = $state(false);
	editingCellInput: HTMLInputElement | undefined = $state(undefined);
	editingCellValue: unknown = $state('');
	editingCellOldValue: unknown = $state('');
	editingCellPath: string = $state('');
	removeCellInput = () => {
		if (this.editingCell) {
			this.editingCellPath = '';
			this.editingCellInput = undefined;
			this.editingCellOldValue = '';
			this.editingCellValue = '';
			this.editingCell = false;
		}
	};
	createCellInput = (key: string, rowOi: number, colOi: number, field: Field<TData>) => {
		const snapshotRow = $state.snapshot(this.get.data[rowOi]) as TData;
		const oldValue = snapshotRow[field];
		const oldValueForInput = oldValue != null ? oldValue.toString() : '';
		this.editingCellOldValue = oldValueForInput;
		this.editingCellValue = key === 'F2' || key === 'SLCDBL' ? oldValueForInput : key;
		this.editingCell = true;
		this.editingCellPath = `r${rowOi}c${colOi}`;
	};
	setCellValue = (newValue: unknown, oldValue: unknown, rowOi: number, colOi: number, field: Field<TData>) => {
		if (newValue === oldValue) return;

		const snapshotRow = $state.snapshot(this.get.data[rowOi]) as TData;

		if (this.set.data && typeof snapshotRow[field] === typeof newValue) {
			snapshotRow[field] = newValue as TData[Field<TData>];
			this.set.data[rowOi] = snapshotRow;
		} else {
			console.error(`Type mismatch: Field ${field} expects ${typeof snapshotRow[field]}, but got ${typeof newValue}`);
		}
	};
	// ################################## END Cell Edit ##################################################

	// ################################## BEGIN General Methods ####################################################################
	readonly throttle = <T extends (...args: any[]) => any>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
		let inThrottle: boolean = false;
		return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
			if (!inThrottle) {
				func.apply(this, args); // Fonksiyonu çağır
				inThrottle = true; // Kısıtlama bayrağını ayarla
				setTimeout(() => (inThrottle = false), limit); // Belirtilen süre sonra bayrağı kaldır
			}
		};
	};
	readonly throttledFocusLogic = this.throttle(async (cellToFocus: Required<FocucedCell>, initialOriginalCell: string) => {
		// Cell identifier'ı throttle edilen fonksiyon içinde hesapla/güncelle
		cellToFocus.originalCell = `${cellToFocus.rowIndex}_${cellToFocus.colIndex}`;

		// --- Hücreyi Odakla (Eğer Değiştiyse) ---
		// initialOriginalCell, throttle çağrılmadan *önceki* hücreydi
		if (initialOriginalCell !== cellToFocus.originalCell) {
			// console.log('Focusing cell (throttled):', cellToFocus);
			try {
				// await this.focusCell({ cellToFocus, triggerVirtual: true });
			} catch (error) {
				console.error('Error focusing cell (throttled):', error);
			}
		} else {
			// Bu durum throttle ile daha az olasıdır ama yine de olabilir
			// console.log('Cell did not change, no focus needed (throttled).');
		}
	}, 20);

	readonly setColumnWidth = (ci: number, min: number, width: number) => {
		this.set.columns[ci].width = `${Math.max(min, width)}px`;
	};
	readonly getFooter = ({ field, foot }: { field: Field<TData>; foot: Footer<TData> }): number | string => {
		const footer = foot[field]; // sum, avg, count or footer content
		if (footer == null) return '';

		return footer === 'count'
			? this.get.data.length
			: footer === 'avg'
				? this.get.data.reduce((acc, row) => {
						const value = row[field];
						return typeof value === 'number' ? acc + value : acc;
					}, 0) / this.get.data.length
				: footer === 'sum'
					? this.get.data.reduce((acc, row) => {
							const value = row[field];
							return typeof value === 'number' ? acc + value : acc;
						}, 0)
					: footer;
	};

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
