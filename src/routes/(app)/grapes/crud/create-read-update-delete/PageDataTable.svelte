<script lang="ts">
	/* import DataTableWrapper from '$lib/components/base/datatable/DataTableWrapper.svelte'; */
	import * as s from '$lib/components/base/datatable';
	import { getFullList } from '$lib/remotes/tabulator.remote';

	let promise = $derived(getFullList(''));
	let results = $derived(await promise);
	let items = $derived(results.items);

	type ItemsType = (typeof items)[number];

	let columns = $state<s.Column<ItemsType>[]>([
		{ field: 'id', label: 'id', width: 'minmax(50px,1fr)' },
		{ field: 'amount', label: 'amount', width: 'minmax(50px,1fr)' },
		{ field: 'price', label: 'price', width: 'minmax(50px,1fr)' },
		{ field: 'kn', label: 'kn', width: 'minmax(50px,1fr)' }
	]);
	let footers = $state<s.Footer<ItemsType>[]>([
		{ amount: 'x1' },
		{ price: 'x2' }
	]);
</script>

<!-- <DataTableWrapper results={items} /> -->

<div class="s" style:display="contents">
	<s.DataTable {items} {columns} {footers}>
		{#snippet headerRow(hr)}
			<s.HeaderRow {hr}>
				{#snippet headerCell(hc)}
					<s.HeaderCell {hr} {hc}>
						{hc.label}
					</s.HeaderCell>
				{/snippet}
			</s.HeaderRow>
		{/snippet}

		{#snippet dataRow(dr)}
			<s.DataRow {dr}>
				{#snippet dataCell(dc)}
					<s.DataCell {dr} {dc}>
						{dc.value}
					</s.DataCell>
				{/snippet}
			</s.DataRow>
		{/snippet}

		{#snippet footerRow(fr)}
			<s.FooterRow {fr}>
				{#snippet footerCell(fc)}
					<s.FooterCell {fr} {fc}>
						{fc.value}
					</s.FooterCell>
				{/snippet}
			</s.FooterRow>
		{/snippet}
	</s.DataTable>
</div>

<style>
	/* .s:global(.s [data-slc-table]) {
		background-color: red;
	} */
</style>
