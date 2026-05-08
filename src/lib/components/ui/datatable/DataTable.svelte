<script lang="ts" generics="TData extends Row">
	import type { Row } from './types.d';
	import Pagination from './parts/Pagination.svelte';
	import { createTableContext, type MainProps } from './context.svelte';

	let props: MainProps<TData> = $props();

	// svelte-ignore state_referenced_locally
	const context = createTableContext<TData>(props); // init

	// Parent kullanımı: tableRef?.helpers.testHelper1()
	export const helpers = context.helpers;

	// Parent kullanımı: {tableRef?.states.loading}
	export const states = {
		get loading() {
			return context.query?.loading ?? false;
		},
		get headerRowHeight() {
			return context.headerRowHeight;
		}
	};
</script>

<div class:slc-table-main={true} class={context.mainClass} style:width="100%" style:height="100%">
	{@render context.toolbar?.()}
	<div class:slc-table-container={true} class={context.containerClass}>
		{#if context.query?.loading === true}
			<div class="slc-table-message"><p>Loading...</p></div>
		{:else if context.query?.error !== undefined}
			<div class="slc-table-message"><p>{context.query?.error.body.message ?? 'Error occurred'}</p></div>
		{:else if context.dataLength === 0}
			<div class="slc-table-message"><p>No data to display</p></div>
		{/if}
		<div
			role="grid"
			class:slc-table={true}
			bind:this={context.el}
			bind:clientHeight={context.clientHeight}
			{@attach context.watchCurrentChanged}
			{@attach context.watchScrollAndClientHeight}
			{@attach context.watchItemsChanged}
			{@attach context.trackTableScroll}
			{@attach context.trackTableRaf}
			class={context.tableClass}
			style:grid-template-rows={context.gridTemplateRows}
			style:grid-template-columns={context.gridTemplateColumns}
		>
			{#if context.headerLength > 0}
				{@render context.headerRow?.({
					test: 'test'
				})}
			{/if}

			{#if context.dataLength > 0}
				{#each context.virtualData as row, virtualIndex (row.data.id)}
					{@render context.dataRow?.({
						row: row.data,
						rowVirtualIndex: virtualIndex,
						rowOriginalIndex: row.originalIndex
					})}
				{/each}
			{/if}

			{#if context.dataLength > 0 && context.footerLength > 0}
				{#each context.footers as row, footerIndex (footerIndex)}
					{@render context.footerRow?.({
						footerRow: row,
						footerIndex
					})}
				{/each}
			{/if}
		</div>
	</div>
	{#if context.paginable}
		<div>
			<Pagination
				totalItems={context.totalItems}
				page={context.page}
				perPage={context.perPage}
				totalPages={context.totalPages}
				onChange={(data) => {
					context.onPagination?.(data);
				}}
			/>
		</div>
	{/if}
	{@render context.statusbar?.()}
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
	.slc-table-message {
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
