<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import {
		DataTable,
		createTable,
		type Sources
	} from '$lib/components/base/data-table';
	import { generateProducedData } from '$lib/client/demo/produced-grapes-generate-data';

	import type { ProducedGrapes } from '$lib/client/demo/produced-grapes-schema';

	// initial sources setup
	const sources: Sources<ProducedGrapes> = {
		id: 'table22',
		data: generateProducedData(1000),
		rowSelection: 'multiple-all',
		rowAction: true,
		subtotal: true,
		zebra: false,
		hoverableRows: false,
		actions: {
			tableActions: [
				{ label: 'Ekle', action: 'add' },
				{ label: 'Seçili Satırları Sil', action: 'delete_all' },
				{ label: 'Excel', action: 'excel' }
			],
			rowActions: [
				{ label: 'Düzenle', action: 'edit' },
				{ label: 'Sil', action: 'delete' },
				{ label: 'Detay', action: 'detail' }
			]
		},
		columns: [
			{
				field: 'subtotal',
				label: 'Sub Total',
				width: 'minmax(75px,1fr)',
				hidden: true
			},
			{
				field: 'order',
				label: 'Order',
				width: 'minmax(75px,1fr)',
				hidden: false,
				resizeable: true
			},
			{
				field: 'producer',
				label: 'Producer (editable)',
				width: 'minmax(75px,1fr)',
				editable: true,
				hidden: false,
				resizeable: true
			},
			{
				field: 'province',
				label: 'Province (editable)',
				width: 'minmax(75px,1fr)',
				editable: true,
				resizeable: true
			},
			{
				field: 'district',
				label: 'District',
				width: 'minmax(75px,1fr)',
				resizeable: true,
				hidden: true
			},
			{
				field: 'village',
				label: 'Village (editable)',
				width: 'minmax(75px,1fr)',
				editable: true,
				resizeable: true
			},
			{
				field: 'grape',
				label: 'Grape',
				width: 'minmax(75px,1fr)',
				resizeable: true
			},
			{
				field: 'grapeColor',
				label: 'Grape Color',
				width: 'minmax(75px,1fr)',
				hidden: false,
				resizeable: true
			},
			{
				field: 'quantity',
				label: 'Quantity',
				align: 'right',
				width: 'minmax(75px,1fr)',
				editable: false,
				resizeable: true
			},
			{
				field: 'price',
				label: 'Price',
				align: 'right',
				width: 'minmax(75px,1fr)',
				resizeable: true
			},
			{
				field: 'amount',
				label: 'Amount',
				align: 'right',
				width: 'minmax(75px,1fr)',
				resizeable: true
			}
		],
		footers: [{ order: 'any footer' }, { quantity: 'maybe sum' }]
	};

	const table = createTable<ProducedGrapes>(sources);

	table.onCellFocusChange((data) => {
		console.log('onCellFocusChange', data);
	});
	table.onRowSelectionChange((data) => {
		console.log('onRowSelectionChange', data);
	});
	table.onCellEdit((data) => {
		console.log('onCellEdit', data);
	});
	table.onColumnResize((data) => {
		console.log('onColumnResize', data);
	});
	table.onVirtualDataChange((data) => {
		console.log('onVirtualDataChange', data);
	});
	table.onTableAction((data) => {
		console.log('onTableAction', data);
		switch (data.action) {
			case 'add':
				console.log('Add new row');
				break;
			case 'delete_all':
				console.log('Delete selected rows');
				break;
			case 'excel':
				console.log('Export to Excel');
				break;
			default:
				console.error('Unknown table action: ' + data.action);
		}
	});
	table.onRowAction((data) => {
		switch (data.action) {
			case 'edit':
				console.log('Edit rowIndex: ' + data.rowIndex);
				break;
			case 'delete':
				console.log('Delete rowIndex: ' + data.rowIndex);
				break;
			case 'detail':
				console.log('Detail rowIndex: ' + data.rowIndex);
				break;
			default:
				console.error('Unknown table action: ' + data.action);
		}
	});

	// $inspect('$inspect-rowIndices', table.rowIndices);
</script>

<Head>
	<title>Data Table - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<!-- <Page.Header>
		<p>Header</p>
	</Page.Header> -->
	<Page.Main>
		<Page.Main.Table>
			<DataTable {sources} />
		</Page.Main.Table>
	</Page.Main>
	<!-- <Page.Footer>
		<p>Footer</p>
	</Page.Footer> -->
</Page>
