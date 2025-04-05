<script lang="ts" generics="TData extends Row">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getTable, type Sources, type Row } from './tables.svelte';

	type Props = HTMLAttributes<HTMLDivElement> & {
		src: Sources<TData>;
		children: Snippet;
		class?: string;
		ri: number;
		row: TData;
	};
	const { src, children, class: classes = '', ri, row, ...attributes }: Props = $props();

	const table = getTable<TData>(src.id);

	const row_oi = $derived(table.get.enableVirtualization === false ? ri : (row.oi ?? 0));
	const indexToRow = 1;
	const ariaRowIndex = $derived(row_oi + table.headerRowsCount + indexToRow);

	const rowEvenOrOdd = $derived(row_oi % 2);

	const isSelectedRow = $derived(Array.isArray(table.getSelectedRows) && table.getSelectedRows.includes(row_oi));
</script>

<div
	role="row"
	data-scope="trd"
	class={`${classes} ${rowEvenOrOdd === 1 ? 'slc-row-odd' : 'slc-row-even'}`}
	aria-selected={isSelectedRow ? 'true' : 'false'}
	aria-rowindex={ariaRowIndex}
	{...attributes}
>
	{@render children?.()}
</div>

<style>
	[data-scope='trd'] {
		display: contents;
	}
</style>
