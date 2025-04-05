<script lang="ts" generics="TData extends Row">
	import { setTable, type Settings, type Row } from '../tables.svelte';
	import { Table, Th, Td, Tf, TrH, TrD, TrF } from '../';

	const { data, settings }: { data: TData[]; settings: Settings<TData> } = $props();

	const table = setTable<TData>(data, settings);

	$effect(() => {
		if (data) table.setData = data;
		if (settings) table.setSettings = settings;
	});
</script>

<Table {data}>
	{#snippet toolbar()}
		<p class="hidden">Table Toolbar</p>
	{/snippet}
	{#snippet thead()}
		<TrH>
			{#each table.columns as col, ci (col.field)}
				<Th {data} {col} {ci}>
					{col.label}
				</Th>
			{/each}
		</TrH>
	{/snippet}
	{#snippet tbody(row, ri)}
		<TrD {row} {ri}>
			{#each table.columns as col, ci (col.field)}
				<Td {col} {ci} {row} {ri}>
					{row[col.field]}
				</Td>
			{/each}
		</TrD>
	{/snippet}
	{#snippet tfoot(foot, fi)}
		<TrF {data} {fi}>
			{#each table.columns as col, ci (col.field)}
				<Tf {data} {col} {ci} {foot} {fi}>
					{foot[table.columns[ci].field]}
				</Tf>
			{/each}
		</TrF>
	{/snippet}
	{#snippet statusbar()}
		<p class="hidden">Table Statusbar</p>
	{/snippet}
</Table>
