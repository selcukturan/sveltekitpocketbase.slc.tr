<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { combineClasses } from './utils';

	type Props = HTMLAttributes<HTMLTableRowElement> & {
		children: Snippet;
		class?: string;
	};
	const { children, class: classes, ...attributes }: Props = $props();
</script>

<tr class={combineClasses('slc-table-trh', classes)} style:--slc-grid-row-start="1" {...attributes}>
	{@render children()}
</tr>

<style lang="postcss">
	.slc-table-trh {
		@apply contents bg-surface-50;
	}
</style>
