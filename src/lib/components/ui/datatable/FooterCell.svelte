<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, FooterRowType, FooterCellType } from './types.js';
	import { getTableContext } from './context.svelte.js';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet; // verilmezse değer olduğu gibi gösterilir
		class?: string;
		fr: FooterRowType<TData>;
		fc: FooterCellType<TData>;
	};
	const { children, class: classes, fr, fc, ...attributes }: Props = $props();

	const context = getTableContext<TData>();

	const gridRowStart = $derived(context.dataLength + context.headerLength + fr.footerIndex + 1);
	const gridColumn = $derived(`${fc.colVisibleIndex + 1} / ${fc.colVisibleIndex + 2}`);
	const bottom = $derived(`${(context.footerLength - fr.footerIndex - 1) * context.footerRowHeight}px`);

	const col = $derived(fc.col);
	const field = $derived(col.data.field as string);
	const justify = $derived({ left: 'flex-start', center: 'center', right: 'flex-end' }[context.alignOf(col.data, 'footer')]);

	const isFreezeLeft = $derived(fc.colVisibleIndex < context.freezeLeft);
	const isFreezeRight = $derived(fc.colVisibleIndex >= context.visibleColumns.length - context.freezeRight);
	const isSticky = $derived(isFreezeLeft || isFreezeRight);

	const leftOffset = $derived(isFreezeLeft ? context.stickyOffsets[field]?.left : undefined);
	const rightOffset = $derived(isFreezeRight ? context.stickyOffsets[field]?.right : undefined);

	// Boundary check
	const isLastFreezeLeft = $derived(isFreezeLeft && fc.colVisibleIndex === context.freezeLeft - 1);
	const isFirstFreezeRight = $derived(isFreezeRight && fc.colVisibleIndex === context.visibleColumns.length - context.freezeRight);
</script>

<div
	data-slc-table-footercell
	role="gridcell"
	class={classes}
	class:slc-table-freeze-left={isFreezeLeft}
	class:slc-table-freeze-right={isFreezeRight}
	class:slc-table-freeze-left-boundary={isLastFreezeLeft}
	class:slc-table-freeze-right-boundary={isFirstFreezeRight}
	style:position="sticky"
	style:bottom
	style:left={leftOffset !== undefined ? `${leftOffset}px` : undefined}
	style:right={rightOffset !== undefined ? `${rightOffset}px` : undefined}
	style:z-index={isSticky ? 3 : 2}
	style:grid-row-start={gridRowStart}
	style:grid-column={gridColumn}
	style:justify-content={justify}
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else if fc.value !== undefined && fc.value !== null}
		{String(fc.value)}
	{/if}
</div>

<style>
	[data-slc-table-footercell] {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		font-weight: 500;
		color: var(--_dt-header-text);
		background-color: var(--_dt-header-bg);
		border-top: 1px solid var(--_dt-border-strong);
		border-right: var(--_dt-col-line);
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.slc-table-freeze-left-boundary {
		box-shadow: var(--_dt-freeze-shadow-left);
		border-right: var(--_dt-freeze-line);
	}
	.slc-table-freeze-right-boundary {
		box-shadow: var(--_dt-freeze-shadow-right);
		border-left: var(--_dt-freeze-line);
	}
</style>
