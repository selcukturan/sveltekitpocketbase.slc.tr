<script lang="ts" generics="TData extends Row">
	import type { Row, Footers } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLAttributes<HTMLTableRowElement> & {
		data?: TData[];
		children: Snippet;
		fi?: number;
		class?: string;
	};
	const { data, children, fi = undefined, class: classes, ...attributes }: Props = $props();

	const table = getTable<TData>();
</script>

<tr
	class={`slc-table-trf ${classes}`}
	data-originalrowindex={fi}
	style:--slc-grid-row-start={table.setData && table.setData.length > 0 ? table.setData.length + table.headerRowCount + table.footerRowCount : 2}
	{...attributes}
>
	{@render children?.()}
</tr>

<style lang="postcss">
	.slc-table-trf {
		@apply contents bg-surface-50;
	}
</style>
