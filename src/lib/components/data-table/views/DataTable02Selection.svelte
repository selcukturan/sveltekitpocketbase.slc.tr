<!-- BaseDataTableView.svelte -->
<script lang="ts" generics="TData extends Row">
	import { getTable, type Sources, type Row } from '../tables.svelte';
	import { Table, Th, Td, Tf, Trh, Trd, Trf, SelectionCell, ActionCell } from '..';

	const { sources: src }: { sources: Sources<TData> } = $props();
	const table = getTable<TData>(src.id);
	// $inspect('$inspect-virtualData', table.virtualData);
	// $inspect('$inspect-focusedCell', table.focusedCell);
	// $inspect('$inspect-selectedRows', table.selectedRows);
</script>

<div class="s" style:display="contents">
	<Table {src}>
		{#snippet thead()}
			<Trh {src}>
				<SelectionCell type="header" {src} />
				{#each table.visibleColumns as col, ci (ci)}
					{@const header = col.label}
					<Th {src} {col} {ci}>
						{header}
					</Th>
				{/each}
				<ActionCell type="header" {src} />
			</Trh>
		{/snippet}
		{#snippet tbody(row, ri)}
			<Trd {src} {row} {ri}>
				<SelectionCell type="cell" {src} {row} {ri} />
				{#each table.visibleColumns as col, ci (ci)}
					{@const cell = row[col.field]}
					<Td {src} {col} {ci} {row} {ri}>
						{#if col.field === 'grapeColor'}
							<input type="checkbox" name={`name_${ri}_${ci}`} id={`id_${ri}_${ci}`} tabindex="0" />
							{cell}
						{:else}
							{cell}
						{/if}
					</Td>
				{/each}
				<ActionCell type="cell" {src} {row} {ri} />
			</Trd>
		{/snippet}
		{#snippet tfoot(foot, fi)}
			<Trf {src} {fi}>
				<SelectionCell type="footer" {src} {foot} {fi} />
				{#each table.visibleColumns as col, ci (ci)}
					{@const footer = foot[col.field]}
					<Tf {src} {col} {ci} {foot} {fi}>
						{footer}
					</Tf>
				{/each}
				<ActionCell type="footer" {src} {foot} {fi} />
			</Trf>
		{/snippet}
	</Table>
</div>

<style>
	/**
	* https://svelte.dev/docs/svelte/global-styles#:global()
	* 
	* p:global(.big.red) { ... } 
	* Bu, bu bileşenin içindeki <p> etiketlerine, eğer bu etiketler class="big red" niteliklerine sahipse, stil uygular. 
	* :global(.big.red) ifadesi, bu sınıfların global olarak tanımlanmış olmasını gerektirmez.
	* Yani, bu sınıflar başka bir yerde tanımlanmış olsa bile, bu bileşenin içindeki <p> etiketleri bu stilleri alacaktır.
	* 
	*/

	/*######################### Style Format Of This TableView Only #########################
	.s:global(.s <your-table-selector>) {
		<your-style>
	}
	#######################################################################################*/
	/*######################### Svelte Class Output (hOumoZ895V2d = Random) ################
	.s.s-hOumoZ895V2d.s [data-scope='table']
	#######################################################################################*/

	/** Table */
	.s:global(.s [data-scope='table']) {
		background-color: hsl(var(--surface-50));
	}

	/********** BEGIN Rows */
	.s:global(.s [data-scope='trh']) {
		/* Header */
		outline: none;
	}
	.s:global(.s [data-scope='trd']) {
		/* Data */
		outline: none;
	}
	.s:global(.s [data-scope='trf']) {
		/* Footer */
		outline: none;
	}
	/********** END Rows */

	/********** BEGIN Cells */
	.s:global(.s [data-scope='th']) {
		/* Header */
		border-right: 1px solid hsl(var(--surface-200));
		border-bottom: 1px solid hsl(var(--surface-200));
		background-color: hsl(var(--surface-100));
	}
	.s:global(.s [data-scope='td']) {
		/* Data */
		border-right: 1px solid hsl(var(--surface-200));
		border-bottom: 1px solid hsl(var(--surface-200));
		background-color: hsl(var(--surface-50));
	}
	.s:global(.s [data-scope='tf']) {
		/* Footer */
		border-right: 1px solid hsl(var(--surface-200));
		border-bottom: 1px solid hsl(var(--surface-200));
		background-color: hsl(var(--surface-100));
	}
	/********** END Cells */

	/** Focused Cell */
	.s:global(.s [data-scope='td'][data-focused]) {
		outline-color: #f59e0b;
	}

	/** Selection Column Checkboxs */
	.s:global(.s [data-scope='th'][data-part='selection-checkbox']),
	.s:global(.s [data-scope='td'][data-part='selection-checkbox']) {
		/* .s:global(.s [data-scope='th'][data-part='selection-checkbox'][aria-checked='true']) */
		/* .s:global(.s [data-scope='th'][data-part='selection-checkbox'][aria-checked='mixed']) */
		/* .s:global(.s [data-scope='td'][data-part='selection-checkbox'][aria-checked='true']) */
		background-color: hsl(var(--surface-300));
	}
	.s:global(.s [data-scope='td'][data-part='selection-checkbox']:focus-visible) {
		background-color: hsl(var(--surface-500));
	}

	/** Action Column Parts */
	/* Trigger */
	.s:global(.s [data-scope='th'][data-part='action-trigger']),
	.s:global(.s [data-scope='td'][data-part='action-trigger']) {
		background-color: hsl(var(--surface-200));
	}
	.s:global(.s [data-scope='th'][data-part='action-trigger']:focus-visible),
	.s:global(.s [data-scope='td'][data-part='action-trigger']:focus-visible) {
		background-color: hsl(var(--surface-400));
	}
	.s:global(.s [data-scope='th'][data-part='action-trigger']:hover),
	.s:global(.s [data-scope='td'][data-part='action-trigger']:hover) {
		background-color: hsl(var(--surface-300));
	}
	/* Popup */
	.s:global(.s [data-scope='th'][data-part='action-popup']),
	.s:global(.s [data-scope='td'][data-part='action-popup']) {
		border: 1px solid hsl(var(--surface-300));
		background-color: hsl(var(--surface-50));
	}
	/* Popup Item */
	.s:global(.s [data-scope='th'][data-part='action-popup-item']),
	.s:global(.s [data-scope='td'][data-part='action-popup-item']) {
		background-color: hsl(var(--surface-100));
	}
	.s:global(.s [data-scope='th'][data-part='action-popup-item'][data-action='delete_all']) {
		background-color: hsl(var(--secondary-100));
	}
	.s:global(.s [data-scope='td'][data-part='action-popup-item'][data-action='delete']) {
		background-color: hsl(var(--primary-100));
	}
	.s:global(.s [data-scope='th'][data-part='action-popup-item']:hover),
	.s:global(.s [data-scope='td'][data-part='action-popup-item']:hover) {
		background-color: hsl(var(--error-200));
	}
</style>
