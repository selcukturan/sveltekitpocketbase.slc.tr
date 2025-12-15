<script lang="ts" generics="TData extends Row">
	import type { Row, Column, Footer, FooterRowType, DataRowType, HeaderRowType, ListResult } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Snippet } from 'svelte';
	import { watch } from 'runed';
	import { createTableContext } from './context.svelte';

	type Props = HTMLAttributes<HTMLDivElement> & {
		data?: ListResult<TData>;
		columns: Column<TData>[];
		footers?: Footer<TData>[];
		toolbar?: Snippet;
		headerRow: Snippet<[hr: HeaderRowType<TData>]>;
		dataRow: Snippet<[dr: DataRowType<TData>]>;
		footerRow?: Snippet<[fr: FooterRowType<TData>]>;
		statusbar?: Snippet;
		class?: string;
		containerClass?: string;
		mainClass?: string;
		loading?: boolean;
		headerRowHeight?: number;
		dataRowHeight?: number;
		footerRowHeight?: number;
	};

	let {
		data = {
			page: 1, // context
			perPage: 30, // context
			totalItems: 0, // context
			totalPages: 0, // context
			items: [] // context
		}, // context
		columns, // context
		footers = [], // context
		headerRowHeight = 35, // context
		dataRowHeight = 35, // context
		footerRowHeight = 35, // context
		toolbar,
		headerRow,
		dataRow,
		footerRow,
		statusbar,
		class: tableClass,
		containerClass,
		mainClass,
		loading = false,
		...attributes
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	const context = createTableContext<TData>(data, columns, footers); // init
	watch(
		() => data,
		(currentData) => {
			context.rawData = currentData;
		},
		{ lazy: true }
	);
	watch(
		() => columns,
		(currentColumns) => {
			context.columns = currentColumns;
		},
		{ lazy: true }
	);
	watch(
		() => footers,
		(currentFooters) => {
			context.footers = currentFooters;
		},
		{ lazy: true }
	);
	// ############################################################################################################################################
	watch(
		() => headerRowHeight,
		(v) => {
			context.headerRowHeight = v;
		}
	);
	watch(
		() => dataRowHeight,
		(v) => {
			context.dataRowHeight = v;
		}
	);
	watch(
		() => footerRowHeight,
		(v) => {
			context.footerRowHeight = v;
		}
	);

	export const test = () => {
		console.log('test object');
	};
</script>

<div class:slc-table-main={true} class={mainClass} style:width={`100%`} style:height={`100%`}>
	{@render toolbar?.()}
	<div style="display: flex; gap: 1rem; padding: 0.5rem; font-size: 0.75rem; color: var(--color-text-500);">
		<div>
			fps: {context.fpsLimit} / {context.animation.fps.toFixed(0)}
		</div>
		<div>
			delta: 16.67 / {context.delta.toFixed(2)}
		</div>
		<div>frames: {context.frames}</div>
	</div>

	<div class:slc-table-container={true} class={containerClass}>
		{#if context.dataLength === 0}
			<div class="slc-table-nodata">No data to display</div>
		{/if}
		{#if loading}
			<div class="slc-table-nodata">Loading...</div>
		{/if}
		<div
			class:slc-table={true}
			class={tableClass}
			role="grid"
			bind:this={context.el}
			{...attributes}
			style:grid-template-rows={context.gridTemplateRows}
			style:grid-template-columns={context.gridTemplateColumns}
		>
			{#if context.headerLength > 0}
				{@render headerRow?.({
					test: 'test'
				})}
			{/if}

			{#if context.dataLength > 0}
				{#each context.virtualData as row, virtualIndex (row.data.id)}
					{@render dataRow?.({
						row: row.data,
						rowVirtualIndex: virtualIndex,
						rowOriginalIndex: row.originalIndex
					})}
				{/each}
			{/if}

			{#if context.dataLength > 0 && context.footerLength > 0}
				{#each context.footers as row, footerIndex (footerIndex)}
					{@render footerRow?.({
						footerRow: row,
						footerIndex
					})}
				{/each}
			{/if}
		</div>
	</div>
	{@render statusbar?.()}
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
