<script lang="ts" generics="TData extends Row">
	import { untrack, tick } from 'svelte';
	import type { Row } from './types.d';
	import { createTableContext, type MainProps } from './context.svelte';

	let props: MainProps<TData> = $props();

	// svelte-ignore state_referenced_locally
	const context = createTableContext<TData>(props); // init

	$effect(() => {
		context.throttledY;
		context.clientHeight;
		untrack(() => {
			console.log('context.throttledY_x', context.throttledY);
			console.log('context.clientHeight_x', context.clientHeight);
			context.updateVisibleIndexes();
		});
	});

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
	<div style="display: flex; gap: 1rem; padding: 0.5rem; font-size: 0.75rem; color: var(--color-text-500);">
		<div>
			fps: {context.fpsLimit} / {context.animation.fps.toFixed(0)}
		</div>
		<div>
			delta: 16.67 / {context.delta.toFixed(2)}
		</div>
		<div>frames: {context.frames}</div>
	</div>

	<div class:slc-table-container={true} class={context.propsContainerClass}>
		{#if context.dataLength === 0}
			<div class="slc-table-nodata">No data to display</div>
		{/if}
		{#if context.propsPending}
			<div class="slc-table-nodata">Loading...</div>
		{/if}
		<div
			class:slc-table={true}
			class={context.propsTableClass}
			role="grid"
			bind:this={context.el}
			bind:clientHeight={context.clientHeight}
			// {...attributes}
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
		</div>
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
