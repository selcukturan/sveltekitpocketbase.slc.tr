<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, VisibleColumn } from './types';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		row: TData;
		columns: VisibleColumn<TData>[];
		rowVirtualIndex: number;
		rowOriginalIndex: number;
		dataLength: number;
		dataHeight: number;
		headersCount: number;
	};
	const {
		children,
		class: classes,
		row,
		columns,
		rowVirtualIndex,
		rowOriginalIndex,
		dataLength,
		dataHeight,
		headersCount,
		...attributes
	}: Props = $props();
</script>

<div data-slc-table-datarow role="row" style:display="contents" class={classes} {...attributes}>
	{@render children?.()}
</div>
