<script lang="ts">
	import { BasicDataTable } from '$lib/components/base/data-table-tanstack/provider';

	import common from '$lib/utils/common';
	import { type Sources } from '$lib/components/data-table/views';
	import { createTable } from '$lib/components/data-table/tables.svelte';

	import type { ProducedGrapes } from '$lib/dev/schemaProducedGrapes';

	// initial sources setup
	const sources: Sources<ProducedGrapes> = {
		id: 'table22',
		data: common.generateExampleData(1000),
		enableVirtualization: true,
		rowSelection: 'none',
		rowAction: false,
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
			{ field: 'order', label: 'Order', width: 'minmax(75px,1fr)' },
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

	$inspect('$inspect-virtualData', table.virtualData);
</script>

<BasicDataTable sources={table.get} />
