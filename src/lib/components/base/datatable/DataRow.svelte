<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, DataRowType, DataCellType } from './types';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		dataCell: Snippet<[dc: DataCellType<TData>]>;
		class?: string;
		dr: DataRowType<TData>;
	};

	const { dataCell, class: classes, dr, ...attributes }: Props = $props();
</script>

<div
	data-slc-table-datarow
	role="row"
	style:display="contents"
	class={classes}
	{...attributes}
>
	{#each dr.columns as col, colVisibleIndex (col.data.field)}
		{@const value = dr.row[col.data.field]}
		{@render dataCell?.({ value, col, colVisibleIndex })}
	{/each}
</div>
