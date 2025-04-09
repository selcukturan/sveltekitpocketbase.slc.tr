<!-- BaseDataTableView.svelte -->
<script lang="ts" generics="TData extends Row">
	import { getTable, type Sources, type Row } from '../tables.svelte';
	import { Table, Th, Td, Tf, Trh, Trd, Trf, SelectionCell, ActionCell } from '..';

	const { sources: src }: { sources: Sources<TData> } = $props();
	const table = getTable<TData>(src.id);
	// $inspect('$inspect-virtualData', table.virtualData);
	// $inspect('table.rowOverscanStartIndexState', table.rowIndices.visibleStart);
	// $inspect('table.rowOverscanEndIndexState', table.rowIndices.visibleEnd);
	// $inspect('$inspect-focusedCell', table.focusedCell);
	// $inspect('$inspect-selectedRows', table.selectedRows);
</script>

<div class="s" style:display="contents">
	<Table {src}>
		{#snippet thead()}
			<Trh {src}>
				<SelectionCell type="header" {src} />
				{#each table.visibleColumns as col, ci (col.oi)}
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
				{#each table.visibleColumns as col, ci (col.oi)}
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
				{#each table.visibleColumns as col, ci (col.oi)}
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
		outline: none;
		background-color: color-mix(in srgb, hsl(var(--surface-100)) 90%, hsl(var(--surface-50)) 10%);
	}
	.s:global(.s [data-scope='trd']) {
		outline: none;
		background-color: hsl(var(--surface-50));
	}
	/* .s:global(.s .slc-row-odd[data-scope='trd']) {
		background-color: color-mix(in srgb, hsl(var(--surface-100)) 90%, hsl(var(--surface-50)) 10%);
	} */
	.s:global(.s .slc-row-odd[data-scope='trd']:hover),
	.s:global(.s [data-scope='trd']:hover) {
		background-color: color-mix(in srgb, hsl(var(--surface-200)) 70%, hsl(var(--surface-50)) 30%);
	}
	.s:global(.s [data-scope='trd'][aria-selected='true']) {
		background-color: hsl(var(--primary-200)) !important;
	}
	.s:global(.s [data-scope='trf']) {
		outline: none;
		background-color: color-mix(in srgb, hsl(var(--surface-100)) 90%, hsl(var(--surface-50)) 10%);
	}
	/********** END Rows */

	/********** BEGIN Cells */
	.s:global(.s [data-scope='th']) {
		/* Header */
		border-color: hsl(from hsl(var(--surface-300)) h s l / 0.4);
		border-right-width: 0px;
		border-bottom-width: 1px;

		background-color: inherit;
		/* background-color: hsl(var(--secondary-100)); */
		/* background-color: hsl(from hsl(var(--secondary-500)) h s l / 0.5); */
		/* background-color: color-mix(in srgb, hsl(var(--secondary-500)) 80%, red 20%); */

		font-size: var(--text-sm) /* 0.875rem = 14px */;
		line-height: var(--tw-leading, var(--text-sm--line-height) /* calc(1.25 / 0.875) ≈ 1.4286 */);
		font-weight: var(--font-weight-bold) /* 700 */;
		color: hsl(var(--tertiary-950));
	}
	.s:global(.s [data-scope='th-resize']) {
		background-color: hsl(var(--surface-500));
	}

	.s:global(.s [data-scope='td']) {
		border-color: hsl(from hsl(var(--surface-300)) h s l / 0.5);
		background-color: inherit;
	}
	.s:global(.s [data-scope='td']:not([data-freezed])) {
		border-right-width: 1px;
		border-bottom-width: 1px;
	}

	.s:global(.s [data-scope='tf']) {
		/* Footer */
		border-color: hsl(from hsl(var(--surface-300)) h s l / 0.4);
		border-right-width: 0px;
		border-bottom-width: 0px;
		border-top-width: 1px;
		background-color: inherit;
		/* background-color: hsl(from hsl(var(--secondary-500)) h s l / 0.5); */

		font-size: var(--text-sm) /* 0.875rem = 14px */;
		line-height: var(--tw-leading, var(--text-sm--line-height) /* calc(1.25 / 0.875) ≈ 1.4286 */);
		font-weight: var(--font-weight-bold) /* 700 */;
		color: hsl(var(--quaternary-900));
	}
	/********** END Cells */

	/** Focused Cell */
	.s:global(.s [data-scope='td'][data-focused]) {
		outline-color: hsl(var(--secondary-800));
	}

	/** Selection Column Checkboxs */
	.s:global(.s [data-scope='th-selection'][data-part='checkbox']),
	.s:global(.s [data-scope='td-selection'][data-part='checkbox']) {
		/* .s:global(.s [data-scope='th-selection'][data-part='checkbox'][aria-checked='true']) */
		/* .s:global(.s [data-scope='th-selection'][data-part='checkbox'][aria-checked='mixed']) */
		/* .s:global(.s [data-scope='td-selection'][data-part='checkbox'][aria-checked='true']) */
		background-color: hsl(var(--surface-300));
	}
	.s:global(.s [data-scope='td-selection'][data-part='checkbox']:focus-visible) {
		background-color: hsl(var(--surface-500));
	}

	/** Action Column Parts */
	/* Trigger */
	.s:global(.s [data-scope='th-action'][data-part='trigger']),
	.s:global(.s [data-scope='td-action'][data-part='trigger']) {
		background-color: hsl(var(--surface-200));
	}
	.s:global(.s [data-scope='th-action'][data-part='trigger']:focus-visible),
	.s:global(.s [data-scope='td-action'][data-part='trigger']:focus-visible) {
		background-color: hsl(var(--surface-400));
	}
	.s:global(.s [data-scope='th-action'][data-part='trigger']:hover),
	.s:global(.s [data-scope='td-action'][data-part='trigger']:hover) {
		background-color: hsl(var(--surface-300));
	}
	/* Popup */
	.s:global(.s [data-scope='th-action'][data-part='popup']),
	.s:global(.s [data-scope='td-action'][data-part='popup']) {
		border: 1px solid hsl(var(--surface-300));
		background-color: hsl(var(--surface-50));
		margin-right: 5px;
		margin-top: -1px;
	}
	/* Popup Item */
	.s:global(.s [data-scope='th-action'][data-part='popup-item']),
	.s:global(.s [data-scope='td-action'][data-part='popup-item']) {
		background-color: hsl(var(--surface-100));
	}
	.s:global(.s [data-scope='th-action'][data-part='popup-item'][data-action='delete_all']) {
		background-color: hsl(var(--secondary-100));
	}
	.s:global(.s [data-scope='td-action'][data-part='popup-item'][data-action='delete']) {
		background-color: hsl(var(--primary-100));
	}
	.s:global(.s [data-scope='th-action'][data-part='popup-item']:hover),
	.s:global(.s [data-scope='td-action'][data-part='popup-item']:hover) {
		background-color: hsl(var(--error-200));
	}

	/** Freezed Columns */
	.s:global(.s [data-scope='th'][data-freezed='selection']),
	.s:global(.s [data-scope='td'][data-freezed='selection']),
	.s:global(.s [data-scope='tf'][data-freezed='selection']) {
		border-right-width: 5px;
	}
	.s:global(.s [data-scope='th'][data-freezed='action']),
	.s:global(.s [data-scope='td'][data-freezed='action']),
	.s:global(.s [data-scope='tf'][data-freezed='action']) {
		border-left-width: 5px;
	}

	.s:global(.s [data-scope='th'][data-freezed-action-before-cell]),
	.s:global(.s [data-scope='td'][data-freezed-action-before-cell]),
	.s:global(.s [data-scope='tf'][data-freezed-action-before-cell]) {
		border-right-color: transparent;
	}
</style>
