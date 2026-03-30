<script lang="ts">
	import { Page, Head } from '$lib/components/templates';

	import * as s from '$lib/components/base/datatable';

	const myTestData = {
		page: 1,
		perPage: 10,
		totalItems: 100,
		totalPages: 10,
		items: [
			{
				id: '1',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '2',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '3',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '4',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '5',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '6',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '7',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '8',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '9',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '10',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '11',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '12',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '13',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '14',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '15',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '16',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '17',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '18',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '19',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '20',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '21',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '22',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '23',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '24',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '25',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '26',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '27',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '28',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '29',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			},
			{
				id: '30',
				title: 'title',
				caption: 'caption',
				quantity: 'quantity',
				purchase_date: 'purchase_date'
			}
		]
	};

	// ----------- Begin Data Table Logic ------------------------------------------------------------------------------------------------------------
	type ItemType = (typeof myTestData.items)[number];
	let datatable: s.DataTable<ItemType> | undefined = $state(undefined);
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

<Head>
	<title>Crud - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Crud Page Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<s.DataTable bind:this={datatable} data={myTestData} {columns} {footers} pending={false}>
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
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Crud Page Footer</p>
	</Page.Footer>
</Page>
