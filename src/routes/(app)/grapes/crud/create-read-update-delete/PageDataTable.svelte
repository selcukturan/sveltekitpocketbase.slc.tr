<script lang="ts">
	/* import DataTableWrapper from '$lib/components/base/datatable/DataTableWrapper.svelte'; */
	import * as d from '$lib/components/base/datatable';
	import { getFullList } from '$lib/remotes/tabulator.remote';

	let promise = $derived(getFullList(''));
	let results = $derived(await promise);
	let items = $derived(results.items);

	type ItemsType = (typeof items)[number];

	let columns = $state<d.Column<ItemsType>[]>([
		{ field: 'id', label: 'Grape Name' },
		{ field: 'amount', label: 'Grape Color' },
		{ field: 'price', label: 'Grape Price' },
		{ field: 'kn', label: 'Grape Stock' }
	]);
	let footers = $state<d.Footer<ItemsType>[]>([{ amount: 'x1' }, { price: 'x2' }]);
</script>

<!-- <DataTableWrapper results={items} /> -->

<d.DataTable {items} {columns} {footers}>
	{#snippet header(p)}
		<d.HeaderRow {...p}>
			{#each p.columns as col, colVisibleIndex (col.data.field)}
				{@const cellContent = col.data.label}
				<d.HeaderCell {...p} {col} {colVisibleIndex}>{cellContent}</d.HeaderCell>
			{/each}
		</d.HeaderRow>
	{/snippet}

	{#snippet data(p)}
		<d.DataRow {...p}>
			{#each p.columns as col, colVisibleIndex (col.data.field)}
				{@const cellContent = p.row[col.data.field]}
				<d.DataCell {...p} {col} {colVisibleIndex}>{cellContent}</d.DataCell>
			{/each}
		</d.DataRow>
	{/snippet}

	{#snippet footer(p)}
		<d.FooterRow {...p}>
			{#each p.columns as col, colVisibleIndex (col.data.field)}
				{@const cellContent = p.footerRow[col.data.field]}
				<d.FooterCell {...p} {col} {colVisibleIndex}>{cellContent}</d.FooterCell>
			{/each}
		</d.FooterRow>
	{/snippet}
</d.DataTable>
