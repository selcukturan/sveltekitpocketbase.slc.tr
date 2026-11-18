<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, DataRowType, DataCellType } from './types.js';
	import { getTableContext } from './context.svelte.js';
	import { on } from 'svelte/events';
	import Value from './Value.svelte';

	const JUSTIFY = { left: 'flex-start', center: 'center', right: 'flex-end' } as const;
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet; // verilmezse değer kolon tipine göre <Value> ile gösterilir
		class?: string;
		dr: DataRowType<TData>;
		dc: DataCellType<TData>;
	};
	const { children, class: classes, dr, dc, ...attributes }: Props = $props();

	const context = getTableContext<TData>();

	const gridRowStart = $derived(dr.rowOriginalIndex + context.headerLength + 1);
	const gridColumn = $derived(`${dc.colVisibleIndex + 1} / ${dc.colVisibleIndex + 2}`);

	const col = $derived(dc.col);
	const field = $derived(col.data.field as string);
	const justify = $derived(JUSTIFY[context.alignOf(col.data)]);

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
	style:justify-content={justify}
	style:position={isSticky ? 'sticky' : undefined}
	style:left={leftOffset !== undefined ? `${leftOffset}px` : undefined}
	style:right={rightOffset !== undefined ? `${rightOffset}px` : undefined}
	style:z-index={isSticky ? 1 : undefined}
	{@attach clickable && cellClickAttach}
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else}
		<Value value={dc.value} type={col.data.type} />
	{/if}
</div>

<style>
	[data-slc-table-datacell] {
		display: flex;
		align-items: center;
		padding: 8px 12px;
		border-bottom: var(--_dt-row-line);
		border-right: var(--_dt-col-line);
		background-color: var(--_dt-bg); /* sticky hücreler altını örtsün */
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	[data-slc-table-datacell].clickable {
		cursor: pointer;
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
