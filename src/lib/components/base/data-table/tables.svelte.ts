import type { Sources, RequiredSources, Row, FocucedCell, Column, Footer, Field, OnCellFocusChange, OnRowSelectionChange, OnTableAction, OnRowAction, OnActionParams } from './types';
import { getContext, setContext } from 'svelte';
import { tick } from 'svelte';

class Table<TData extends Row> {
	// ################################## BEGIN Default Sources #####################################################################################################################
	#defSrc: RequiredSources<TData> = {
		id: '',
		data: [],
		width: '100%',
		height: '100%',
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
	// ################################## END Default Sources #######################################################################################################################

	// ################################## BEGIN Constructor #########################################################################################################################
	element?: HTMLDivElement = $state();
	#src: Sources<TData> = $state(this.#defSrc); // UYARI: Veri okumak için kullanmayın. Sadece sınıf içindeyken kaynakları değiştirmek için kullanın. `this.#src.width = '100px'` gibi.
	private readonly sources = (src: Sources<TData>) => (this.#src = src); // Set All Sources Method
	#resizeObserver: ResizeObserver | null = null;

	constructor(sources: Sources<TData>) {
		this.sources(sources);

		$effect(() => {
			const currentElement = this.element;

			if (currentElement) {
				this.#resizeObserver = new ResizeObserver((entries) => {
					const entry = entries[0];
					if (entry?.contentRect.height > 0) {
						this.#debouncedResizeHandler(entry.contentRect.height);
					}
				});
				this.#resizeObserver.observe(currentElement);
			}

			return () => {
				this.#resizeObserver?.disconnect();
				this.#resizeObserver = null;
			};
		});
	}
	// ################################## END Constructor ##########################################################################################################################

	// ################################## BEGIN Source Setter Method for Global Use. `table.setSource('width','100px')` or `this.setSource('width','100px')` #######################
	readonly setSource = <K extends keyof RequiredSources<TData>>(key: K, value: RequiredSources<TData>[K]) => {
		// Önce özel işlemler için kontrolleri yapalım
		if (key === 'data' || key === 'rowSelection') {
			this.clearSelectedRows();
		}
		if (key === 'tbodyRowHeight') {
			this.updateVisibleIndexes(true);
		}

		// Değeri güncelleyelim (tip güvenli olarak)
		this.#src[key] = value;
	};
	// ################################## END Source Setter Method for Global Use ###################################################################################################

	// ################################## BEGIN Methods that reactively return sources for global use. `table.srcWidth` or `this.srcWidth` ##########################################
	readonly srcId = $derived(this.#src.id || this.#defSrc.id);
	readonly srcData = $derived(this.#src.data || this.#defSrc.data);
	readonly srcWidth = $derived(this.#src.width || this.#defSrc.width);
	readonly srcHeight = $derived(this.#src.height || this.#defSrc.height);
	readonly srcRowSelection = $derived(this.#src.rowSelection || this.#defSrc.rowSelection);
	readonly srcRowSelectionColumnWidth = $derived(this.#src.rowSelectionColumnWidth || this.#defSrc.rowSelectionColumnWidth);
	readonly srcActions = $derived(this.#src.actions || this.#defSrc.actions);
	readonly srcRowAction = $derived(this.#src.rowAction ?? this.#defSrc.rowAction);
	readonly srcRowActionColumnWidth = $derived(this.#src.rowActionColumnWidth || this.#defSrc.rowActionColumnWidth);
	readonly srcTheadRowHeight = $derived(this.#src.theadRowHeight || this.#defSrc.theadRowHeight);
	readonly srcTbodyRowHeight = $derived(this.#src.tbodyRowHeight || this.#defSrc.tbodyRowHeight);
	readonly srcTfootRowHeight = $derived(this.#src.tfootRowHeight || this.#defSrc.tfootRowHeight);
	readonly srcColumns = $derived(this.#src.columns || this.#defSrc.columns);
	readonly srcFooters = $derived(this.#src.footers || this.#defSrc.footers);
	// ################################## END Methods that reactively return sources for global use. #################################################################################

	// ################################## BEGIN Getter Visible Columns ###############################################################################################################
	readonly visibleColumns = $derived.by(() => {
		const columns = this.srcColumns;

		const processedColumns: Array<{ data: Column<TData>; coi: number }> = [];

		for (let i = 0; i <= columns.length; i++) {
			const col = columns[i];
			if (col && col.hidden !== true) {
				processedColumns.push({ data: col, coi: i });
			}
		}

		return processedColumns;
	});
	// ################################## END Getter Visible Columns ##################################################################################################################

	// ################################## BEGIN General Variables #####################################################################################################################
	#defaultOverscanThreshold = 4;
	#headerRowsCountState = $state(1);
	get headerRowsCountState() {
		return this.#headerRowsCountState;
	}

	readonly #gridTemplateRows = $derived.by(() => {
		const repeatThead = this.headerRowsCountState >= 1 ? `repeat(${this.headerRowsCountState}, ${this.srcTheadRowHeight}px)` : ``;
		const repeatTbody = this.srcData.length > 0 ? `repeat(${this.srcData.length}, ${this.srcTbodyRowHeight}px)` : ``;
		const repeatTfoot = this.srcFooters.length > 0 ? `repeat(${this.srcFooters.length}, ${this.srcTfootRowHeight}px)` : ``;
		return `${repeatThead} ${repeatTbody} ${repeatTfoot}`;
	});

	readonly #gridTemplateColumns = $derived(
		`${this.srcRowSelection !== 'none' ? this.srcRowSelectionColumnWidth + 'px' : ''} 
		${this.visibleColumns.map((col) => col.data.width ?? `150px`).join(' ')} 
		${this.srcRowAction ? this.srcRowActionColumnWidth + 'px' : ''}`
	);
	// ################################## END General Variables ########################################################################################################################

	// ################################## BEGIN Events #################################################################################################################################
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
	// ################################## END Events #######################################################################################################################################

	readonly actionTrigger = (params: OnActionParams) => {
		if (params.type === 'row') {
			this.onRowActionThis(params);
		} else if (params.type === 'table') {
			this.onTableActionThis(params);
		}
	};

	// ################################## BEGIN Vertical Virtual Data ######################################################################################################################
	#focusedCellState?: FocucedCell = $state();
	get focusedCellState() {
		return this.#focusedCellState;
	}
	cachedScrollTop = undefined as number | undefined;
	cachedClientHeight = undefined as number | undefined;
	#rowIndices = $state.raw({
		visibleStart: undefined as number | undefined,
		visibleEnd: undefined as number | undefined,
		overscanStart: undefined as number | undefined,
		overscanEnd: undefined as number | undefined,
		scrollTop: undefined as number | undefined,
		clientHeight: undefined as number | undefined,
		focusedCellRowIndex: undefined as number | undefined
	});
	get rowIndices() {
		return this.#rowIndices;
	}

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
		const currentIndices = this.#rowIndices;
		const focusedChanged = focusedCellRowIndex !== currentIndices.focusedCellRowIndex;

		// 4. Erken Çıkış Kontrolü
		if (currentIndices.scrollTop === scrollTop && currentIndices.clientHeight === clientHeight && !force && !focusedChanged) {
			return;
		}

		//############################### Eğer buraya geldiysek *YA* scroll/boyut değişti *YA* güncelleme zorlandı *YA DA* odaklanmış satır değişti.

		// 5. Hesaplama İçin Gerekli Değerler
		const headerRowsHeight = this.headerRowsCountState * this.srcTheadRowHeight;
		const footerRowsHeight = this.srcFooters.length * this.srcTfootRowHeight;
		const dataRowHeight = this.srcTbodyRowHeight;
		const dataLength = this.srcData.length;
		const overscanThreshold = this.#defaultOverscanThreshold;

		// 6. Erken Çıkış Kontrolü (Veri Yok veya Satır Yüksekliği Geçersizse Resetle).
		if (dataLength === 0 || dataRowHeight <= 0) {
			// Sadece mevcut state resetlenmemişse resetle.
			if (this.#rowIndices.visibleStart !== undefined || this.#rowIndices.overscanStart !== undefined) {
				this.#rowIndices = {
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

		// 10. State'i Güncelle: Indexler Değiştiyse VEYA Güncelleme Zorlandıysa VEYA Odaklanmış Satır Değiştiyse ve Yeni Aralıkta Değilse
		if (indicesChanged || force || (focusedChanged && !isFocusedRowAlreadyIncluded)) {
			this.#rowIndices = {
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
		const startIndex = this.#rowIndices.overscanStart;
		const endIndex = this.#rowIndices.overscanEnd;
		const focusedCellRowIndex = this.#rowIndices.focusedCellRowIndex;
		const rawData = this.srcData;
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

		if (focusedCellRowIndex != null && focusedCellRowIndex < dataLength) {
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

	virtualScrollAction = (tableNode: HTMLDivElement) => {
		let ticking = false;

		this.cachedClientHeight = Math.round(tableNode.clientHeight);
		this.cachedScrollTop = Math.round(tableNode.scrollTop);

		const handleScroll = () => {
			if (!ticking) {
				const newScrollTop = Math.round(tableNode.scrollTop);
				const cachedScrollTop = this.cachedScrollTop ?? 0;
				const scrollDelta = Math.abs(newScrollTop - cachedScrollTop);
				const overscan = Math.max(0, this.#defaultOverscanThreshold - 1);
				const scrollThreshold = this.srcTbodyRowHeight * overscan;

				if (scrollDelta > scrollThreshold) {
					ticking = true;
					/* requestAnimationFrame(() => { */
					this.cachedScrollTop = newScrollTop;
					this.updateVisibleIndexes();
					tick().then(() => {
						ticking = false;
					});
					/* }); */
				}
			}
		};

		tableNode.addEventListener('scroll', handleScroll, { passive: true });

		return {
			destroy() {
				tableNode.removeEventListener('scroll', handleScroll);
			}
		};
	};
	// ################################## END Vertical Virtual Data #######################################################################################################################

	// ################################## BEGIN Row Selection Methods #####################################################################################################################
	private selectedRows: number[] = $state.raw([]); // Private state manager
	readonly getSelectedRows = $derived(this.selectedRows); // Public readonly getter
	private setSelectedRows = (param: number[]) => (this.selectedRows = param); // Private set method
	private clearSelectedRows = () => (this.selectedRows = []); // Private clear methods

	// Public methods with business logic
	// Bir satırın seçimini değiştirir
	readonly toggleRowSelection = async (rowIndex: number) => {
		if (this.srcRowSelection === 'none') return;

		const selectedRows = this.getSelectedRows;
		const index = selectedRows.indexOf(rowIndex);

		if (this.srcRowSelection === 'single') {
			this.setSelectedRows(index === -1 ? [rowIndex] : []);
		} else if (this.srcRowSelection === 'multiple') {
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
		if (this.srcRowSelection !== 'multiple') return;

		if (select) {
			this.setSelectedRows(Array.from({ length: this.srcData.length }, (_, i) => i)); // Tüm satırları seç
		} else {
			this.clearSelectedRows(); // Tüm seçimleri kaldır
		}
		await tick();
		this.onRowSelectionChangeThis({ selectedRows: this.getSelectedRows });
	};
	// ################################## END Row Selection Methods ########################################################################################################################

	// ################################## BEGIN Cell Edit ##################################################################################################################################
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
		const snapshotRow = $state.snapshot(this.srcData[rowOi]) as TData;
		const oldValue = snapshotRow[field];
		const oldValueForInput = oldValue != null ? oldValue.toString() : '';
		this.editingCellOldValue = oldValueForInput;
		this.editingCellValue = key === 'F2' || key === 'SLCDBL' ? oldValueForInput : key;
		this.editingCell = true;
		this.editingCellPath = `r${rowOi}c${colOi}`;
	};
	setCellValue = (newValue: unknown, oldValue: unknown, rowOi: number, colOi: number, field: Field<TData>) => {
		if (newValue === oldValue) return;

		const snapshotRow = $state.snapshot(this.srcData[rowOi]) as TData;

		if (this.#src.data && typeof snapshotRow[field] === typeof newValue) {
			snapshotRow[field] = newValue as TData[Field<TData>];
			this.#src.data[rowOi] = snapshotRow;
		} else {
			console.error(`Type mismatch: Field ${field} expects ${typeof snapshotRow[field]}, but got ${typeof newValue}`);
		}
	};
	// ################################## END Cell Edit ####################################################################################################################################
	// ################################## BEGIN Actions ####################################################################################################################################
	tdFocusAction = (node: HTMLDivElement, originalCell: { rowIndex: number; colIndex: number }) => {
		const mousedown = (e: Event) => {
			const cellToFocus: Required<FocucedCell> = {
				rowIndex: originalCell.rowIndex,
				colIndex: originalCell.colIndex,
				originalCell: `${originalCell.rowIndex}_${originalCell.colIndex}`,
				tabIndex: 0
			};

			if (cellToFocus.originalCell === this.focusedCellState?.originalCell) return;

			this.#focusedCellState = cellToFocus;
			this.updateVisibleIndexes();
			tick().then(() => {
				node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
				node.focus({ preventScroll: true });
			});
		};

		const click = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
		};

		let ticking = false;
		const keydown = (e: KeyboardEvent) => {
			const { key } = e;
			const typableNumber = '1234567890';
			const typableLower = 'abcdefghijklmnopqrstuvwxyz';
			const typableUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			const typableOther = " =-`[\\]';,./ğüşıöçĞÜŞİÖÇ";

			// --- İzin Verilmeyen Tuşları Filtrele ---
			const isNavigationKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Enter', 'Tab'].includes(key);
			const isActionKey = ['F2', ' ', 'c', 'C', 'v', 'V', 'Escape'].includes(key); // Boşluk, F2, Kopyala/Yapıştır, Escape
			const isTypable = typableNumber.includes(key) || typableLower.includes(key) || typableUpper.includes(key) || typableOther.includes(key);

			// İzin verilmeyen tuşlar veya anlık eylemler önce ele alınır
			if (!isNavigationKey && !isActionKey && !isTypable) {
				if (!((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C' || key === 'v' || key === 'V'))) {
					// console.log('Key ignored:', key);
					return; // İzin verilmeyen tuş
				}
			}

			const { rowIndex, colIndex, originalCell } = this.focusedCellState ?? {};
			if (rowIndex == null || colIndex == null || originalCell == null) {
				return; // Odak yoksa (şimdilik) çık
			}

			// --- Anlık Eylemler ---
			// İlgili anlık eylemleri buraya ekleyin (kopyala, yapıştır, F2, yazma, boşlukla seçme)
			if (
				key === 'Escape' ||
				key === 'F2' ||
				((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C')) ||
				((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'V')) ||
				(!e.ctrlKey && !e.metaKey && isTypable && key !== ' ')
			) {
				if (key === 'Escape' && this.editingCell) {
					/* e.preventDefault();
					this.removeCellInput();
					const cellToFocus: Required<FocucedCell> = { rowIndex, colIndex, originalCell, tabIndex: 0 };
					this.throttledFocusLogic(cellToFocus, ''); */
				} else if (isTypable || key === 'F2') {
					/* if (this.editingCell || row_oi == null || col.oi == null || !this.visibleColumns[ci].editable) return;
					e.preventDefault();
					this.createCellInput(key, row_oi, col.oi, col.field); */
				}
				return; // Anlık eylemden sonra çık
			}

			// --- Gezinme Eylemleri ---
			if (!ticking && isNavigationKey) {
				e.preventDefault();
				ticking = true;

				let cellToFocus: Required<FocucedCell> = { rowIndex, colIndex, originalCell, tabIndex: 0 };
				const initialOriginalCell = cellToFocus.originalCell;

				const rowFirstIndex = 0;
				const rowLastIndex = this.srcData.length - 1;
				const colFirstIndex = this.srcRowSelection !== 'none' ? -1 : 0;
				const colLastIndex = this.srcRowAction ? this.visibleColumns.length : this.visibleColumns.length - 1;

				let forceUpdate = false;

				if (key === 'ArrowUp') {
					cellToFocus.rowIndex = Math.max(rowFirstIndex, cellToFocus.rowIndex - 1);
				} else if (key === 'ArrowDown' || key === 'Enter') {
					cellToFocus.rowIndex = Math.min(rowLastIndex, cellToFocus.rowIndex + 1);
				} else if (key === 'ArrowLeft' || (e.shiftKey && key === 'Tab')) {
					cellToFocus.colIndex = cellToFocus.colIndex - 1;
					if (key === 'Tab' && cellToFocus.colIndex < colFirstIndex) {
						cellToFocus.rowIndex = Math.max(rowFirstIndex, cellToFocus.rowIndex - 1);
						cellToFocus.colIndex = colLastIndex;
					} else {
						cellToFocus.colIndex = Math.max(colFirstIndex, cellToFocus.colIndex);
					}
				} else if (key === 'ArrowRight' || (!e.shiftKey && key === 'Tab')) {
					cellToFocus.colIndex = cellToFocus.colIndex + 1;
					if (key === 'Tab' && cellToFocus.colIndex > colLastIndex) {
						cellToFocus.rowIndex = Math.min(rowLastIndex, cellToFocus.rowIndex + 1);
						cellToFocus.colIndex = colFirstIndex;
					} else {
						cellToFocus.colIndex = Math.min(colLastIndex, cellToFocus.colIndex);
					}
				} else if (key === 'Home') {
					if (e.ctrlKey || e.metaKey) {
						cellToFocus.rowIndex = rowFirstIndex;
						cellToFocus.colIndex = colFirstIndex;
						forceUpdate = true;
					} else {
						cellToFocus.colIndex = colFirstIndex;
					}
				} else if (key === 'End') {
					if (e.ctrlKey || e.metaKey) {
						cellToFocus.rowIndex = rowLastIndex;
						cellToFocus.colIndex = colLastIndex;
						forceUpdate = true;
					} else {
						cellToFocus.colIndex = colLastIndex;
					}
				} else if (key === 'PageUp') {
					const visibleEnd = this.#rowIndices.visibleEnd;
					const visibleStart = this.#rowIndices.visibleStart;
					if (visibleEnd == null || visibleStart == null) return;

					const index = cellToFocus.rowIndex - (visibleEnd - visibleStart);
					cellToFocus.rowIndex = Math.max(rowFirstIndex, index);
					forceUpdate = true;
				} else if (key === 'PageDown') {
					const visibleEnd = this.#rowIndices.visibleEnd;
					const visibleStart = this.#rowIndices.visibleStart;
					if (visibleEnd == null || visibleStart == null) return;

					const index = cellToFocus.rowIndex + (visibleEnd - visibleStart);
					cellToFocus.rowIndex = Math.min(rowLastIndex, index);
					forceUpdate = true;
				}

				cellToFocus.originalCell = `${cellToFocus.rowIndex}_${cellToFocus.colIndex}`;

				if (cellToFocus.originalCell === initialOriginalCell) {
					ticking = false;
					return; // Odaklanmış hücre değişmedi, çık
				}

				this.#focusedCellState = cellToFocus;
				this.updateVisibleIndexes(forceUpdate);
				tick().then(() => {
					const nextFocusedCellNode = this.element?.querySelector<HTMLDivElement>('.slc-table-td-focused');
					if (nextFocusedCellNode != null) {
						nextFocusedCellNode.scrollIntoView({ block: 'nearest', inline: 'nearest' });
						nextFocusedCellNode.focus({ preventScroll: true });
					}
					ticking = false;
				});
			}
		};

		node.addEventListener('keydown', keydown);
		node.addEventListener('mousedown', mousedown);
		node.addEventListener('click', click);

		return {
			destroy() {
				node.removeEventListener('keydown', keydown);
				node.removeEventListener('mousedown', mousedown);
				node.removeEventListener('click', click);
			}
		};
	};
	// ################################## END Actions ######################################################################################################################################

	// ################################## BEGIN Utils #######################################################################################################################################
	debounce = <This, Args extends unknown[]>(func: (this: This, ...args: Args) => void, delay: number): ((this: This, ...args: Args) => void) & { cancel: () => void } => {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;
		const debounced = function (this: This, ...args: Args): void {
			const context = this;
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				timeoutId = null;
				func.apply(context, args);
			}, delay);
		};
		debounced.cancel = (): void => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = null;
		};
		return debounced;
	};
	// ################################## END Utils #############################################################################################################################################

	// ################################## BEGIN General Methods #################################################################################################################################
	readonly setColumnWidth = (ci: number, min: number, width: number) => {
		this.#src.columns[ci].width = `${Math.max(min, width)}px`;
	};
	readonly getFooter = ({ field, foot }: { field: Field<TData>; foot: Footer<TData> }): number | string => {
		const footer = foot[field]; // sum, avg, count or footer content
		if (footer == null) return '';

		return footer === 'count'
			? this.srcData.length
			: footer === 'avg'
				? this.srcData.reduce((acc, row) => {
						const value = row[field];
						return typeof value === 'number' ? acc + value : acc;
					}, 0) / this.srcData.length
				: footer === 'sum'
					? this.srcData.reduce((acc, row) => {
							const value = row[field];
							return typeof value === 'number' ? acc + value : acc;
						}, 0)
					: footer;
	};
	// Debounced handler (resize için daha iyi)
	#debouncedResizeHandler = this.debounce((height: number) => {
		this.cachedClientHeight = Math.round(height);
		this.updateVisibleIndexes();
	}, 100);
	// ################################## END General Methods ################################################################################################################################

	// ################################## BEGIN Attr ########################################################################################################################################
	attr_main = $derived({
		class: 'slc-table-main',
		style: `
			width: ${this.srcWidth};
			height: ${this.srcHeight};
		`
	});
	attr_container = {
		class: 'slc-table-container'
	};
	attr = $derived({
		role: 'grid',
		class: 'slc-table',
		style: `
			grid-template-rows: ${this.#gridTemplateRows};
			grid-template-columns: ${this.#gridTemplateColumns};
			scroll-padding-block-start: ${this.headerRowsCountState > 0 ? `${this.headerRowsCountState * this.srcTheadRowHeight}px` : 'unset'};
			scroll-padding-block-end: ${this.srcFooters.length > 0 ? `${this.srcFooters.length * this.srcTfootRowHeight}px` : 'unset'};
			scroll-padding-inline-start: ${this.focusedCellState?.colIndex === -1 || this.srcRowSelection === 'none' ? 'unset' : `${this.srcRowSelectionColumnWidth}px`};
			scroll-padding-inline-end: ${this.focusedCellState?.colIndex === this.visibleColumns.length || this.srcRowAction === false ? 'unset' : `${this.srcRowActionColumnWidth}px`};			
		`,
		'aria-colcount': this.visibleColumns.length,
		'aria-rowcount': this.srcData.length + this.srcFooters.length + this.headerRowsCountState
	});
	attr_trh = {
		role: 'row',
		class: 'slc-table-trh',
		style: `display: contents;`
	};
	attr_th = {
		role: 'columnheader',
		class: 'slc-table-th',
		style: `grid-row-start: 1;`
	};
	attr_th_selection = {
		role: 'columnheader',
		class: 'slc-table-th slc-table-th-selection',
		style: `grid-row-start: 1;`
	};
	attr_th_action = {
		role: 'columnheader',
		class: 'slc-table-th slc-table-th-action',
		style: `grid-row-start: 1;`
	};
	attr_trd = {
		role: 'row',
		class: 'slc-table-trd',
		style: `display: contents;`
	};
	attr_td = {
		/* role: 'gridcell', */
		class: 'slc-table-td'
	};
	attr_td_selection = {
		/* role: 'gridcell', */
		class: 'slc-table-td slc-table-td-selection'
	};
	attr_td_action = {
		/* role: 'gridcell', */
		class: 'slc-table-td slc-table-td-action'
	};
	attr_trf = {
		role: 'row',
		class: 'slc-table-trf',
		style: `display: contents;`
	};
	attr_tf = {
		role: 'gridcell',
		class: 'slc-table-tf'
	};
	attr_tf_selection = {
		role: 'gridcell',
		class: 'slc-table-tf slc-table-tf-selection'
	};
	attr_tf_action = {
		role: 'gridcell',
		class: 'slc-table-tf slc-table-tf-action'
	};
	// ################################## END Attr ###########################################################################################################################################
}

// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createTable<TData extends Row>(sources: Sources<TData>) {
	return setContext(sources.id, new Table<TData>(sources));
}
export function getTable<TData extends Row>(id: string) {
	return getContext<ReturnType<typeof createTable<TData>>>(id);
}
// ################################## END Export Table Context ################################################################################################################################

export type { Sources, Row, Column, Field };
