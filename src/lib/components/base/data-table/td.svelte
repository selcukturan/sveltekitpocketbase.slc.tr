<script lang="ts" generics="TDataType extends TableDataRowType">
	import type { TableColumnType, TableDataRowType, TableDataRowValueType } from './types';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { type Snippet } from 'svelte';
	import { getTable } from './tables.svelte';
	import { combineClasses } from './utils';

	type OnCellEditEventType = {
		event: string;
		detail: {
			newValue: TableDataRowValueType;
			oldValue: TableDataRowValueType;
			rowIndex: string;
			colIndex: string;
			field: string;
			column: TableColumnType;
			row: TDataType;
		};
	};

	type Props = HTMLTdAttributes & {
		row?: TDataType;
		children: Snippet;
		ri?: number;
		ci?: number;
		col?: TableColumnType;
		onCellEdit?: (params: OnCellEditEventType) => void;
		class?: string;
	};

	const { row, children, ri = undefined, ci = undefined, col = undefined, onCellEdit, class: classes, ...attributes }: Props = $props();

	const table = getTable<TDataType>();

	let thisTd: HTMLTableCellElement | undefined = $state(undefined);

	const handleOnBlur = (e: FocusEvent) => {
		table.setDeSelectedCell(e.currentTarget as HTMLTableCellElement);
	};
	const handleOnClick = (e: MouseEvent) => {
		table.setSelectedCell(e.currentTarget as HTMLTableCellElement);
	};
	const handleOnDblclick = (e: MouseEvent) => {
		if (table.editingCell) return;
		const target = e.currentTarget as HTMLTableCellElement;
		const { row, col, field } = target.dataset;
		if (!row || !col || !field) return;

		if (!table.columns || field === 'slcNullField' || !table.columns[+col].editable) return;

		table.createCellInput('SLCDBL', row, col, field);
	};
	const handleOnKeydown = (e: KeyboardEvent) => {
		if (table.editingCell) return;
		const target = e.currentTarget as HTMLTableCellElement;
		const { row, col, field } = target.dataset;
		if (!row || !col || !field) return;
		const { key } = e;

		const lastColumnIndex = table.columns ? (table.settings.columnAction ? table.columns.length : table.columns.length - 1) : 0;
		const lastRowIndex = table.data ? table.data.length - 1 : 0;
		const fisrtColumnIndex = table.settings.columnSelect ? '-1' : '0';

		const typableNumber = '1234567890';
		const typableLower = 'abcdefghijklmnopqrstuvwxyz';
		const typableUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const typableOther = " =-`[\\]';,./ğüşıöçĞÜŞİÖÇ";

		let nextCell: HTMLTableCellElement | null | undefined = null;
		if (key === 'ArrowUp') {
			nextCell = table.element?.querySelector(`[data-cell="r${+row - 1}c${col}"]`);
		} else if (key === 'ArrowDown' || key === 'Enter') {
			nextCell = table.element?.querySelector(`[data-cell="r${+row + 1}c${col}"]`);
		} else if (key === 'ArrowLeft' || (e.shiftKey && key === 'Tab')) {
			nextCell = table.element?.querySelector(`[data-cell="r${row}c${+col - 1}"]`);
			if (!nextCell && key === 'Tab') {
				nextCell = table.element?.querySelector(`[data-cell="r${+row - 1}c${lastColumnIndex}"]`);
				nextCell = nextCell || table.element?.querySelector(`[data-cell="r${lastRowIndex}c${lastColumnIndex}"]`);
			}
		} else if (key === 'ArrowRight' || (!e.shiftKey && key === 'Tab')) {
			nextCell = table.element?.querySelector(`[data-cell="r${row}c${+col + 1}"]`);
			if (!nextCell && key === 'Tab') {
				nextCell = table.element?.querySelector(`[data-cell="r${+row + 1}c${fisrtColumnIndex}"]`);
				nextCell = nextCell || table.element?.querySelector(`[data-cell="r0c${fisrtColumnIndex}"]`);
			}
		} else if (key === 'F2') {
			if (!table.columns || field === 'slcNullField' || !table.columns[+col].editable) return;
			e.preventDefault();
			table.createCellInput(key, row, col, field);
		} else if ((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C')) {
			/* Ctrl + C = Kopyala */
		} else if ((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'V')) {
			/* Ctrl + V = Yapistir */
		} else if (!e.ctrlKey && !e.metaKey && (typableNumber.includes(key) || typableLower.includes(key) || typableUpper.includes(key) || typableOther.includes(key))) {
			if (!table.columns || field === 'slcNullField' || !table.columns[+col].editable) return;
			e.preventDefault();
			table.createCellInput(key, row, col, field);
		}

		if (nextCell) {
			e.preventDefault();
			table.setSelectedCell(nextCell);
		}
	};

	const inputOnAction = (node: HTMLInputElement) => {
		node.focus();
		// node.select();

		const keydown = (e: KeyboardEvent) => {
			const target = e.currentTarget as HTMLInputElement;
			const { inputrow, inputcol } = target.dataset;
			if (!inputrow || !inputcol) return;
			const { key } = e;

			let nextCell: HTMLTableCellElement | null | undefined = null;

			if (key === 'ArrowUp') {
				nextCell = table.element?.querySelector(`[data-cell="r${+inputrow - 1}c${inputcol}"]`);
			} else if (key === 'ArrowDown' || key === 'Enter') {
				nextCell = table.element?.querySelector(`[data-cell="r${+inputrow + 1}c${inputcol}"]`);
			} else if (e.shiftKey && key === 'Tab') {
				nextCell = table.element?.querySelector(`[data-cell="r${inputrow}c${+inputcol - 1}"]`);
			} else if (!e.shiftKey && key === 'Tab') {
				nextCell = table.element?.querySelector(`[data-cell="r${inputrow}c${+inputcol + 1}"]`);
			} else if (key === 'Escape') {
				table.editingCellValue = table.editingCellOldValue;
				nextCell = table.element?.querySelector(`[data-cell="r${inputrow}c${inputcol}"]`);
			}
			if (nextCell) {
				e.preventDefault();
				table.setSelectedCell(nextCell);
			}
		};
		const blur = (e: FocusEvent) => {
			const target = e.currentTarget as HTMLInputElement;
			const { inputrow, inputcol, inputfield } = target.dataset;

			const newValue = table.columns && inputcol && table.columns[+inputcol].type === 'number' ? (isNaN(Number(table.editingCellValue)) ? 0 : Number(table.editingCellValue)) : table.editingCellValue;
			const oldValue = table.columns && inputcol && table.columns[+inputcol].type === 'number' ? (isNaN(Number(table.editingCellOldValue)) ? 0 : Number(table.editingCellOldValue)) : table.editingCellOldValue;

			table.removeCellInput();
			// onCellEdit
			if (inputrow && inputcol && inputfield) {
				table.setCellValue(newValue, oldValue, inputrow, inputcol, inputfield);
				if (onCellEdit && table.columns)
					thisOnCellEdit({
						event: 'celledit',
						detail: { newValue, oldValue, rowIndex: inputrow, colIndex: inputcol, field: inputfield, column: $state.snapshot(table.columns[+inputcol]), row: $state.snapshot(table.data[+inputrow]) as TDataType }
					});
			}
		};
		const click = (e: MouseEvent) => {
			e.stopPropagation();
		};

		node.addEventListener('keydown', keydown);
		node.addEventListener('blur', blur);
		node.addEventListener('click', click);

		return {
			destroy() {
				node.removeEventListener('keydown', keydown);
				node.removeEventListener('blur', blur);
				node.removeEventListener('click', click);
			}
		};
	};

	const thisOnCellEdit = (params: OnCellEditEventType): void => {
		const { event, detail } = params;
		// before `onCellEdit`
		if (onCellEdit) onCellEdit({ event, detail });
		// after `onCellEdit`
	};
</script>

<td
	bind:this={thisTd}
	tabindex="-1"
	aria-colindex={ci}
	aria-selected="false"
	data-row={ri}
	data-col={ci}
	data-cell={ci === undefined || ri === undefined ? undefined : `r${ri}c${ci}`}
	data-field={col?.field || 'slcNullField'}
	onblur={handleOnBlur}
	onclick={handleOnClick}
	ondblclick={handleOnDblclick}
	onkeydown={handleOnKeydown}
	autocorrect="off"
	spellcheck="false"
	class:group={false}
	style:grid-row-start="var(--slc-grid-row-start)"
	class={combineClasses('slc-table-td', { 'slc-table-td-columnSelect': table.settings.columnSelect || false, 'slc-table-td-columnAction': table.settings.columnAction || false }, classes)}
	{...attributes}
>
	<div class="flex h-full w-full justify-between">
		<div class="hidden items-center">x-</div>
		<div style:justify-content={col?.align === 'center' ? 'center' : col?.align === 'right' ? 'flex-end' : 'flex-start'} class="flex min-w-0 flex-1 items-center">
			<p class="overflow-hidden text-ellipsis whitespace-nowrap">
				{#if table.editingCellPath === `r${ri}c${ci}` && col?.editable}
					<input
						type="text"
						spellcheck="false"
						autocomplete="off"
						data-inputrow={ri}
						data-inputcol={ci}
						data-inputfield={col?.field || 'slcNullField'}
						use:inputOnAction
						bind:this={table.editingCellInput}
						bind:value={table.editingCellValue}
						style:text-align={col?.align || 'left'}
						class="m-0 h-full w-full border-none bg-transparent p-0 outline-none ring-0 focus:ring-0"
					/>
				{:else}
					{@render children()}
				{/if}
			</p>
		</div>
		<div class="hidden items-center">-x</div>
	</div>
</td>

<style lang="postcss">
	.slc-table-td {
		@apply relative z-[2] overflow-hidden border-b border-r bg-inherit p-0 px-2 outline-none slc-select-none focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-500 [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0;
	}
	.slc-table-td-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[3];
	}
	.slc-table-td-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[3];
	}
</style>
