<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, DataRowType, DataCellType } from './types.js';
	import { getTableContext } from './context.svelte.js';
	import Value from './Value.svelte';
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

	// Sanal kaydırmada hücreler sürekli oluşturulur: kolon bilgisi context'te kolon başına bir kez hesaplanır (columnLayout),
	// satır tıklaması grid'deki tek dinleyiciyle yakalanır (trackRowClick, data-row ile).
	const layout = $derived(context.columnLayout[dc.colVisibleIndex]);
	const gridRowStart = $derived(dr.rowOriginalIndex + context.headerLength + 1);
</script>

<div
	data-slc-table-datacell
	data-row={dr.rowOriginalIndex}
	role="gridcell"
	class={classes}
	class:slc-table-freeze-left={layout?.freezeLeft}
	class:slc-table-freeze-right={layout?.freezeRight}
	class:slc-table-freeze-left-boundary={layout?.boundaryLeft}
	class:slc-table-freeze-right-boundary={layout?.boundaryRight}
	class:clickable={context.onRowClick !== undefined}
	style:grid-row-start={gridRowStart}
	style:grid-column={layout?.gridColumn}
	style:justify-content={layout?.justifyCell}
	style:position={layout?.sticky ? 'sticky' : undefined}
	style:left={layout?.left}
	style:right={layout?.right}
	style:z-index={layout?.sticky ? 1 : undefined}
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else}
		<Value value={dc.value} type={dc.col.data.type} />
	{/if}
</div>

<style>
	[data-slc-table-datacell] {
		display: flex;
		font-variant-numeric: tabular-nums; /* rakamlar eşit genişlikte: alt alta karşılaştırma kolay */
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
