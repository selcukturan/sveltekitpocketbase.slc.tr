<script lang="ts" generics="TDataType extends TableDataRowType">
	import type { SettingsType, TableDataRowType } from '../types';
	import { toNumber, calcAverage, calcSum, getStr } from '../utils';
	import { setTable } from '../tables.svelte';
	import { Table, Th, Td, Tf, TrH, TrD, TrF } from '..';

	const { data, settings }: { data: TDataType[]; settings: SettingsType } = $props();
	const table = setTable<TDataType>(data, settings);
	$effect(() => {
		table.setData = data;
		table.setSettings = settings;
	});
</script>

<Table {data}>
	{#snippet thead()}
		{#if table.columns}
			<TrH>
				{#if table.settings.columnSelect}
					<Th>F</Th>
				{/if}
				{#each table.columns as col, ci}
					<Th {col} {ci}>
						{col.label}
					</Th>
				{/each}
				{#if table.settings.columnAction}
					<Th>L</Th>
				{/if}
			</TrH>
		{/if}
	{/snippet}
	{#snippet tbody(row, ri)}
		{#if table.columns}
			<TrD {row} {ri}>
				{#if table.settings.columnSelect}
					<Td {ri} ci={-1}>
						<input tabindex="-1" type="checkbox" name={`nameCheckbox${ri}`} id={`idCheckbox${ri}`} />
					</Td>
				{/if}
				{#each table.columns as col, ci}
					<Td {col} {ci} {row} {ri}>
						{row[col.field]}
					</Td>
				{/each}
				{#if table.columns && table.settings.columnAction}
					<Td {ri} ci={table.columns.length}>
						<button tabindex="-1" name={`nameButton${ri}`} id={`idButton${ri}`} onclick={() => alert('test')}>...</button>
					</Td>
				{/if}
			</TrD>
		{/if}
	{/snippet}
	{#snippet tfoot()}
		{#if table.columns}
			<TrF>
				{#if table.settings.columnSelect}
					<Tf>F</Tf>
				{/if}
				{#each table.columns as col, ci}
					<Tf {col} {ci}>
						{#if table.settings.footers && table.settings.footers[0][col.field]?.startsWith('sum')}
							Sum: {''}
						{:else if table.settings.footers && table.settings.footers[0][col.field]?.startsWith('avg')}
							Avg: {''}
						{:else if table.settings.footers && table.settings.footers[0][col.field]?.startsWith('cnt')}
							Cnt: {table.data.length}
						{:else if table.settings.footers && table.settings.footers[0][col.field]?.startsWith('str')}
							{getStr(table.settings.footers[0][col.field])}
						{:else}
							{''}
						{/if}
					</Tf>
				{/each}
				{#if table.settings.columnAction}
					<Tf>L</Tf>
				{/if}
			</TrF>
		{/if}
	{/snippet}
	{#snippet statusbar()}
		<button onclick={() => table.testDeleteRow()}>Data Delete</button>
		<button onclick={() => table.testVisibleColumn()}>setLastNameVisible</button>
	{/snippet}
</Table>
