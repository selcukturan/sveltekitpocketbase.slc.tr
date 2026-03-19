<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, HeaderRowType, HeaderCellType } from './types';
	import { getTableContext } from './context.svelte';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		headerCell: Snippet<[hc: HeaderCellType<TData>]>;
		class?: string;
		hr: HeaderRowType<TData>;
	};
	const { headerCell, class: classes, hr, ...attributes }: Props = $props();

	const context = getTableContext<TData>();
</script>

<div data-slc-table-headerrow role="row" style:display="contents" class={classes} {...attributes}>
	{#each context.visibleColumns as col, colVisibleIndex (col.data.field)}
		{@const label = col.data.label}
		{@render headerCell?.({ label, col, colVisibleIndex })}
	{/each}
</div>
