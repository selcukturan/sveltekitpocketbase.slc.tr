<script lang="ts">
	import type { TestDatatableResponse } from '$lib/client/types/pocketbase-types';
	import { getFullList } from '$lib/remotes/testDataTable.remote';
	import {
		DataTable,
		createTable,
		type Sources
	} from '$lib/components/base/data-table';
	import { type FilterDerived } from '$lib/client/utils/filter-string-helper';

	import { page } from '$app/state';
	import { Navigator } from '$lib/client/app/navigator.svelte';

	type FilterInput = {
		producer: string;
		quantity: number;
	};
	const navigator = new Navigator<FilterInput>(page.url.hash, {
		producer: 'taş',
		quantity: 22
	});

	// initial sources setup
	const sources: Sources<TestDatatableResponse> = {
		id: 'table22',
		data: [],
		rowSelection: 'multiple-all',
		rowAction: true,
		subtotal: false,
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
				field: 'grape_color',
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

	const table = createTable<TestDatatableResponse>(sources);

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

	$inspect('navigator.filterInput', navigator.filterInput);

	const filter = $derived(await getFullList(navigator.currentHash));

	$effect(() => {
		table.setSource('data', filter.items);
	});
</script>

<div class="flex h-full flex-col">
	<div>
		<input
			type="text"
			bind:value={navigator.filterInput.producer}
			class="border"
		/>
		<button
			onclick={() => navigator.triggerFilter(navigator.filterDerived)}
			class="bg-warning-300 p-3">getFilter</button
		>
		<span> | </span>
		<button
			onclick={() => getFullList(navigator.currentHash).refresh()}
			class="bg-warning-300 p-3"
		>
			RRRR
		</button>
	</div>
	<div class="h-full flex-1 overflow-hidden">
		<DataTable {sources} />
	</div>
</div>
