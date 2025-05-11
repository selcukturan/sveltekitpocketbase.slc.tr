<script lang="ts">
	import { DataTable } from '$lib/components/base/data-table';
	import { createTable, type Sources } from '$lib/components/base/data-table/tables.svelte';
	import utils from '$lib/utils';

	import type { ProducedGrapes } from '$lib/dev/schemaProducedGrapes';

	// initial sources setup
	const sources: Sources<ProducedGrapes> = {
		id: 'table22',
		data: utils.generateExampleData(1000),
		rowSelection: 'multiple-all',
		rowAction: true,
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
			{ field: 'order', label: 'Order', width: 'minmax(75px,1fr)', hidden: true },
			{ field: 'producer', label: 'Producer', width: 'minmax(75px,1fr)', editable: true, hidden: false },
			{ field: 'province', label: 'Province', width: 'minmax(75px,1fr)', editable: true, resizeable: true },
			{ field: 'district', label: 'District', width: 'minmax(75px,1fr)', resizeable: true, hidden: true },
			{ field: 'village', label: 'Village', width: 'minmax(75px,1fr)', editable: true, resizeable: true },
			{ field: 'grape', label: 'Grape', width: 'minmax(75px,1fr)', resizeable: true },
			{ field: 'grapeColor', label: 'Grape Color', width: 'minmax(75px,1fr)', hidden: false },
			{ field: 'quantity', label: 'Quantity', align: 'right', width: 'minmax(75px,1fr)', editable: true, resizeable: true },
			{ field: 'price', label: 'Price', align: 'right', width: 'minmax(75px,1fr)' },
			{ field: 'amount', label: 'Amount', align: 'right', width: 'minmax(75px,1fr)' }
		],
		footers: [{ order: 'f1' }, { quantity: 'sum' }]
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
	});
	table.onRowAction((data) => {
		console.log('onRowAction', data);
	});

	// $inspect('$inspect-rowIndices', table.rowIndices);
</script>

<DataTable {sources} />
