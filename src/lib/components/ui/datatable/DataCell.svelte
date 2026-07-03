<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, DataRowType, DataCellType } from './types';
	import { getTableContext } from './context.svelte';
	import { on } from 'svelte/events';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		dr: DataRowType<TData>;
		dc: DataCellType<TData>;
	};
	const { children, class: classes, dr, dc, ...attributes }: Props = $props();

	const context = getTableContext<TData>();

	const gridRowStart = $derived(dr.rowOriginalIndex + context.headerLength + 1);
	const gridColumn = $derived(`${dc.colVisibleIndex + 1} / ${dc.colVisibleIndex + 2}`);
	const background = $derived(dr.rowOriginalIndex % 2 === 0 ? 'var(--color-surface-50, #ffffff)' : 'var(--color-surface-50, #ffffff)');

	const col = $derived(dc.col);
	const field = $derived(col.data.field as string);

	const isFreezeLeft = $derived(dc.colVisibleIndex < context.freezeLeft);
	const isFreezeRight = $derived(dc.colVisibleIndex >= context.visibleColumns.length - context.freezeRight);
	const isSticky = $derived(isFreezeLeft || isFreezeRight);

	const leftOffset = $derived(isFreezeLeft ? context.stickyOffsets[field]?.left : undefined);
	const rightOffset = $derived(isFreezeRight ? context.stickyOffsets[field]?.right : undefined);

	// Boundary check
	const isLastFreezeLeft = $derived(isFreezeLeft && dc.colVisibleIndex === context.freezeLeft - 1);
	const isFirstFreezeRight = $derived(isFreezeRight && dc.colVisibleIndex === context.visibleColumns.length - context.freezeRight);

	const clickable = $derived(Boolean(context.onRowClick));

	const cellClickAttach = (node: HTMLElement) => {
		const destroyClick = on(node, 'click', (e: MouseEvent) => {
			let target = e.target as HTMLElement | null;
			while (target && target !== e.currentTarget) {
				const tagName = target.tagName.toLowerCase();
				const role = target.getAttribute('role');
				if (
					['button', 'a', 'input', 'select', 'textarea', 'label'].includes(tagName) ||
					['button', 'link', 'checkbox', 'radio', 'menuitem', 'option'].includes(role || '')
				) {
					return;
				}
				target = target.parentElement;
			}
			context.onRowClick?.(dr.row);
		});

		return destroyClick;
	};
</script>

<div
	data-slc-table-datacell
	role="gridcell"
	class={classes}
	class:slc-table-freeze-left={isFreezeLeft}
	class:slc-table-freeze-right={isFreezeRight}
	class:slc-table-freeze-left-boundary={isLastFreezeLeft}
	class:slc-table-freeze-right-boundary={isFirstFreezeRight}
	class:clickable
	style:grid-row-start={gridRowStart}
	style:grid-column={gridColumn}
	style:background
	style:position={isSticky ? 'sticky' : undefined}
	style:left={leftOffset !== undefined ? `${leftOffset}px` : undefined}
	style:right={rightOffset !== undefined ? `${rightOffset}px` : undefined}
	style:z-index={isSticky ? 1 : undefined}
	{@attach clickable && cellClickAttach}
	{...attributes}
>
	{@render children?.()}
</div>

<style>
	[data-slc-table-datacell] {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		border-bottom: 1px solid var(--color-surface-200, #e2e8f0);
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	[data-slc-table-datacell].clickable {
		cursor: pointer;
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
