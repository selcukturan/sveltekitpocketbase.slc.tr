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
		col: VisibleColumn<TData>;
		colVisibleIndex: number;
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
		col,
		colVisibleIndex,
		dataLength,
		dataHeight,
		headersCount,
		...attributes
	}: Props = $props();

	const background = rowOriginalIndex % 2 === 0 ? 'var(--color-surface-100)' : 'var(--color-surface-50)';
</script>

<div
	data-slc-table-datacell
	role="gridcell"
	style:grid-row-start={rowOriginalIndex + headersCount + 1}
	style:grid-column={`${colVisibleIndex + 1} / ${colVisibleIndex + 2}`}
	style:background
	{...attributes}
>
	{@render children?.()}
</div>
