<script lang="ts">
	import type { TableColumnType } from './types';
	import type { HTMLThAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getTable } from './tables.svelte';
	import { combineClasses } from './utils';

	const table = getTable();

	type Props = HTMLThAttributes & {
		children: Snippet;
		ci?: number;
		col?: TableColumnType;
		class?: string;
	};

	const { children, ci = undefined, col = undefined, class: classes, ...attributes }: Props = $props();
</script>

<th
	data-type={table.columns?.[ci as number]?.type}
	data-col={ci}
	style:grid-row-start="var(--slc-grid-row-start)"
	class:group={false}
	class={combineClasses(
		'slc-table-tf',
		{ 'slc-table-tf-columnSelect': table.settings.columnSelect || false, 'slc-table-tf-columnAction': table.settings.columnAction || false },
		classes
	)}
	{...attributes}
>
	<div class="flex h-full w-full justify-between">
		<div class="hidden items-center">x-</div>
		<div
			style:justify-content={col?.alignFooter
				? col?.alignFooter === 'center'
					? 'center'
					: col?.alignFooter === 'right'
						? 'flex-end'
						: 'flex-start'
				: col?.align === 'center'
					? 'center'
					: col?.align === 'right'
						? 'flex-end'
						: 'flex-start'}
			class="flex min-w-0 flex-1 items-center"
		>
			<p class="overflow-hidden text-ellipsis whitespace-nowrap">
				{@render children()}
			</p>
		</div>
		<div class="hidden items-center">x</div>
	</div>
</th>

<style lang="postcss">
	.slc-table-tf {
		@apply sticky bottom-0 z-[4] overflow-hidden border-b border-r border-solid border-surface-300 bg-surface-100 px-2 outline-none slc-select-none [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0;
	}
	.slc-table-tf-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[5];
	}
	.slc-table-tf-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[5];
	}
</style>
