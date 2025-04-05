<script lang="ts" generics="TDataType extends TableDataRowType">
	import type { TableDataRowType } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { combineClasses } from './utils';

	type Props = HTMLAttributes<HTMLTableRowElement> & {
		children: Snippet;
		class?: string;
		ri?: number;
		row?: TDataType;
	};

	const { children, class: classes, ri, row, ...attributes }: Props = $props();
</script>

<tr aria-rowindex={ri} class={combineClasses('slc-table-trd', classes)} style:--slc-grid-row-start={row?.sysOriginalIndex !== null && row?.sysOriginalIndex !== undefined ? +row.sysOriginalIndex + 2 : undefined} {...attributes}>
	{@render children()}
</tr>

<style lang="postcss">
	.slc-table-trd {
		@apply contents bg-surface-50;
	}
</style>
