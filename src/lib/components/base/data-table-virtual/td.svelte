<script lang="ts" generics="TData extends Row">
	import type { Row, Columns } from './types';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { type Snippet } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLTdAttributes & {
		row?: TData;
		children: Snippet;
		ri?: number;
		ci?: number;
		col?: Columns<TData>;
		class?: string;
	};

	const { row, children, ri = undefined, ci = undefined, col = undefined, class: classes, ...attributes }: Props = $props();

	const table = getTable<TData>();

	const cellOriginalRowIndex = row?.originalRowIndex !== null && row?.originalRowIndex !== undefined ? +row.originalRowIndex : undefined;
	const cellOriginalColIndex = col?.originalColIndex !== null && col?.originalColIndex !== undefined ? +col.originalColIndex : undefined;
	const cellReferance = ri === undefined || ci === undefined ? undefined : `r${ri}c${ci}`;
	const focusedCellReferance =
		cellOriginalRowIndex === undefined || cellOriginalColIndex === undefined ? '' : `r${cellOriginalRowIndex}c${cellOriginalColIndex}`;

	const focusAction = (cellNode: HTMLTableCellElement) => {
		const handleFocus = () => {
			table.focusedCell = undefined;

			const { row, col, originalrowindex, originalcolindex } = cellNode.dataset;

			const rowIndex = row ? +row : undefined;
			const colIndex = col ? +col : undefined;
			const originalRowIndex = originalrowindex ? +originalrowindex : undefined;
			const originalColIndex = originalcolindex ? +originalcolindex : undefined;

			if (
				typeof rowIndex === 'undefined' ||
				typeof colIndex === 'undefined' ||
				typeof originalRowIndex === 'undefined' ||
				typeof originalColIndex === 'undefined'
			)
				return;

			const cell = `r${rowIndex}c${colIndex}`;
			const originalCell = `r${originalRowIndex}c${originalColIndex}`;

			table.focusedCell = { rowIndex, colIndex, cell, originalCell, originalRowIndex, originalColIndex };
		};

		cellNode.addEventListener('focus', handleFocus);

		return {
			destroy() {
				cellNode.removeEventListener('focus', handleFocus);
			}
		};
	};
</script>

<td
	class={`slc-table-td ${classes}`}
	style:grid-row-start="var(--slc-grid-row-start)"
	use:focusAction
	class:slc-table-td-focusedCell={table?.focusedCell?.originalCell === focusedCellReferance ? true : false}
	tabindex={table?.focusedCell?.originalCell === focusedCellReferance ? 0 : -1}
	aria-selected={table?.focusedCell?.originalCell === focusedCellReferance ? 'true' : 'false'}
	aria-colindex={ci}
	data-col={ci}
	data-row={ri}
	data-cell={cellReferance}
	data-originalrowindex={cellOriginalRowIndex}
	data-originalcolindex={cellOriginalColIndex}
	data-originalcell={focusedCellReferance}
	data-field={col?.field || 'slcNullField'}
	spellcheck="false"
	{...attributes}
>
	<div class="flex h-full w-full justify-between">
		<div class="hidden items-center">x</div>
		<div
			style:justify-content={col?.align === 'center' ? 'center' : col?.align === 'right' ? 'flex-end' : 'flex-start'}
			class="flex min-w-0 flex-1 items-center"
		>
			<p class="overflow-hidden text-ellipsis whitespace-nowrap">
				{@render children?.()}
			</p>
		</div>
		<div class="hidden items-center">x</div>
	</div>
</td>

<style lang="postcss">
	.slc-table-td {
		@apply relative z-[2] select-none overflow-hidden border-b border-r bg-inherit p-0 px-2 outline-none [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0;
		/* focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-500 */
	}
	.slc-table-td-focusedCell {
		@apply outline-2 -outline-offset-2 outline-primary-500;
	}
	/* .slc-table-td-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[3];
	} */
	/* .slc-table-td-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[3];
	} */
</style>
