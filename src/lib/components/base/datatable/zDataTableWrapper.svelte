<!-- BaseDataTableView.svelte -->
<script lang="ts" generics="TData extends Record<string, unknown>">
	// import { Table, Th, Td, Tf, Trh, Trd, Trf, SelectionCell, ActionCell } from '..';

	const { results }: { results: TData[] } = $props();
</script>

<div class="s" style:display="contents">
	<DataTable {results}>
		{#snippet header(params)}
			<HeaderRow {src}>
				{#each table.visibleColumns as col, ci (ci)}
					{@const header = col.label}
					<HeaderCell {src} {col} {ci}>
						{header}
					</HeaderCell>
				{/each}
			</HeaderRow>
		{/snippet}
		{#snippet data(params)}
			<DataRow {src} {row} {ri}>
				{#each table.visibleColumns as col, ci (ci)}
					{@const cell = row[col.field]}
					<DataCell {src} {col} {ci} {row} {ri}>
						{#if col.field === 'grapeColor'}
							<input type="checkbox" name={`name_${ri}_${ci}`} id={`id_${ri}_${ci}`} tabindex="0" />
							{cell}
						{:else}
							{cell}
						{/if}
					</DataCell>
				{/each}
			</DataRow>
		{/snippet}
		{#snippet footer(params)}
			<FooterRow {src} {fi}>
				{#each table.visibleColumns as col, ci (ci)}
					{@const footer = foot[col.field]}
					<FooterCell {src} {col} {ci} {foot} {fi}>
						{footer}
					</FooterCell>
				{/each}
			</FooterRow>
		{/snippet}
	</DataTable>
</div>
