<script lang="ts" generics="TData extends Row">
	import type { HTMLThAttributes } from 'svelte/elements';
	import type { Columns, Row } from './types';
	import { type Snippet } from 'svelte';

	type Props = HTMLThAttributes & {
		data?: TData[];
		children: Snippet;
		ci?: number;
		col?: Columns<TData>;
		class?: string;
	};

	const { data, children, ci = undefined, col = undefined, class: classes, ...attributes }: Props = $props();
</script>

<th
	class={`slc-table-th ${classes}`}
	style:grid-row-start="var(--slc-grid-row-start)"
	data-col={ci}
	data-originalcolindex={col?.originalColIndex}
	{...attributes}
>
	<div class="flex h-full w-full justify-between">
		<div class="hidden items-center">x</div>
		<div
			style:justify-content={col?.alignHeader
				? col?.alignHeader === 'center'
					? 'center'
					: col?.alignHeader === 'right'
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
				{@render children?.()}
			</p>
		</div>
		<div class="hidden items-center">x</div>
	</div>
</th>

<style lang="postcss">
	.slc-table-th {
		@apply sticky;
		@apply bg-surface-100;
		@apply hover:bg-surface-200;
		@apply top-0;
		@apply z-[4];
		@apply overflow-hidden;
		@apply duration-100;
		@apply px-2;
		@apply outline-none;
		@apply slc-select-none;
		@apply border-b;
		@apply border-r;
		/* columnSelectClass */
		/* columnActionClass */
		@apply [&:nth-last-child(1)]:border-l;
		@apply [&:nth-last-child(2)]:border-r-0;
	}
	/* .slc-table-th-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[5];
	} */
	/* .slc-table-th-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[5];
	} */
</style>
