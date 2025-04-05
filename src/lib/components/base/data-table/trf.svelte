<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { combineClasses } from './utils';
	import { getTable } from './tables.svelte';

	const table = getTable();

	type Props = HTMLAttributes<HTMLTableRowElement> & {
		children: Snippet;
		class?: string;
	};

	const { children, class: classes, ...attributes }: Props = $props();
</script>

<tr class={combineClasses('slc-table-trf', classes)} style:--slc-grid-row-start={table.data && table.data.length > 0 ? table.data.length + 2 : 2} {...attributes}>
	{@render children()}
</tr>

<style lang="postcss">
	.slc-table-trf {
		@apply contents bg-surface-50;
	}
</style>
