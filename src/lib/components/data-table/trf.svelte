<script lang="ts" generics="TData extends Row">
	import type { Row, Sources } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLAttributes<HTMLDivElement> & {
		src: Sources<TData>;
		children: Snippet;
		fi: number;
		class?: string;
	};
	const { src, children, fi, class: classes, ...attributes }: Props = $props();

	const table = getTable<TData>(src.id);

	const footerIndexToRow = 1;
	const ariaRowIndex = $derived(table.get.data.length + table.headerRowsCount + fi + footerIndexToRow);
</script>

<div role="row" data-scope="trf" class={classes} aria-rowindex={ariaRowIndex} data-originalfootindex={fi} {...attributes}>
	{@render children?.()}
</div>

<style>
	[data-scope='trf'] {
		display: contents;
	}
</style>
