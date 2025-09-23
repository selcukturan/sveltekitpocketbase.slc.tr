<script lang="ts">
	import type { TestDatatableResponse } from '$lib/client/types/pocketbase-types';
	import { getFullList } from '$lib/remotes/testDataTable.remote';
	import { page } from '$app/state';

	import {
		DataTable,
		createTable,
		type Sources
	} from '$lib/components/base/data-table';
	import { goto } from '$app/navigation';

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

	// $inspect('$inspect-rowIndices', table.rowIndices);

	const hash = $derived(page.url.hash);

	/**
	 * &filter=status%3D"active"+%26%26+caption%3D"User+1"
	 * &sort=-%40rowid
	 */
	const hashServerFilter = $derived(hash);
	let aPromise = $derived(getFullList(hashServerFilter));
	const filteredData = $derived(await aPromise);
	/**
	 * &recordId=%3Auser%3Aad960bad-b126-4167-9f27-9974d676121c
	 */
	// const hashClientAction = $derived(hash);
	// const dataAction = $derived(await getOne(hashClientAction));

	$effect(() => {
		table.setSource('data', filteredData.items);
	});
	$inspect('hash', hash);

	function changeHash(newHash: string) {
		if (page.url.hash.replace('#', '') !== newHash) {
			goto(`#${newHash}`);
		}
	}

	/* beforeNavigate(({ cancel }) => {
		cancel();
	}); */
</script>

<div class="flex h-full flex-col">
	<div>
		<a href="#Canan" class="bg-warning-300 p-3">FF-1</a>
		<span> | </span>
		<button onclick={() => changeHash(`Selin`)} class="bg-warning-300 p-3"
			>FF-2</button
		>
		<span> | </span>
		<button onclick={() => changeHash(``)} class="bg-warning-300 p-3"
			>FF-3</button
		>
		<span> | </span>
		<button
			onclick={() => getFullList(hash).refresh()}
			class="bg-warning-300 p-3"
		>
			RRRR
		</button>
	</div>
	<div class="h-full flex-1 overflow-hidden">
		<DataTable {sources} />
	</div>
</div>
