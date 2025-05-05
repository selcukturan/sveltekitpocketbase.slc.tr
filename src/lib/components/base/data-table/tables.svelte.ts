import type { Sources, RequiredSources, Row, FocucedCell, Column, Footer, Field, OnCellFocusChange, OnRowSelectionChange, OnTableAction, OnRowAction, OnActionParams } from './types';
import { getContext, setContext } from 'svelte';
import { tick, flushSync } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

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
			const currentHeaderCheckbox = this.headerCheckbox;
			const currentActionActiveRowIndex = this.#actionActiveRowIndex;

			if (currentActionActiveRowIndex != null) {
				window.addEventListener('click', this.handleWindowOutsideClick);
				window.addEventListener('mousedown', this.handleWindowOutsideMousedown);
				window.addEventListener('keydown', this.handleWindowEscPress);
				window.addEventListener('focusin', this.handleWindowFocusChange);
				return () => {
					window.removeEventListener('click', this.handleWindowOutsideClick);
					window.removeEventListener('mousedown', this.handleWindowOutsideMousedown);
					window.removeEventListener('keydown', this.handleWindowEscPress);
					window.removeEventListener('focusin', this.handleWindowFocusChange);
				};
			}

			if (currentHeaderCheckbox != null) {
				currentHeaderCheckbox.indeterminate = this.#headerIsIndeterminate === true;
				// return () => {};
			}

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

	// ################################## BEGIN Row Action Methods #####################################################################################################################
	#actionIsOutsideMouseDown = $state(false);
	#actionActiveContainerNode?: HTMLElement = $state();
	#actionActiveRowIndex?: number = $state();
	get actionActiveRowIndex() {
		return this.#actionActiveRowIndex;
	}

	private showActionPopup = (roi: number) => {
		if (this.#actionActiveRowIndex === roi) return;
		this.#actionActiveRowIndex = roi;
		flushSync(); // this.#actionActiveRowIndex değiştikten sonra $effect içindeki değişikliklerin hemen işlenmesi için flushSync kullanılır
	};
	private hideActionPopup = () => {
		if (this.#actionActiveRowIndex == null) return;
		this.#actionActiveRowIndex = undefined;
		flushSync(); // this.#actionActiveRowIndex değiştikten sonra $effect içindeki değişikliklerin hemen işlenmesi için flushSync kullanılır
		this.#actionActiveContainerNode = undefined;
		this.#actionIsOutsideMouseDown = false;
	};
	private toggleActionPopup = (roi: number) => (this.#actionActiveRowIndex === roi ? this.hideActionPopup() : this.showActionPopup(roi));

	readonly handleItemClick = (params: OnActionParams) => {
		this.hideActionPopup();
		this.actionTrigger(params);
		/* alert('Item clicked: ' + params.action); */
	};

	actionAction = (buttonNode: HTMLButtonElement, params: { roi: number; type: 'header' | 'footer' | 'data' }) => {
		const { roi, type } = params;
		const click = (e: Event) => {
			const target = e.currentTarget as HTMLElement;
			const parentContainer = target.parentElement;
			if (!parentContainer || !(parentContainer instanceof HTMLElement)) return;

			this.#actionActiveContainerNode = parentContainer;

			if (type === 'header' || type === 'data') {
				this.toggleActionPopup(roi);
			}
		};

		buttonNode.addEventListener('click', click);

		return {
			destroy() {
				buttonNode.removeEventListener('click', click);
			}
		};
	};

	// `window: Window` Event Listeners
	private handleWindowFocusChange = (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		if (this.#actionActiveRowIndex != null && !this.#actionActiveContainerNode?.contains(target)) {
			this.hideActionPopup();
		}
	};
	private handleWindowEscPress = (e: KeyboardEvent) => {
		if (this.#actionActiveRowIndex != null && e.code === 'Escape') {
			e.preventDefault();
			this.hideActionPopup();
		}
	};
	private handleWindowOutsideMousedown = (e: MouseEvent) => {
		if (this.#actionActiveRowIndex == null || this.#actionActiveContainerNode == null) return;
		const target = e.target as HTMLElement;
		this.#actionIsOutsideMouseDown = !this.#actionActiveContainerNode?.contains(target); // Tıklama container dışındaysa true olur
	};
	private handleWindowOutsideClick = (e: MouseEvent) => {
		if (this.#actionIsOutsideMouseDown && this.#actionActiveRowIndex != null && this.#actionActiveContainerNode != null) {
			this.hideActionPopup();
		}
	};
	// ################################## END Row Action Methods #####################################################################################################################

	// ################################## BEGIN Row Selection Methods #####################################################################################################################
	headerCheckbox: HTMLInputElement | null = $state(null);
	#headerIsIndeterminate = $state(false);
	get headerIsIndeterminate() {
		return this.#headerIsIndeterminate;
	}
	#headerIsChecked = $state(false);
	get headerIsChecked() {
		return this.#headerIsChecked;
	}
	#selectedRows = new SvelteSet<number>(); // Private state manager
	get selectedRows() {
		return this.#selectedRows;
	}
	private clearSelectedRows = () => {
		this.#selectedRows.clear();
	};

	readonly toggleRowSelection = async (rowIndex: number) => {
		if (this.srcRowSelection === 'none') return;

		if (this.srcRowSelection === 'single') {
			if (!this.#selectedRows.has(rowIndex)) {
				this.#selectedRows.clear();
				this.#selectedRows.add(rowIndex);
			} else {
				this.#selectedRows.clear();
			}
		} else if (this.srcRowSelection === 'multiple-all' || this.srcRowSelection === 'multiple') {
			// Çoklu seçim için toggle işlemi
			if (this.#selectedRows.has(rowIndex)) {
				this.#selectedRows.delete(rowIndex);
			} else {
				this.#selectedRows.add(rowIndex);
			}
		}

		this.#headerIsIndeterminate = this.#selectedRows.size > 0 && this.#selectedRows.size < this.srcData.length ? true : false;

		await tick();
		// this.onRowSelectionChangeThis({ selectedRows: this.selectedRows });
	};

	// OPTİMİZE EDİLMESİ GEREKEN KISIM
	readonly toggleAllRows = async (select: boolean) => {
		if (this.srcRowSelection !== 'multiple-all') return;

		this.#selectedRows.clear();
		if (select) {
			// Tüm indeksleri Set'e ekle
			for (let i = 0; i < this.srcData.length; i++) {
				// if (!this.#selectedRows.has(i)) {
				this.#selectedRows.add(i);
				// }
			}
		}

		this.#headerIsIndeterminate = false;
		this.#headerIsChecked = select;

		await tick();
		// this.onRowSelectionChangeThis({ selectedRows: this.selectedRows });
	};

	selectAction = (checkInput: HTMLInputElement, params: { roi?: number; type: 'header' | 'footer' | 'data' }) => {
		const { roi, type } = params;
		const change = (e: Event) => {
			// e.preventDefault();

			if (type === 'header') {
				const allSelected = this.#selectedRows.size === this.srcData.length;
				this.toggleAllRows(!allSelected);
			} else if (roi != null) {
				this.toggleRowSelection(roi);
			}
		};

		checkInput.addEventListener('change', change);

		return {
			destroy() {
				checkInput.removeEventListener('change', change);
			}
		};
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
	createCellInput = (key: string, rowIndex: number, colIndex: number, field: Field<TData>) => {
		const snapshotRow = $state.snapshot(this.srcData[rowIndex]) as TData;
		const oldValue = snapshotRow[field];
		const oldValueForInput = oldValue != null ? oldValue.toString() : '';
		this.editingCellOldValue = oldValueForInput;
		this.editingCellValue = key === 'F2' || key === 'SLCDBL' ? oldValueForInput : key;
		this.editingCell = true;
		this.editingCellPath = `r${rowIndex}c${colIndex}`;
	};
	setCellValue = (newValue: unknown, oldValue: unknown, rowIndex: number, colIndex: number, field: Field<TData>) => {
		if (newValue === oldValue) return;

		const snapshotRow = $state.snapshot(this.srcData[rowIndex]) as TData;

		if (this.#src.data && typeof snapshotRow[field] === typeof newValue) {
			snapshotRow[field] = newValue as TData[Field<TData>];
			this.#src.data[rowIndex] = snapshotRow;
		} else {
			console.error(`Type mismatch: Field ${field} expects ${typeof snapshotRow[field]}, but got ${typeof newValue}`);
		}
	};

	readonly inputOnAction = (input: HTMLInputElement, params: { roi: number; coi: number; col: Column<TData> }) => {
		const { roi, coi, col } = params;

		input.focus();
		// input.select();

		const blur = (e: FocusEvent) => {
			const newValue = this.editingCellValue;
			const oldValue = this.editingCellOldValue;

			this.removeCellInput();

			if (newValue === oldValue) return;

			this.setCellValue(newValue, oldValue, roi, coi, col.field);
			/*
			// onCellEdit
			if (onCellEdit && table.columns)
					thisOnCellEdit({
						event: 'celledit',
						detail: { newValue, oldValue, rowIndex: inputrow, colIndex: inputcol, field: inputfield, column: $state.snapshot(table.columns[+inputcol]), row: $state.snapshot(table.data[+inputrow]) as TDataType }
					});
			*/
		};
		/* const click = (e: MouseEvent) => {
			e.stopPropagation();
		};
		const mousedown = (e: MouseEvent) => {
			e.stopPropagation();
		}; */

		input.addEventListener('blur', blur);
		/* input.addEventListener('click', click);
		input.addEventListener('mousedown', mousedown); */

		return {
			destroy() {
				input.removeEventListener('blur', blur);
				/* input.removeEventListener('click', click);
				input.removeEventListener('mousedown', mousedown); */
			}
		};
	};
	// ################################## END Cell Edit ####################################################################################################################################

	// ################################## BEGIN Set Columns Width ##########################################################################################################################
	// #colResizeDragging = false;
	#colResizePointerDownClientX = 0;
	#colResizePointerDownWidth = 0;
	#colResizeIsAllWidth = false;

	readonly setColumnWidth = (coi: number, width: number) => {
		this.#src.columns[coi].width = `${Math.max(50, width)}px`;
	};

	readonly colResizeUpdate = (event: PointerEvent, coi: number) => {
		const width = this.#colResizePointerDownWidth + (event.clientX - this.#colResizePointerDownClientX);
		this.setColumnWidth(coi, width);

		if (!this.#colResizeIsAllWidth) {
			this.srcColumns.forEach((column, index) => {
				if (index !== coi && column?.width?.startsWith('minmax')) {
					const width = this.element?.querySelector(`div[role="columnheader"][data-coi="${index}"]`)?.getBoundingClientRect().width || 100;
					this.setColumnWidth(index, width);
				}
			});
			this.#colResizeIsAllWidth = true;
		}
	};

	readonly colResizePointerAction = (node: HTMLElement, callback: (event: PointerEvent) => void) => {
		const pointerdown = (event: PointerEvent) => {
			if ((event.pointerType === 'mouse' && event.button === 2) || (event.pointerType !== 'mouse' && !event.isPrimary)) return;

			const parentNode = node.parentNode;
			if (!parentNode || !(parentNode instanceof HTMLElement)) return;

			this.#colResizePointerDownClientX = event.clientX;
			this.#colResizePointerDownWidth = parentNode.getBoundingClientRect().width;

			node.setPointerCapture(event.pointerId);
			event.preventDefault();
			// this.#colResizeDragging = true;

			const onpointerup = () => {
				// this.#colResizeDragging = false;
				node.setPointerCapture(event.pointerId);
				window.removeEventListener('pointermove', callback, false);
				window.removeEventListener('pointerup', onpointerup, false);
			};

			window.addEventListener('pointermove', callback, false);
			window.addEventListener('pointerup', onpointerup, false);
		};

		node.addEventListener('pointerdown', pointerdown, { capture: true, passive: false });

		return {
			destroy() {
				node.removeEventListener('pointerdown', pointerdown);
			}
		};
	};
	// ################################## END Set Columns Width ##########################################################################################################################

	// ################################## BEGIN Actions ####################################################################################################################################
	tdFocusAction = (node: HTMLDivElement, params: { rowIndex: number; colIndex: number; field?: Field<TData> }) => {
		const mousedown = (e: Event) => {
			const cellToFocus: Required<FocucedCell> = {
				rowIndex: params.rowIndex,
				colIndex: params.colIndex,
				originalCell: `${params.rowIndex}_${params.colIndex}`,
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
			/* e.stopPropagation();
			e.preventDefault(); */
		};

		let ticking = false;
		const keydown = (e: KeyboardEvent) => {
			const { key } = e;
			const typableNumber = '1234567890';
			const typableLower = 'abcdefghijklmnopqrstuvwxyz';
			const typableUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			const typableOther = "=-`[\\]';,./ğüşıöçĞÜŞİÖÇ";

			const field = params.field;

			// --- İzin Verilmeyen Tuşları Filtrele ---
			const isNavigationKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Enter', 'Tab'].includes(key);
			const isActionKey = ['F2', ' ', 'c', 'C', 'v', 'V', 'Escape'].includes(key); // Boşluk, F2, Kopyala/Yapıştır, Escape
			const isTypable = typableNumber.includes(key) || typableLower.includes(key) || typableUpper.includes(key) || typableOther.includes(key);

			// İzin verilmeyen tuşlar veya anlık eylemler önce ele alınır
			if (!isNavigationKey && !isActionKey && !isTypable) {
				if (!((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C' || key === 'v' || key === 'V'))) {
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
				(key === ' ' && this.srcRowSelection !== 'none' && colIndex === -1) ||
				(key === ' ' && this.srcRowAction && colIndex === this.visibleColumns.length) ||
				((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C')) ||
				((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'V')) ||
				(!e.ctrlKey && !e.metaKey && isTypable && !this.editingCell)
			) {
				if (key === 'Escape' && this.editingCell) {
					e.preventDefault();
					this.removeCellInput();
					node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
					node.focus({ preventScroll: true });
				} else if (isTypable || key === 'F2') {
					if (this.editingCell || field == null || !this.visibleColumns[colIndex].data.editable) return;
					e.preventDefault();
					this.createCellInput(key, rowIndex, colIndex, field);
				} else if (key === ' ') {
					e.preventDefault();
					if (this.srcRowSelection !== 'none' && colIndex === -1) {
						this.toggleRowSelection(rowIndex);
					} else if (this.srcRowAction && colIndex === this.visibleColumns.length) {
						this.toggleActionPopup(rowIndex);
					} else {
						// this.createCellInput(key, rowIndex, colIndex, this.visibleColumns[colIndex].field);
					}
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
	attr_th_resize = {
		class: 'slc-table-th-resize',
		style: `position: absolute; touch-action: none !important; background-color: red; top: 0px; right: 0px; bottom: 0px; width: 8px; opacity: 0; cursor: col-resize;`
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

export type { Sources };
