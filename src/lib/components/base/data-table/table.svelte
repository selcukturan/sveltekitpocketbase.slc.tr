<script lang="ts" generics="TDataType extends TableDataRowType">
	import type { TableDataRowType } from './types';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getTable } from './tables.svelte';
	import { combineClasses } from './utils';

	type Props = HTMLTableAttributes & {
		data?: TDataType[];
		toolbar?: Snippet;
		thead?: Snippet;
		tbody?: Snippet<[TDataType, number]>;
		tfoot?: Snippet;
		statusbar?: Snippet;
		class?: string;
		tableContainerClass?: string;
		containerClass?: string;
	};
	const { data, toolbar, thead, tbody, tfoot, statusbar, class: tableClass = '', tableContainerClass = '', containerClass = '', ...attributes }: Props = $props();

	const table = getTable<TDataType>();
</script>

<div class={combineClasses('slc-table-main', containerClass)}>
	{#if toolbar}
		{@render toolbar()}
	{/if}
	<div class={combineClasses('slc-table-container', tableContainerClass)}>
		<div style:display={table.data.length > 0 ? 'none' : 'flex'} class="pointer-events-none absolute z-50 flex h-full w-full items-center justify-center bg-transparent">Gösterilecek veri yok.</div>
		<table
			bind:this={table.element}
			style:scroll-padding-block="35px 35px"
			style:scroll-padding-inline="50px 50px"
			style:grid-template-rows={`repeat(1, ${table.settings.theadRowHeight}) ${table.data && table.data.length > 0 ? `repeat(${table.data.length}, ${table.settings.tbodyRowHeight})` : `repeat(1, ${table.settings.tbodyRowHeight})`} ${tfoot && table.settings.footers && table.settings.footers?.length === 1 ? `repeat(${table.settings.footers?.length}, ${table.settings.tfootRowHeight})` : ''}`}
			style:grid-template-columns={`${table.settings?.columnSelect ? '50px' : ''} ${table.columns?.map((col) => (col.width ? col.width : '100px')).join(' ')} ${table.settings?.columnAction ? '50px' : ''}`}
			class={combineClasses('slc-table', tableClass)}
			{...attributes}
		>
			{#if thead}
				<thead class="contents">
					{@render thead()}
				</thead>
			{/if}
			{#if tbody}
				<tbody class="contents">
					{#if table.data}
						{#each table.data as row, rowIndex}
							{@render tbody(row, rowIndex)}
						{/each}
					{/if}
				</tbody>
			{/if}
			{#if tfoot && table.settings.footers?.length === 1}
				<tfoot class="contents">
					{#each table.settings.footers as foot, footIndex}
						{@render tfoot()}
					{/each}
				</tfoot>
			{/if}
		</table>
	</div>
	{#if statusbar}
		{@render statusbar()}
	{/if}
	<button onclick={() => table.testDeleteRow()}>Data Delete</button>
	<button onclick={() => table.testVisibleColumn()}>setLastNameVisible</button>
</div>

<style lang="postcss">
	.slc-table-main {
		@apply flex h-full w-full flex-col overflow-hidden;
	}
	.slc-table-container {
		@apply relative flex-1 overflow-hidden;
	}
	.slc-table {
		@apply grid h-full w-full overflow-auto bg-surface-50;
	}
</style>
