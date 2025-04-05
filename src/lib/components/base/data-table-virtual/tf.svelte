<script lang="ts" generics="TData extends Row">
	import type { HTMLThAttributes } from 'svelte/elements';
	import type { Footers, Row, Columns } from './types';
	import type { Snippet } from 'svelte';

	type Props = HTMLThAttributes & {
		data?: TData[];
		children: Snippet;
		fi?: number;
		foot?: Footers<TData>;
		col?: Columns<TData>;
		ci?: number;
		class?: string;
	};
	const { data, children, fi = undefined, foot = undefined, col = undefined, ci = undefined, class: classes, ...attributes }: Props = $props();
</script>

<th
	class={`slc-table-tf ${classes}`}
	style:grid-row-start="var(--slc-grid-row-start)"
	data-foot={fi}
	data-col={ci}
	data-originalcolindex={col?.originalColIndex}
	{...attributes}
>
	<div class="flex h-full w-full justify-between">
		<div class="hidden items-center">x</div>
		<div
			class="flex min-w-0 flex-1 items-center"
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
		>
			<p class="overflow-hidden text-ellipsis whitespace-nowrap">
				{@render children?.()}
			</p>
		</div>
		<div class="hidden items-center">x</div>
	</div>
</th>

<style lang="postcss">
	.slc-table-tf {
		@apply sticky bottom-0 z-[4] overflow-hidden border-b border-r border-solid border-surface-300 bg-surface-100 px-2 outline-none slc-select-none [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0;
	}
	/* .slc-table-tf-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[5];
	} */
	/* .slc-table-tf-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[5];
	} */
</style>
