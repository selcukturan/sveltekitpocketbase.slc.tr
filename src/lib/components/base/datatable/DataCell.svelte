<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, DataRowType, DataCellType } from './types';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		dr: DataRowType<TData>;
		dc: DataCellType<TData>;
	};
	const { children, class: classes, dr, dc, ...attributes }: Props = $props();

	const background =
		dr.rowOriginalIndex % 2 === 0
			? 'var(--color-surface-100)'
			: 'var(--color-surface-50)';
</script>

<div
	data-slc-table-datacell
	role="gridcell"
	style:grid-row-start={dr.rowOriginalIndex + dr.headerCount + 1}
	style:grid-column={`${dc.colVisibleIndex + 1} / ${dc.colVisibleIndex + 2}`}
	style:background
	{...attributes}
>
	{@render children?.()}
</div>
