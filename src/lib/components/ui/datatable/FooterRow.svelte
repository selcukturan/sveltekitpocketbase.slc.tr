<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, FooterCellType, FooterRowType } from './types';
	import { getTableContext } from './context.svelte';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		footerCell: Snippet<[fc: FooterCellType<TData>]>;
		class?: string;
		fr: FooterRowType<TData>;
	};

	const { footerCell, class: classes, fr, ...attributes }: Props = $props();

	const context = getTableContext<TData>();
</script>

<div data-slc-table-footerrow role="row" style:display="contents" class={classes} {...attributes}>
	{#each context.visibleColumns as col, colVisibleIndex (col.data.field)}
		{@const value = fr.footerRow[col.data.field]}
		{@render footerCell?.({ value, col, colVisibleIndex })}
	{/each}
</div>
