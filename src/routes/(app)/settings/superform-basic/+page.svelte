<script lang="ts">
	import { DataTable } from '$lib/components/base/data-table';
	import { createTable, type Sources } from '$lib/components/base/data-table/tables.svelte';
	import utils from '$lib/utils';

	import type { ProducedGrapes } from '$lib/dev/schemaProducedGrapes';

	console.log(utils.turkishLowerCase('ğüşiöç ĞÜŞİÖÇ iİ ıI'));

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

	// $inspect('$inspect-rowIndices', table.rowIndices);

	/* table.onCellFocusChange((params) => {
		const { rowIndex, colIndex } = params;
		console.log('onCellFocusChange', rowIndex, colIndex);
	}); */
	/* table.onRowSelectionChange((params) => {
		const { selectedRows } = params;
		console.log('onRowSelectionChange', selectedRows);
	}); */
	/* table.onCellEdit((params) => {
		const { newValue, oldValue, rowIndex, colIndex, field } = params;
		console.log('onCellEdit', newValue, oldValue, rowIndex, colIndex, field);
	}); */
	/* table.onColumnResize((params) => {
		const { coi, width, field } = params;
		console.log('onColumnResize', coi, width, field);
	}); */
	/* table.onVirtualDataChange((params) => {
		const { visibleStart, visibleEnd, overscanStart, overscanEnd, scrollTop, clientHeight, focusedCellRowIndex } = params;
		console.log('onVirtualDataChange', visibleStart, visibleEnd, overscanStart, overscanEnd, scrollTop, clientHeight, focusedCellRowIndex);
	}); */
	/* table.onTableAction((params) => {
		const { action } = params;
		console.log('onTableAction', action);
	}); */
	/* table.onRowAction((params) => {
		const { rowIndex, action } = params;
		console.log('onRowAction', rowIndex, action);
	}); */
</script>

<DataTable {sources} />
