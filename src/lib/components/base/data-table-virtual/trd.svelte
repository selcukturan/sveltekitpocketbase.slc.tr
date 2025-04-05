<script lang="ts" generics="TData extends Row">
	import type { Row } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLAttributes<HTMLTableRowElement> & {
		children: Snippet;
		class?: string;
		ri?: number;
		row?: TData;
	};
	const { children, class: classes, ri, row, ...attributes }: Props = $props();

	const table = getTable<TData>();

	const originalRowIndex = row?.originalRowIndex !== null && row?.originalRowIndex !== undefined ? +row.originalRowIndex : undefined;
	const gridRowStart = originalRowIndex !== undefined ? originalRowIndex + table.headerRowCount + table.footerRowCount : undefined;
</script>

<tr
	class={`slc-table-trd ${classes}`}
	style:--slc-grid-row-start={gridRowStart}
	aria-rowindex={ri}
	data-originalrowindex={originalRowIndex}
	{...attributes}
>
	{@render children?.()}
</tr>

<style lang="postcss">
	.slc-table-trd {
		@apply contents bg-surface-50;
	}
</style>
