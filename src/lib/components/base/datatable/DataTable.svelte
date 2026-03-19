<script lang="ts" generics="TData extends Row">
	import type { Row } from './types.d';
	import { createTableContext, type MainProps } from './ctx.svelte';

	let props: MainProps<TData> = $props();

	// svelte-ignore state_referenced_locally
	const context = createTableContext<TData>(props); // init

	// Parent kullanımı: tableRef?.helpers.testHelper1()
	export const helpers = context.helpers;

	// Parent kullanımı: {tableRef?.states.pending}
	export const states = {
		get pending() {
			return context.propsPending;
		},
		get headerRowHeight() {
			return context.propsHeaderRowHeight;
		}
	};
</script>

<div class:slc-table-main={true} class={context.propsMainClass} style:width={`100%`} style:height={`100%`}>
	{@render context.propsToolbar?.()}
	<div class:slc-table-container={true} class={context.propsContainerClass}>
		{#if context.dataLength === 0}
			<div class="slc-table-nodata">No data to display</div>
		{/if}
		{#if context.propsPending}
			<div class="slc-table-nodata">Loading...</div>
		{/if}
		<span
			role="grid"
			class:slc-table={true}
			//			bind:this={context.el}
			bind:clientHeight={context.clientHeight}
			use:context.scrollAction
			use:context.rafAction
			{@attach context.testTableScrollAttach}
			{@attach context.actionAttach()}
			data-context={context ? 'available' : 'unavailable'}
			class={context.propsTableClass}
			style:grid-template-rows={context.gridTemplateRows}
			style:grid-template-columns={context.gridTemplateColumns}
		>
			{#if context.headerLength > 0}
				{@render context.propsHeaderRow?.({
					test: 'test'
				})}
			{/if}

			{#if context.dataLength > 0}
				{#each context.virtualData as row, virtualIndex (row.data.id)}
					{@render context.propsDataRow?.({
						row: row.data,
						rowVirtualIndex: virtualIndex,
						rowOriginalIndex: row.originalIndex
					})}
				{/each}
			{/if}

			{#if context.dataLength > 0 && context.footerLength > 0}
				{#each context.propsFooters as row, footerIndex (footerIndex)}
					{@render context.propsFooterRow?.({
						footerRow: row,
						footerIndex
					})}
				{/each}
			{/if}
		</span>
	</div>
	{@render context.propsStatusbar?.()}
</div>

<style>
	/******************************************************/
	.slc-table-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		contain: inline-size;
	}
	.slc-table-container {
		flex: 1 1 0%;
		overflow: hidden;
		contain: inline-size;
		block-size: 100%;
		position: relative;
	}
	/******************************************************/
	.slc-table {
		display: grid;
		block-size: 100%;
		contain: content;
		content-visibility: auto;
		box-sizing: border-box;
		overflow: auto;
		overscroll-behavior: none;
		background-color: var(--color-surface-50);
	}
	.slc-table:before {
		content: '';
		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}
	/******************************************************/
	.slc-table-nodata {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		pointer-events: none;
		z-index: 5;
	}
	/******************************************************/
</style>
