import type {
	Sources,
	RequiredSources,
	Row,
	FocucedCell,
	Column,
	Footer,
	Field,
	OnCellFocusChange,
	OnRowSelectionChange,
	OnCellEdit,
	OnColumnResize,
	OnVirtualDataChange,
	OnTableAction,
	OnRowAction,
	OnActionParams
} from './types';
import { getContext, setContext } from 'svelte';
import { tick, flushSync } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import type { Attachment } from 'svelte/attachments';

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
		subtotal: false,
		rowAction: true,
		rowActionColumnWidth: 50,
		zebra: false,
		hoverableRows: false,
		theadRowHeight: 40,
		tbodyRowHeight: 35,
		tfootRowHeight: 35,
		columns: [],
		footers: []
	};
	// ################################## END Default Sources #######################################################################################################################

	// ################################## BEGIN Constructor #########################################################################################################################
	version = 'v0.0.1-alpha.152';
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

			if (currentElement && this.#resizeObserver == null) {
				this.#resizeObserver = new ResizeObserver((entries) => {
					const entry = entries[0];
					if (entry?.contentRect.height > 0) {
						this.debouncedResizeHandler(entry.contentRect.height);
					}
				});
				this.#resizeObserver.observe(currentElement);
			}

			if (currentActionActiveRowIndex != null) {
				window.addEventListener('click', this.handleWindowOutsideClick);
				window.addEventListener('mousedown', this.handleWindowOutsideMousedown);

				return () => {
					window.removeEventListener('click', this.handleWindowOutsideClick);
					window.removeEventListener(
						'mousedown',
						this.handleWindowOutsideMousedown
					);
				};
			}

			if (currentHeaderCheckbox != null) {
				currentHeaderCheckbox.indeterminate =
					this.#headerIsIndeterminate === true;
				return () => {};
			}

			return () => {
				this.#resizeObserver?.disconnect();
				this.#resizeObserver = null;
			};
		});
	}
	// ################################## END Constructor ##########################################################################################################################

	// ################################## BEGIN Source Setter Method for Global Use. `table.setSource('width','100px')` or `this.setSource('width','100px')` #######################
	readonly setSource = <K extends keyof RequiredSources<TData>>(
		key: K,
		value: RequiredSources<TData>[K]
	) => {
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
	readonly srcRowSelection = $derived(
		this.#src.rowSelection || this.#defSrc.rowSelection
	);
	readonly srcRowSelectionColumnWidth = $derived(
		this.#src.rowSelectionColumnWidth || this.#defSrc.rowSelectionColumnWidth
	);
	readonly srcSubtotal = $derived(this.#src.subtotal || this.#defSrc.subtotal);
	readonly srcActions = $derived(this.#src.actions || this.#defSrc.actions);
	readonly srcRowAction = $derived(
		this.#src.rowAction ?? this.#defSrc.rowAction
	);
	readonly srcRowActionColumnWidth = $derived(
		this.#src.rowActionColumnWidth || this.#defSrc.rowActionColumnWidth
	);
	readonly srcZebra = $derived(this.#src.zebra || this.#defSrc.zebra);
	readonly srcHoverableRows = $derived(
		this.#src.hoverableRows || this.#defSrc.hoverableRows
	);
	readonly srcTheadRowHeight = $derived(
		this.#src.theadRowHeight || this.#defSrc.theadRowHeight
	);
	readonly srcTbodyRowHeight = $derived(
		this.#src.tbodyRowHeight || this.#defSrc.tbodyRowHeight
	);
	readonly srcTfootRowHeight = $derived(
		this.#src.tfootRowHeight || this.#defSrc.tfootRowHeight
	);
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
		const repeatThead =
			this.headerRowsCountState >= 1
				? `repeat(${this.headerRowsCountState}, ${this.srcTheadRowHeight}px)`
				: ``;
		const repeatTbody =
			this.srcData.length > 0
				? `repeat(${this.srcData.length}, ${this.srcTbodyRowHeight}px)`
				: ``;
		const repeatTfoot =
			this.srcFooters.length > 0
				? `repeat(${this.srcFooters.length}, ${this.srcTfootRowHeight}px)`
				: ``;
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
	readonly onCellFocusChange = (fn: OnCellFocusChange): void => {
		this.onCellFocusChangeRun = fn;
	};
	private onCellFocusChangeRun?: OnCellFocusChange;
	// ***** onRowSelectionChange Event *****
	readonly onRowSelectionChange = (fn: OnRowSelectionChange): void => {
		this.onRowSelectionChangeRun = fn;
	};
	private onRowSelectionChangeRun?: OnRowSelectionChange;
	// ***** onCellEdit Event *****
	readonly onCellEdit = (fn: OnCellEdit): void => {
		this.onCellEditRun = fn;
	};
	private onCellEditRun?: OnCellEdit;
	// ***** onColumnResize Event *****
	readonly onColumnResize = (fn: OnColumnResize): void => {
		this.onColumnResizeRun = fn;
	};
	private onColumnResizeRun?: OnColumnResize;
	// ***** onVirtualDataChange Event *****
	readonly onVirtualDataChange = (fn: OnVirtualDataChange): void => {
		this.onVirtualDataChangeRun = fn;
	};
	private onVirtualDataChangeRun?: OnVirtualDataChange;
	// ***** onRowAction Event *****
	readonly onRowAction = (fn: OnRowAction): void => {
		this.onRowActionRun = fn;
	};
	private onRowActionRun?: OnRowAction;
	// ***** onTableAction Event *****
	readonly onTableAction = (fn: OnTableAction): void => {
		this.onTableActionRun = fn;
	};
	private onTableActionRun?: OnTableAction;
	// ################################## END Events #######################################################################################################################################

	readonly actionTrigger = (params: OnActionParams) => {
		if (params.type === 'data') {
			this.onRowActionRun?.(params);
		} else if (params.type === 'header') {
			this.onTableActionRun?.(params);
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

	private updateVisibleIndexes = (force: boolean = false) => {
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
		const focusedChanged =
			focusedCellRowIndex !== currentIndices.focusedCellRowIndex;

		// 4. Erken Çıkış Kontrolü
		if (
			currentIndices.scrollTop === scrollTop &&
			currentIndices.clientHeight === clientHeight &&
			!force &&
			!focusedChanged
		) {
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
			if (
				this.#rowIndices.visibleStart !== undefined ||
				this.#rowIndices.overscanStart !== undefined
			) {
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
		const currentContentHeight = Math.max(
			0,
			clientHeight - headerRowsHeight - footerRowsHeight
		); // Negatif olmamasını sağla
		const visibleStartIndex = Math.max(
			0,
			Math.floor(scrollTop / dataRowHeight)
		);
		const visibleEndIndex = Math.min(
			dataLength - 1,
			Math.floor((scrollTop + currentContentHeight) / dataRowHeight)
		);
		const overscanStartIndex = Math.max(
			0,
			visibleStartIndex - overscanThreshold
		);
		const overscanEndIndex = Math.min(
			dataLength - 1,
			visibleEndIndex + overscanThreshold
		);

		// 8. Mevcut Overscan Indexler Değişti mi?
		const indicesChanged =
			overscanStartIndex !== currentIndices.overscanStart ||
			overscanEndIndex !== currentIndices.overscanEnd;

		// 9. Mevcut Odaklanmış Satır, Yeni Index Aralığında mı?
		const isFocusedRowAlreadyIncluded =
			currentIndices.focusedCellRowIndex &&
			currentIndices.focusedCellRowIndex >= overscanStartIndex &&
			currentIndices.focusedCellRowIndex <= overscanEndIndex;

		// 10. State'i Güncelle: Indexler Değiştiyse VEYA Güncelleme Zorlandıysa VEYA Odaklanmış Satır Değiştiyse ve Yeni Aralıkta Değilse
		if (
			indicesChanged ||
			force ||
			(focusedChanged && !isFocusedRowAlreadyIncluded)
		) {
			this.#rowIndices = {
				visibleStart: visibleStartIndex,
				visibleEnd: visibleEndIndex,
				overscanStart: overscanStartIndex,
				overscanEnd: overscanEndIndex,
				scrollTop: scrollTop,
				clientHeight: clientHeight,
				focusedCellRowIndex: focusedCellRowIndex
			};

			this.onVirtualDataChangeRun?.(this.#rowIndices);
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
		if (
			startIndex == null ||
			endIndex == null ||
			dataLength === 0 ||
			startIndex > endIndex
		)
			return [];

		const processedData: Array<{ data: TData; roi: number }> = [];

		for (let i = startIndex; i <= endIndex; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row, roi: i });
			}
		}

		if (focusedCellRowIndex != null && focusedCellRowIndex < dataLength) {
			// Odaklanmış satır zaten işlenen aralıkta mı?
			const isFocusedRowAlreadyIncluded =
				focusedCellRowIndex >= startIndex && focusedCellRowIndex <= endIndex;
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

	readonly virtualScrollAttach = (): Attachment => {
		// Tablo DOM'a monte edildi
		let ticking = false;

		return (tableNode) => {
			// Tablo virtual scroll kurulumu
			this.cachedClientHeight = Math.round(tableNode.clientHeight);
			this.cachedScrollTop = Math.round(tableNode.scrollTop);

			const scroll = () => {
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

			// mouse ile sürükleyerek scroll yapıldığında veya scrollbara bir şekilde tıklandığında, hücre focus'unun kaybolmaması için. Bu tablonun focus olmasını engeller.
			const mousedown = (e: Event) => {
				e.preventDefault();
			};

			tableNode.addEventListener('scroll', scroll, { passive: true });
			tableNode.addEventListener('mousedown', mousedown);

			return () => {
				// Tablo DOM'dan kaldırıldı
				tableNode.removeEventListener('scroll', scroll);
				tableNode.removeEventListener('mousedown', mousedown);
			};
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
		// flushSync(); // this.#actionActiveRowIndex değiştikten sonra $effect içindeki değişikliklerin hemen işlenmesi için flushSync kullanılır
	};
	private hideActionPopup = () => {
		if (this.#actionActiveRowIndex == null) return;
		this.#actionActiveRowIndex = undefined;
		this.element
			?.querySelector<HTMLDivElement>('.slc-table-td-focused')
			?.focus();
		// flushSync(); // this.#actionActiveRowIndex değiştikten sonra $effect içindeki değişikliklerin hemen işlenmesi için flushSync kullanılır
		this.#actionActiveContainerNode = undefined;
		this.#actionIsOutsideMouseDown = false;
	};
	private toggleActionPopup = (roi: number) =>
		this.#actionActiveRowIndex === roi
			? this.hideActionPopup()
			: this.showActionPopup(roi);

	readonly actionSelect = (params: OnActionParams) => {
		this.hideActionPopup();
		this.actionTrigger(params);
	};

	readonly actionAttach = (params: {
		roi: number;
		type: 'header' | 'footer' | 'data';
	}): Attachment => {
		// düğüm DOM'a monte edilmiştir
		const { roi, type } = params;

		return (buttonNode) => {
			if (!(buttonNode instanceof HTMLButtonElement)) return;
			// kurulum buraya gidiyor
			const click = (e: Event) => {
				// e.preventDefault();
				e.stopPropagation();
				const target = e.currentTarget as HTMLElement;
				const parentContainer = target.parentElement;
				if (!parentContainer || !(parentContainer instanceof HTMLElement))
					return;

				this.#actionActiveContainerNode = parentContainer;

				if (type === 'header' || type === 'data') {
					this.toggleActionPopup(roi);
				}
			};

			buttonNode.addEventListener('click', click);

			return () => {
				buttonNode.removeEventListener('click', click);
			};
		};
	};

	readonly actionPopupAttach = (params: {
		roi: number;
		type: 'header' | 'footer' | 'data';
	}): Attachment => {
		// düğüm DOM'a monte edilmiştir
		const { roi, type } = params;

		return (node) => {
			if (!(node instanceof HTMLDivElement)) return;

			node.focus({ preventScroll: true });

			let nextIndex = 0;

			const itemClassName =
				type === 'header'
					? 'slc-table-th-action-popup'
					: 'slc-table-td-action-popup';

			const selectedItem = this.element?.querySelector<HTMLElement>(
				`.${itemClassName}-item[data-index="${nextIndex}"]`
			);
			let action = selectedItem?.dataset.action;

			const length =
				type === 'data' && this.srcActions.rowActions
					? this.srcActions.rowActions.length
					: type === 'header' && this.srcActions.tableActions
						? this.srcActions.tableActions.length
						: 0;

			this.element
				?.querySelector<HTMLElement>(
					`.${itemClassName}-item[data-index="${nextIndex}"]`
				)
				?.classList.add(`${itemClassName}-item-nav`);

			const keydown = (e: KeyboardEvent) => {
				e.preventDefault();
				e.stopPropagation();

				// 2. Navigasyon ve Seçim Mantığı
				switch (e.code) {
					case 'ArrowUp':
					case 'ArrowDown':
					case 'Home':
					case 'End': {
						if (e.code === 'ArrowUp') {
							nextIndex = (nextIndex - 1 + length) % length;
						} else if (e.code === 'ArrowDown') {
							nextIndex = (nextIndex + 1) % length;
						} else if (e.code === 'Home') {
							nextIndex = 0;
						} else if (e.code === 'End') {
							nextIndex = length - 1;
						}

						if (nextIndex >= 0 && nextIndex < length) {
							this.element
								?.querySelectorAll<HTMLElement>(`.${itemClassName}-item`)
								.forEach((item) =>
									item.classList.remove(`${itemClassName}-item-nav`)
								);

							const selectedItem = this.element?.querySelector<HTMLElement>(
								`.${itemClassName}-item[data-index="${nextIndex}"]`
							);
							action = selectedItem?.dataset.action;
							selectedItem?.classList.add(`${itemClassName}-item-nav`);
						}
						break;
					}

					case 'Enter':
					case 'Space': {
						if (action == null) return;

						this.actionSelect({
							type,
							rowIndex: roi,
							action
						});

						break;
					}

					case 'Tab':
					case 'Escape': {
						this.toggleActionPopup(roi);
						break;
					}

					// Diğer tuşlar için bir şey yapma
					default:
						return;
				}
			};

			node.addEventListener('keydown', keydown);

			return () => {
				node.removeEventListener('keydown', keydown);
			};
		};
	};

	readonly actionPopupItemAttach = (params: OnActionParams): Attachment => {
		return (buttonNode) => {
			if (!(buttonNode instanceof HTMLButtonElement)) return;
			const click = () => {
				this.actionSelect({ ...params });
			};

			buttonNode.addEventListener('click', click);

			return () => {
				buttonNode.removeEventListener('click', click);
			};
		};
	};

	// `window: Window` Event Listeners
	private handleWindowOutsideMousedown = (e: MouseEvent) => {
		if (
			this.#actionActiveRowIndex == null ||
			this.#actionActiveContainerNode == null
		) {
			return;
		}

		const target = e.target as HTMLElement;
		this.#actionIsOutsideMouseDown =
			!this.#actionActiveContainerNode?.contains(target); // Tıklama container dışındaysa true olur
	};
	private handleWindowOutsideClick = (e: MouseEvent) => {
		if (
			this.#actionIsOutsideMouseDown &&
			this.#actionActiveRowIndex != null &&
			this.#actionActiveContainerNode != null
		) {
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

	private toggleRowSelection = async (rowIndex: number) => {
		if (this.srcRowSelection === 'none') return;

		if (this.srcRowSelection === 'single') {
			if (!this.#selectedRows.has(rowIndex)) {
				this.clearSelectedRows();
				this.#selectedRows.add(rowIndex);
			} else {
				this.clearSelectedRows();
			}
		} else if (
			this.srcRowSelection === 'multiple-all' ||
			this.srcRowSelection === 'multiple'
		) {
			// Çoklu seçim için toggle işlemi
			if (this.#selectedRows.has(rowIndex)) {
				this.#selectedRows.delete(rowIndex);
			} else {
				this.#selectedRows.add(rowIndex);
			}
		}

		this.#headerIsIndeterminate =
			this.#selectedRows.size > 0 &&
			this.#selectedRows.size < this.countableRowsLength()
				? true
				: false;

		await tick();
		this.onRowSelectionChangeRun?.({
			selectedRows: Array.from(this.#selectedRows)
		});
	};

	// UYARI: `cancelEditable` kullanılarak eklenen `subtotal`leri de ekler.
	private toggleAllRows = async (select: boolean) => {
		if (this.srcRowSelection !== 'multiple-all') return;

		this.clearSelectedRows();
		if (select) {
			// Tüm indeksleri Set'e ekle
			this.srcData.forEach((row, index) => {
				if (
					typeof row.subtotal !== 'string' ||
					!row.subtotal.startsWith('subtotal')
				) {
					this.#selectedRows.add(index);
				}
			});
		}

		this.#headerIsIndeterminate = false;
		this.#headerIsChecked = select;

		await tick();
		this.onRowSelectionChangeRun?.({
			selectedRows: Array.from(this.#selectedRows)
		});
	};

	readonly selectAttach = (params: {
		roi?: number;
		type: 'header' | 'footer' | 'data';
	}): Attachment => {
		// düğüm DOM'a monte edilmiştir
		const { roi, type } = params;
		return (checkInput) => {
			if (!(checkInput instanceof HTMLInputElement)) return;
			// kurulum buraya gidiyor
			const change = (e: Event) => {
				// e.preventDefault();

				if (type === 'header') {
					const allSelected =
						this.#selectedRows.size === this.countableRowsLength();
					this.toggleAllRows(!allSelected);
				} else if (roi != null) {
					this.toggleRowSelection(roi);
				}
			};

			checkInput.addEventListener('change', change);
			return () => {
				// söküm buraya gidiyor
				checkInput.removeEventListener('change', change);
			};
		};
	};
	// Eğer veritabanından gelen `subtotal`'ler varsa, bu metot `subtotal` kolonundaki `subtotal` ile başlayan içeriği tespit eder ve multiselect seçimini optimize eder.
	// Bu şekilde subtotal kullanırken, grid başlangıç ayarlarında `subtotal: true` olarak ayarlanmalı.
	// Subtotal kullanılmadığında multiselect performansını arttırır.
	private countableRowsLength = () => {
		if (this.srcSubtotal === true) {
			return this.srcData.filter((row) => {
				if (row && typeof row.subtotal === 'string') {
					return !row.subtotal.startsWith('subtotal');
				}
				return true; // subtotal yoksa veya string değilse, sayıma dahil et
			}).length;
		} else {
			return this.srcData.length;
		}
	};
	// ################################## END Row Selection Methods ########################################################################################################################

	// ################################## BEGIN Cell Edit ##################################################################################################################################
	/**
	 * edit input var mı?
	 */
	#editingCell: boolean = $state(false);
	editingCellInput: HTMLInputElement | undefined = $state(undefined);
	editingCellValue: unknown = $state('');
	#editingCellOldValue: unknown = $state('');
	#editingCellPath: string = $state('');
	get editingCellPath() {
		return this.#editingCellPath;
	}
	private removeCellInput = () => {
		if (this.#editingCell) {
			this.#editingCell = false;
			this.editingCellInput = undefined;
			this.editingCellValue = '';
			this.#editingCellOldValue = '';
			this.#editingCellPath = '';
		}
	};
	private createCellInput = (
		key: string,
		rowIndex: number,
		colIndex: number,
		field: Field<TData>
	) => {
		const oldValue = this.srcData[rowIndex][field] as TData[Field<TData>];
		const oldValueForInput = oldValue != null ? oldValue.toString() : '';
		this.#editingCellOldValue = oldValueForInput;
		this.editingCellValue = key === 'F2' ? oldValueForInput : key;
		this.#editingCell = true;
		this.#editingCellPath = `r${rowIndex}c${colIndex}`;
	};
	private setCellValue = (
		newValue: unknown,
		oldValue: unknown,
		rowIndex: number,
		colIndex: number,
		field: Field<TData>
	) => {
		if (newValue === oldValue) return;

		if (
			this.#src.data &&
			typeof this.#src.data[rowIndex][field] === typeof newValue
		) {
			this.#src.data[rowIndex][field] = newValue as TData[Field<TData>];
			this.onCellEditRun?.({ newValue, oldValue, rowIndex, colIndex, field });
		} else {
			console.error(
				`Type mismatch: Field ${field} expects ${typeof this.#src.data?.[rowIndex][field]}, but got ${typeof newValue}`
			);
		}
	};
	readonly editInputAttach = (params: {
		roi: number;
		coi: number;
		col: Column<TData>;
	}): Attachment => {
		// düğüm DOM'a monte edilmiştir
		const { roi, coi, col } = params;
		return (input) => {
			if (!(input instanceof HTMLInputElement)) return;
			// kurulum buraya gidiyor
			input.focus();
			// input.select();

			const blur = (e: FocusEvent) => {
				const newValue = this.editingCellValue;
				const oldValue = this.#editingCellOldValue;

				tick().then(() => {
					this.removeCellInput();
				});

				if (newValue === oldValue) return;

				this.setCellValue(newValue, oldValue, roi, coi, col.field);
			};
			const click = (e: MouseEvent) => {
				e.stopPropagation();
			};
			const dblclick = (e: MouseEvent) => {
				e.stopPropagation();
			};
			const mousedown = (e: MouseEvent) => {
				e.stopPropagation();
			};

			input.addEventListener('blur', blur);
			input.addEventListener('click', click);
			input.addEventListener('dblclick', dblclick);
			input.addEventListener('mousedown', mousedown);
			return () => {
				// söküm buraya gidiyor
				input.removeEventListener('blur', blur);
				input.removeEventListener('click', click);
				input.removeEventListener('dblclick', dblclick);
				input.removeEventListener('mousedown', mousedown);
			};
		};
	};
	// ################################## END Cell Edit ####################################################################################################################################

	// ################################## BEGIN Set Columns Width ##########################################################################################################################
	// #colResizeDragging = false;
	#colResizePointerDownClientX = 0;
	#colResizePointerDownWidth = 0;
	#colResizeIsAllWidth = false;

	private setColumnWidth = (
		colIndex: number,
		width: number,
		field: Field<TData>
	) => {
		const minWidth = 50;
		if (width > minWidth) {
			this.#src.columns[colIndex].width = `${Math.max(minWidth, width)}px`;
			this.onColumnResizeRun?.({ colIndex, width, field });
		}
	};

	readonly colResizeUpdate = (
		event: PointerEvent,
		coi: number,
		field: Field<TData>
	) => {
		const width =
			this.#colResizePointerDownWidth +
			(event.clientX - this.#colResizePointerDownClientX);
		this.setColumnWidth(coi, width, field);

		if (!this.#colResizeIsAllWidth) {
			this.srcColumns.forEach((column, index) => {
				if (index !== coi && column?.width?.startsWith('minmax')) {
					const width =
						this.element
							?.querySelector(`div[role="columnheader"][data-coi="${index}"]`)
							?.getBoundingClientRect().width || 100;
					this.setColumnWidth(index, width, field);
				}
			});
			this.#colResizeIsAllWidth = true;
		}
	};

	readonly colResizePointerAttach = (
		callback: (event: PointerEvent) => void
	): Attachment => {
		// düğüm DOM'a monte edilmiştir
		return (node) => {
			if (!(node instanceof HTMLElement)) return;
			// kurulum buraya gidiyor
			const pointerdown = (event: PointerEvent) => {
				if (
					(event.pointerType === 'mouse' && event.button === 2) ||
					(event.pointerType !== 'mouse' && !event.isPrimary)
				)
					return;

				const parentNode = node.parentNode;
				if (!parentNode || !(parentNode instanceof HTMLElement)) return;

				this.#colResizePointerDownClientX = event.clientX;
				this.#colResizePointerDownWidth =
					parentNode.getBoundingClientRect().width;

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

			node.addEventListener('pointerdown', pointerdown, {
				capture: true,
				passive: false
			});

			return () => {
				// söküm buraya gidiyor
				node.removeEventListener('pointerdown', pointerdown);
			};
		};
	};
	// ################################## END Set Columns Width ##########################################################################################################################

	// ################################## BEGIN Actions ####################################################################################################################################
	readonly tdFocusAttach = (params: {
		rowIndex: number;
		colIndex: number;
		field?: Field<TData>;
		cancelEditable?: boolean;
	}): Attachment => {
		// düğüm DOM'a monte edilmiştir
		return (node) => {
			if (!(node instanceof HTMLDivElement)) return;

			const mousedown = (e: Event) => {
				const cellToFocus: Required<FocucedCell> = {
					rowIndex: params.rowIndex,
					colIndex: params.colIndex,
					originalCell: `${params.rowIndex}_${params.colIndex}`,
					tabIndex: 0
				};

				if (cellToFocus.originalCell === this.focusedCellState?.originalCell)
					return;

				this.#focusedCellState = cellToFocus;
				this.updateVisibleIndexes();
				tick().then(() => {
					node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
					node.focus({ preventScroll: true });
					this.onCellFocusChangeRun?.({
						rowIndex: cellToFocus.rowIndex,
						colIndex: cellToFocus.colIndex
					});
				});
			};

			const dblclick = (e: MouseEvent) => {
				// e.stopPropagation();
				// e.preventDefault();

				const { rowIndex, colIndex, originalCell } =
					this.focusedCellState ?? {};
				if (rowIndex == null || colIndex == null || originalCell == null)
					return;

				const column = this.visibleColumns[colIndex];
				if (this.#editingCell || !column || !column.data.editable) return;

				const cancelEditable = params.cancelEditable ?? false;
				const field = params.field;
				if (cancelEditable || field == null) return;

				const key = 'F2'; // F2 tuşu ile düzenleme başlatılacak

				this.createCellInput(key, rowIndex, colIndex, field);
			};

			const click = (e: MouseEvent) => {
				// e.stopPropagation();
				// e.preventDefault();
			};

			let ticking = false;
			const keydown = (e: KeyboardEvent) => {
				const { key } = e;
				const typableNumber = '1234567890';
				const typableLower = 'abcdefghijklmnopqrstuvwxyz';
				const typableUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				const typableOther = "=-`[\\]';,./ğüşıöçĞÜŞİÖÇ";

				// --- İzin Verilmeyen Tuşları Filtrele ---
				const isNavigationKey = [
					'ArrowUp',
					'ArrowDown',
					'ArrowLeft',
					'ArrowRight',
					'Home',
					'End',
					'PageUp',
					'PageDown',
					'Enter',
					'Tab'
				].includes(key);
				const isActionKey = ['F2', ' ', 'c', 'C', 'v', 'V', 'Escape'].includes(
					key
				); // Boşluk, F2, Kopyala/Yapıştır, Escape
				const isTypable =
					typableNumber.includes(key) ||
					typableLower.includes(key) ||
					typableUpper.includes(key) ||
					typableOther.includes(key);

				// İzin verilmeyen tuşlar veya anlık eylemler önce ele alınır
				if (!isNavigationKey && !isActionKey && !isTypable) {
					if (
						!(
							(e.ctrlKey || e.metaKey) &&
							(key === 'c' || key === 'C' || key === 'v' || key === 'V')
						)
					) {
						return; // İzin verilmeyen tuş
					}
				}

				const { rowIndex, colIndex, originalCell } =
					this.focusedCellState ?? {};
				if (rowIndex == null || colIndex == null || originalCell == null) {
					return; // Odak yoksa (şimdilik) çık
				}

				const field = params.field;
				const cancelEditable = params.cancelEditable ?? false;

				// --- Anlık Eylemler ---
				// İlgili anlık eylemleri buraya ekleyin (kopyala, yapıştır, F2, yazma, boşlukla seçme)
				if (
					(key === 'Escape' && !cancelEditable) ||
					(key === 'F2' && !cancelEditable) ||
					key === ' ' ||
					((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C')) ||
					((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'V')) ||
					(!e.ctrlKey &&
						!e.metaKey &&
						isTypable &&
						!this.#editingCell &&
						!cancelEditable)
				) {
					if (key === 'Escape' && this.#editingCell) {
						e.preventDefault();
						this.removeCellInput();
						node.scrollIntoView({ block: 'nearest', inline: 'nearest' });
						node.focus({ preventScroll: true });
						this.onCellFocusChangeRun?.({ rowIndex, colIndex });
					} else if (isTypable || key === 'F2') {
						if (
							this.#editingCell ||
							field == null ||
							!this.visibleColumns[colIndex].data.editable
						)
							return;
						e.preventDefault();
						this.createCellInput(key, rowIndex, colIndex, field);
					} else if (key === ' ') {
						// hücre düzenleniyorsa boşluk engellenmesin
						if (!this.#editingCell) {
							e.preventDefault();
						}
						if (
							this.srcRowSelection !== 'none' &&
							colIndex === -1 &&
							!cancelEditable
						) {
							this.toggleRowSelection(rowIndex);
						} else if (
							this.srcRowAction &&
							colIndex === this.visibleColumns.length &&
							!cancelEditable
						) {
							this.toggleActionPopup(rowIndex);
						} else {
							// this.createCellInput(key, rowIndex, colIndex, this.visibleColumns[colIndex].field);
						}
					}
					return; // Anlık eylemden sonra çık
				}

				// --- Gezinme Eylemleri ---
				if (!ticking && isNavigationKey) {
					// e.preventDefault();
					ticking = true;

					let cellToFocus: Required<FocucedCell> = {
						rowIndex,
						colIndex,
						originalCell,
						tabIndex: 0
					};
					const initialOriginalCell = cellToFocus.originalCell;

					const rowFirstIndex = 0;
					const rowLastIndex = this.srcData.length - 1;
					const colFirstIndex = this.srcRowSelection !== 'none' ? -1 : 0;
					const colLastIndex = this.srcRowAction
						? this.visibleColumns.length
						: this.visibleColumns.length - 1;

					let forceUpdate = false;

					if (key === 'ArrowUp') {
						e.preventDefault();
						cellToFocus.rowIndex = Math.max(
							rowFirstIndex,
							cellToFocus.rowIndex - 1
						);
					} else if (key === 'ArrowDown' || key === 'Enter') {
						e.preventDefault();
						cellToFocus.rowIndex = Math.min(
							rowLastIndex,
							cellToFocus.rowIndex + 1
						);
					} else if (key === 'ArrowLeft') {
						if (!this.#editingCell) {
							e.preventDefault();
							cellToFocus.colIndex = cellToFocus.colIndex - 1;
							cellToFocus.colIndex = Math.max(
								colFirstIndex,
								cellToFocus.colIndex
							); // LEFT
						}
					} else if (e.shiftKey && key === 'Tab') {
						e.preventDefault();
						cellToFocus.colIndex = cellToFocus.colIndex - 1;
						if (cellToFocus.colIndex < colFirstIndex) {
							cellToFocus.rowIndex = Math.max(
								rowFirstIndex,
								cellToFocus.rowIndex - 1
							);
							cellToFocus.colIndex = colLastIndex;
						} else {
							cellToFocus.colIndex = Math.max(
								colFirstIndex,
								cellToFocus.colIndex
							); // LEFT
						}
					} else if (key === 'ArrowRight') {
						if (!this.#editingCell) {
							e.preventDefault();
							cellToFocus.colIndex = cellToFocus.colIndex + 1;
							cellToFocus.colIndex = Math.min(
								colLastIndex,
								cellToFocus.colIndex
							); // RIGHT
						}
					} else if (!e.shiftKey && key === 'Tab') {
						e.preventDefault();
						cellToFocus.colIndex = cellToFocus.colIndex + 1;
						if (cellToFocus.colIndex > colLastIndex) {
							cellToFocus.rowIndex = Math.min(
								rowLastIndex,
								cellToFocus.rowIndex + 1
							);
							cellToFocus.colIndex = colFirstIndex;
						} else {
							cellToFocus.colIndex = Math.min(
								colLastIndex,
								cellToFocus.colIndex
							); // RIGHT
						}
					} else if (key === 'Home') {
						if (!this.#editingCell) {
							e.preventDefault();
							if (e.ctrlKey || e.metaKey) {
								cellToFocus.rowIndex = rowFirstIndex;
								cellToFocus.colIndex = colFirstIndex;
								forceUpdate = true;
							} else {
								cellToFocus.colIndex = colFirstIndex;
							}
						}
					} else if (key === 'End') {
						if (!this.#editingCell) {
							e.preventDefault();
							if (e.ctrlKey || e.metaKey) {
								cellToFocus.rowIndex = rowLastIndex;
								cellToFocus.colIndex = colLastIndex;
								forceUpdate = true;
							} else {
								cellToFocus.colIndex = colLastIndex;
							}
						}
					} else if (key === 'PageUp') {
						e.preventDefault();
						const visibleEnd = this.#rowIndices.visibleEnd;
						const visibleStart = this.#rowIndices.visibleStart;
						if (visibleEnd == null || visibleStart == null) return;

						const index = cellToFocus.rowIndex - (visibleEnd - visibleStart);
						cellToFocus.rowIndex = Math.max(rowFirstIndex, index);
						forceUpdate = true;
					} else if (key === 'PageDown') {
						e.preventDefault();
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
						const nextFocusedCellNode =
							this.element?.querySelector<HTMLDivElement>(
								'.slc-table-td-focused'
							);
						if (nextFocusedCellNode != null) {
							nextFocusedCellNode.scrollIntoView({
								block: 'nearest',
								inline: 'nearest'
							});
							nextFocusedCellNode.focus({ preventScroll: true });
							this.onCellFocusChangeRun?.({
								rowIndex: cellToFocus.rowIndex,
								colIndex: cellToFocus.colIndex
							});
						}
						ticking = false;
					});
				}
			};

			node.addEventListener('keydown', keydown);
			node.addEventListener('mousedown', mousedown);
			node.addEventListener('dblclick', dblclick);
			node.addEventListener('click', click);

			return () => {
				/* if (
					params.cancelEditable &&
					this.cancelEditableIndex.has(params.rowIndex)
				) {
					this.cancelEditableIndex.delete(params.rowIndex);
				} */

				node.removeEventListener('keydown', keydown);
				node.removeEventListener('mousedown', mousedown);
				node.removeEventListener('dblclick', dblclick);
				node.removeEventListener('click', click);
			};
		};
	};
	// ################################## END Actions ######################################################################################################################################

	// ################################## BEGIN Utils #######################################################################################################################################
	readonly debounce = <This, Args extends unknown[]>(
		func: (this: This, ...args: Args) => void,
		delay: number
	): ((this: This, ...args: Args) => void) & { cancel: () => void } => {
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
	readonly getFooter = ({
		field,
		foot
	}: {
		field: Field<TData>;
		foot: Footer<TData>;
	}): number | string => {
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
	private debouncedResizeHandler = this.debounce((height: number) => {
		this.cachedClientHeight = Math.round(height);
		this.updateVisibleIndexes();
	}, 100);
	// ################################## END General Methods ################################################################################################################################

	// ################################## BEGIN Attr ########################################################################################################################################
	mainProps = $derived({
		class: 'slc-table-main',
		style: `
			width: ${this.srcWidth};
			height: ${this.srcHeight};
		`
	});
	containerProps = {
		class: 'slc-table-container'
	};
	tableProps = $derived({
		role: 'grid',
		class: 'slc-table',
		tabindex: -1,
		style: `
			grid-template-rows: ${this.#gridTemplateRows};
			grid-template-columns: ${this.#gridTemplateColumns};
			scroll-padding-block-start: ${this.headerRowsCountState > 0 ? `${this.headerRowsCountState * this.srcTheadRowHeight}px` : 'unset'};
			scroll-padding-block-end: ${this.srcFooters.length > 0 ? `${this.srcFooters.length * this.srcTfootRowHeight}px` : 'unset'};
			scroll-padding-inline-start: ${this.focusedCellState?.colIndex === -1 || this.srcRowSelection === 'none' ? 'unset' : `${this.srcRowSelectionColumnWidth}px`};
			scroll-padding-inline-end: ${this.focusedCellState?.colIndex === this.visibleColumns.length || this.srcRowAction === false ? 'unset' : `${this.srcRowActionColumnWidth}px`};			
		`,
		'aria-colcount': this.visibleColumns.length,
		'aria-rowcount':
			this.srcData.length + this.srcFooters.length + this.headerRowsCountState
	});
	trhProps = {
		role: 'row',
		class: 'slc-table-trh',
		style: `display: contents;`
	};
	thProps = {
		role: 'columnheader',
		class: 'slc-table-th',
		style: `grid-row-start: 1;`
	};
	thResizeProps = {
		class: 'slc-table-th-resize',
		style: `position: absolute; touch-action: none !important; background-color: red; top: 0px; right: 0px; bottom: 0px; width: 8px; opacity: 0; cursor: col-resize;`
	};
	thSelectionProps = {
		role: 'columnheader',
		class: 'slc-table-th slc-table-th-selection',
		style: `grid-row-start: 1;`
	};
	thActionProps = {
		role: 'columnheader',
		class: 'slc-table-th slc-table-th-action',
		style: `grid-row-start: 1;`
	};
	trdProps = {
		role: 'row',
		class: 'slc-table-trd',
		style: `display: contents;`
	};
	tdProps = {
		/* role: 'gridcell', */
		class: 'slc-table-td'
	};
	tdSelectionProps = {
		/* role: 'gridcell', */
		class: 'slc-table-td slc-table-td-selection'
	};
	tdActionProps = {
		/* role: 'gridcell', */
		class: 'slc-table-td slc-table-td-action'
	};
	trfProps = {
		role: 'row',
		class: 'slc-table-trf',
		style: `display: contents;`
	};
	tfProps = {
		role: 'gridcell',
		class: 'slc-table-tf'
	};
	tfSelectionProps = {
		role: 'gridcell',
		class: 'slc-table-tf slc-table-tf-selection'
	};
	tfActionProps = {
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
