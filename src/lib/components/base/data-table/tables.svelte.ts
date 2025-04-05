import type { SettingsType, TableDataRowType, TableDataRowValueType } from './types';
import { getContext, setContext } from 'svelte';

class Table<TDataType extends TableDataRowType> {
	setData: TDataType[] = $state([]);
	setSettings: SettingsType = $state({});

	private readonly defaultSettings = { columnSelect: true, columnAction: true, theadRowHeight: '35px', tbodyRowHeight: '35px', tfootRowHeight: '35px' };
	data: TDataType[] = $derived(this.setData || []);
	settings: SettingsType = $derived({ ...this.defaultSettings, ...this.setSettings });
	columns = $derived(this.settings.columns?.filter((column) => !column.hidden));

	element: HTMLTableElement | undefined = $state(undefined);

	editingCell: boolean = $state(false);
	editingCellInput: HTMLInputElement | undefined = $state(undefined);
	editingCellValue: string = $state('');
	editingCellOldValue: string = '';
	editingCellPath: string = $state('');

	beforeSelectedRow!: HTMLTableRowElement;
	currentSelectedRow!: HTMLTableRowElement;
	beforeSelectedCell!: HTMLTableCellElement;
	currentSelectedCell!: HTMLTableCellElement;

	constructor(data: TDataType[] = [], settings: SettingsType = {}) {
		this.setData = data;
		this.setSettings = settings;
	}

	setColumnWidth(ci: number, min: number, width: number) {
		if (!this.setSettings.columns || !this.columns) return;
		const tempField = this.columns[ci].field;

		for (let column of this.setSettings.columns) {
			if (column.field === tempField) {
				column.width = `${Math.max(min, width)}px`;
				break;
			}
		}
	}

	testVisibleColumn() {
		if (this.setSettings.columns) this.setSettings.columns[1].hidden = !this.setSettings.columns[1].hidden;
	}
	testDeleteRow() {
		this.setData.splice(0, 1);
	}

	/*
	 * BEGIN td.svelte
	 */
	setDeSelectedRow = (cell: HTMLTableCellElement) => {
		const { row } = cell.dataset;
		const element = cell.closest(`[aria-rowindex="${row}"]`);
		if (!element) throw new Error('Element not found');
		this.beforeSelectedRow = element as HTMLTableRowElement;
		this.beforeSelectedRow?.classList.remove('slc-selected-row');
	};
	setSelectedRow = (cell: HTMLTableCellElement) => {
		const { row } = cell.dataset;
		const element = cell.closest(`[aria-rowindex="${row}"]`);
		if (!element) throw new Error('Element not found');
		this.currentSelectedRow = element as HTMLTableRowElement;
		this.currentSelectedRow?.classList.add('slc-selected-row');
	};
	setDeSelectedCell = (cell: HTMLTableCellElement) => {
		this.beforeSelectedCell = cell;
		this.beforeSelectedCell.setAttribute('tabindex', '-1');
		this.beforeSelectedCell.setAttribute('aria-selected', 'false');
		this.beforeSelectedCell.classList.remove('slc-selected-cell');
		this.setDeSelectedRow(this.beforeSelectedCell);
	};
	setSelectedCell = (cell: HTMLTableCellElement) => {
		this.currentSelectedCell = cell;
		this.currentSelectedCell.setAttribute('tabindex', '0');
		this.currentSelectedCell.setAttribute('aria-selected', 'true');
		this.currentSelectedCell.classList.add('slc-selected-cell');
		this.currentSelectedCell.focus(); // burasi onblur'u tetikleyip, `setDeSelectedCell()`i tetikler.
		if (cell.dataset.field === 'slcNullField') {
			this.currentSelectedCell.querySelector('input')?.focus();
			this.currentSelectedCell.querySelector('button')?.focus();
		}
		this.setSelectedRow(this.currentSelectedCell);
	};
	/*
	 * END td.svelte
	 */

	removeCellInput = () => {
		if (this.editingCell) {
			this.editingCellPath = '';
			this.editingCellInput = undefined;
			this.editingCellOldValue = '';
			this.editingCellValue = '';
			this.editingCell = false;
		}
	};
	createCellInput = (key: string, row: string, col: string, field: string) => {
		/* this.removeCellInput(); */
		let snapshotRow: TDataType = $state.snapshot(this.data[+row]) as TDataType;

		const oldValue = snapshotRow[field];
		const oldValueForInput = oldValue != null ? oldValue.toString() : '';
		this.editingCellOldValue = oldValueForInput;

		this.editingCellValue = key === 'F2' || key === 'SLCDBL' ? oldValueForInput : key;

		this.editingCell = true;
		this.editingCellPath = `r${row}c${col}`;

		/* snapshotRow[field] = null;
		this.setData[+row] = snapshotRow; */
	};
	setCellValue = (newValue: TableDataRowValueType, oldValue: TableDataRowValueType, row: string, col: string, field: string) => {
		let snapshotRow = $state.snapshot(this.data[+row]);
		/* snapshotRow[field] = newValue; */
		/* this.setData[+row] = snapshotRow; */
	};
}

// ################################## BEGIN Export Table Context ###############################################################
const SLC_TABLE_CONTEXT_KEY = Symbol('SLC_TABLE_CONTEXT_KEY');
export function setTable<TDataType extends TableDataRowType>(data: TDataType[], settings: SettingsType): Table<TDataType> {
	const table = new Table(data, settings);
	setContext(SLC_TABLE_CONTEXT_KEY, table);
	return table;
}
/* export function getTable() {
	return getContext<ReturnType<typeof setTable>>(SLC_TABLE_CONTEXT_KEY);
} */
export function getTable<TDataType extends TableDataRowType>(): Table<TDataType> {
	const table = getContext<Table<TDataType>>(SLC_TABLE_CONTEXT_KEY);
	return table;
}
// ################################## END Export Table Context #################################################################
