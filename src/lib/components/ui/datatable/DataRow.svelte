<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, DataRowType, DataCellType } from './types.js';
	import { getTableContext } from './state/context.svelte.js';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		dataCell: Snippet<[dc: DataCellType<TData>]>;
		class?: string;
		dr: DataRowType<TData>;
	};

	const { dataCell, class: classes, dr, ...attributes }: Props = $props();

	const context = getTableContext<TData>();
</script>

<div
	data-slc-table-datarow
	role="row"
	data-row-id={dr.row.id}
	aria-rowindex={dr.rowOriginalIndex + context.headerLength + 1}
	aria-selected={context.selection.enabled ? context.selection.has(dr.row.id) : undefined}
	style:display="contents"
	class={classes}
	{...attributes}
>
	{#each context.visibleColumns as col, colVisibleIndex (col.data.field)}
		{@const value = (dr.row as Record<string, unknown>)[col.data.field]}
		{@render dataCell?.({ value, col, colVisibleIndex })}
	{/each}
</div>
