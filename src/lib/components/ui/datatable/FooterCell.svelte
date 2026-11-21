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
	const bottom = $derived(`${(context.footerLength - fr.footerIndex - 1) * context.footerRowHeight}px`);

	const layout = $derived(context.columnLayout[fc.colVisibleIndex]);
</script>

<div
	data-slc-table-footercell
	role="gridcell"
	class={classes}
	class:slc-table-freeze-left={layout?.freezeLeft}
	class:slc-table-freeze-right={layout?.freezeRight}
	class:slc-table-freeze-left-boundary={layout?.boundaryLeft}
	class:slc-table-freeze-right-boundary={layout?.boundaryRight}
	style:position="sticky"
	style:bottom
	style:left={layout?.left}
	style:right={layout?.right}
	style:z-index={layout?.sticky ? 3 : 2}
	style:grid-row-start={gridRowStart}
	style:grid-column={layout?.gridColumn}
	style:justify-content={layout?.justifyFooter}
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
		font-variant-numeric: tabular-nums; /* rakamlar eşit genişlikte: alt alta karşılaştırma kolay */
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
