<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, HeaderRowType, HeaderCellType } from './types';
	import { getTableContext } from './context.svelte';
	import { on } from 'svelte/events';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		hr: HeaderRowType<TData>;
		hc: HeaderCellType<TData>;
	};
	const { children, class: classes, hr, hc, ...attributes }: Props = $props();

	const context = getTableContext<TData>();

	const gridRowStart = 1;
	const gridColumn = $derived(`${hc.colVisibleIndex + 1} / ${hc.colVisibleIndex + 2}`);

	const col = $derived(hc.col);
	const field = $derived(col.data.field as string);

	const isFreezeLeft = $derived(hc.colVisibleIndex < context.freezeLeft);
	const isFreezeRight = $derived(hc.colVisibleIndex >= context.visibleColumns.length - context.freezeRight);
	const isSticky = $derived(isFreezeLeft || isFreezeRight);

	const leftOffset = $derived(isFreezeLeft ? context.stickyOffsets[field]?.left : undefined);
	const rightOffset = $derived(isFreezeRight ? context.stickyOffsets[field]?.right : undefined);

	// Boundary check
	const isLastFreezeLeft = $derived(isFreezeLeft && hc.colVisibleIndex === context.freezeLeft - 1);
	const isFirstFreezeRight = $derived(isFreezeRight && hc.colVisibleIndex === context.visibleColumns.length - context.freezeRight);

	const isSortable = $derived(col.data.sortable !== false);
	const sortDir = $derived(context.getColumnSortDirection(col.data.field));

	const sortableAttach = (node: HTMLElement) => {
		const destroyClick = on(node, 'click', (e: MouseEvent) => {
			e.preventDefault();
			context.toggleSort(col.data.field);
		});
		const destroyKeydown = on(node, 'keydown', (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				context.toggleSort(col.data.field);
			}
		});
		return () => {
			destroyClick();
			destroyKeydown();
		};
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class:slc-table-headercell={true}
	class:slc-table-freeze-left={isFreezeLeft}
	class:slc-table-freeze-right={isFreezeRight}
	class:slc-table-freeze-left-boundary={isLastFreezeLeft}
	class:slc-table-freeze-right-boundary={isFirstFreezeRight}
	class:slc-table-headercell-sortable={isSortable}
	role="columnheader"
	data-coi={col.originalIndex}
	data-test-headerrow={hr.test}
	style:position="sticky"
	style:top="0"
	style:left={leftOffset !== undefined ? `${leftOffset}px` : undefined}
	style:right={rightOffset !== undefined ? `${rightOffset}px` : undefined}
	style:z-index={isSticky ? 3 : 2}
	style:background="var(--color-surface-200, #e2e8f0)"
	style:grid-row-start={gridRowStart}
	style:grid-column={gridColumn}
	class={classes}
	{@attach isSortable && sortableAttach}
	tabindex={isSortable ? 0 : undefined}
	{...attributes}
>
	<div class="slc-table-header-content">
		{@render children?.()}
	</div>

	{#if isSortable}
		<div class="slc-table-sort-icon" class:active={sortDir !== undefined}>
			{#if sortDir === 'asc'}
				▲
			{:else if sortDir === 'desc'}
				▼
			{:else}
				↕
			{/if}
		</div>
	{/if}

	{#if col.data.resizeable !== false}
		<div
			class="slc-table-resizer"
			onclick={(e) => e.stopPropagation()}
			{@attach context.colResizePointerAttach((e: PointerEvent) => context.colResizeUpdate(e, col.originalIndex, col.data.field))}
			role="separator"
			aria-label="Kolon Genişlet"
		></div>
	{/if}
</div>

<style>
	.slc-table-headercell {
		position: relative;
		display: flex;
		align-items: center;
		padding: 8px 12px;
		font-weight: 600;
		color: var(--color-surface-800, #1e293b);
		border-bottom: 2px solid var(--color-surface-300, #cbd5e1);
		user-select: none;
		box-sizing: border-box;
	}
	.slc-table-headercell-sortable {
		cursor: pointer;
	}
	.slc-table-headercell-sortable:hover {
		background-color: var(--color-surface-300, #cbd5e1) !important;
	}
	.slc-table-headercell-sortable:focus-visible {
		outline: 2px solid var(--color-primary-500, #3b82f6);
		outline-offset: -2px;
	}
	.slc-table-header-content {
		flex: 1 1 0%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.slc-table-sort-icon {
		margin-left: 6px;
		font-size: 10px;
		color: var(--color-surface-400, #94a3b8);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		user-select: none;
	}
	.slc-table-sort-icon.active {
		color: var(--color-primary-500, #3b82f6);
		font-weight: bold;
	}
	.slc-table-resizer {
		position: absolute;
		top: 0;
		right: 0;
		width: 4px;
		height: 100%;
		cursor: col-resize;
		user-select: none;
		touch-action: none;
		z-index: 10;
		transition: background-color 0.2s;
	}
	.slc-table-resizer:hover {
		background-color: var(--color-primary-500, #3b82f6);
		width: 6px;
	}
	.slc-table-freeze-left-boundary {
		box-shadow: 4px 0 8px -3px color-mix(in srgb, var(--color-surface-950, #000) 15%, transparent);
		border-right: 1px solid var(--color-surface-300, #cbd5e1);
	}
	.slc-table-freeze-right-boundary {
		box-shadow: -4px 0 8px -3px color-mix(in srgb, var(--color-surface-950, #000) 15%, transparent);
		border-left: 1px solid var(--color-surface-300, #cbd5e1);
	}
</style>
