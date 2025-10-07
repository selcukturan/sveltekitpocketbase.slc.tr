<script lang="ts">
	import type { TestSubtotalViewResponse } from '$lib/client/types/pocketbase-types';
	import { getFullListSubTotal } from '$lib/remotes/testDataTable.remote';

	import {
		DataTable,
		createTable,
		type Sources
	} from '$lib/components/base/data-table';

	// initial sources setup
	const sources: Sources<TestSubtotalViewResponse> = {
		id: 'table23',
		data: [],
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
				label: 'Subtotal',
				width: '100px',
				hidden: false,
				resizeable: true
			},
			{
				field: 'kn',
				label: 'KN',
				width: '100px',
				editable: true,
				resizeable: true,
				align: 'right'
			},
			{
				field: 'kt',
				label: 'KT',
				width: '120px',
				editable: true,
				resizeable: true
			},
			{
				field: 'producer',
				label: 'Producer',
				width: '200px',
				editable: false,
				resizeable: true
			},
			{
				field: 'region',
				label: 'Region',
				width: '200px',
				resizeable: true
			},
			{
				field: 'note',
				label: 'Note',
				width: '200px',
				hidden: false,
				editable: true,
				resizeable: true
			},
			{
				field: 'kg',
				label: 'KG',
				align: 'right',
				width: '200px',
				editable: true,
				resizeable: true
			}
		]
	};

	const table = createTable<TestSubtotalViewResponse>(sources);

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

	/* const fullList = $derived(await getFullList());
	$inspect('fullList', fullList); */

	let promise = $derived(getFullListSubTotal(''));
	let filter = $derived(await promise);

	$effect(() => {
		table.setSource('data', filter.items);
	});
</script>

<DataTable {sources} />
