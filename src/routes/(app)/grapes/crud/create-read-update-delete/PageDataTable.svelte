<script>
	import { Boundary } from '$lib/components/base/boundary';
	import * as s from '$lib/components/base/datatable';
	// Remote functions
	import { getList } from './page.remote';

	// ----------- Begin Data Table Logic ------------------------------------------------------------------------------------------------------------
	type ItemType = Awaited<ReturnType<typeof getList>>['items'][number];
	let dataTable: s.DataTable<ItemType> | undefined = $state(undefined);
	let columns: s.Column<ItemType>[] = [
		{ field: 'id', label: 'id', width: 'minmax(50px,1fr)' },
		{ field: 'title', label: 'title', width: 'minmax(50px,1fr)' },
		{ field: 'caption', label: 'caption', width: 'minmax(50px,1fr)' },
		{ field: 'quantity', label: 'quantity', width: 'minmax(50px,1fr)' },
		{ field: 'purchase_date', label: 'purchase_date', width: 'minmax(50px,1fr)' }
	];
	let footers: s.Footer<ItemType>[] = [{ caption: 'x1' }, { quantity: 'x2' }];
	// ----------- End Data Table Logic ------------------------------------------------------------------------------------------------------------
</script>

<Boundary>
	{@const data = (await getList(params)).items}
	<s.DataTable bind:this={dataTable} {data} {columns} {footers}>
		{#snippet headerRow(hr)}
			<s.HeaderRow {hr}>
				{#snippet headerCell(hc)}
					<s.HeaderCell {hr} {hc}>
						{hc}
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
</Boundary>
