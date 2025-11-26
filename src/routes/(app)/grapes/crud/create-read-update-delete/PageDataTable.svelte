<script lang="ts" generics="TData">
	import { injectFilterData, getDefaultsFromSchema } from '$lib/utils/filter-string-helper';
	import { type ListParamsSchemaType, listParamsSchema } from './types';
	import { getFullList } from './page.remote';

	/* import type { ListResult } from 'pocketbase';
	import type { AppActionFailure } from '$lib/types';
	const {
		records,
		onselect,
		filter = ''
	}: {
		records: TData[] | ListResult<TData> | AppActionFailure;
		onselect?: (id: string) => void;
		filter?: string;
	} = $props(); */

	const listParamsDefaults = getDefaultsFromSchema(listParamsSchema);

	let filterData = $state<ListParamsSchemaType['filterData']>({
		title: listParamsDefaults.filterData.title ?? '',
		quantity: listParamsDefaults.filterData.quantity ?? 0
	});
	let params = $state.raw(injectFilterData(listParamsSchema, filterData));

	const getData = () => {
		params = injectFilterData(listParamsSchema, filterData);
	};

	/* // 1. ActionFailure olup olmadığını kontrol eden reaktif değişken
	const isFailure = $derived(isActionFailure(records));

	// 2. ListResult olup olmadığını kontrol eden reaktif değişken
	//    Hata olmadığını ve ListResult'a özgü alanların olduğunu kontrol ederiz.
	const isListResult = $derived(
		!isFailure && records && typeof records === 'object' && 'items' in records && 'totalItems' in records
	);

	// 3. Basit bir dizi (TData[]) olup olmadığını kontrol eden reaktif değişken
	const isSimpleArray = $derived(!isFailure && Array.isArray(records)); */

	/* let {
		records,
		onselect,
		filter = ''
	}: {
		records: ListResult<TData> | TData[];
		onselect?: (id: string) => void;
		filter?: string;
	} = $props(); */

	// const navigator = new Navigator();
	/* const params = useSearchParams(queryParamsSchema); */

	// type Item = Awaited<ReturnType<typeof getFullList>>['items'][number];

	// let items = $state<Item[]>([]);

	/* let promise = $derived(getFullList(filter));
	let records = $derived(await promise); */

	// let items = $derived(records.items);
	/* let items = $derived(
		records.items.map((item) => ({
			id: item.id,
			title: item.title,
			caption: item.caption,
			price: item.price,
			kn: item.kn
		}))
	);
	type ItemsType = (typeof items)[number]; */

	/* let dataTable: s.DataTable<ItemsType> | undefined = $state(undefined);

	let columns = $state<s.Column<ItemsType>[]>([
		{ field: 'id', label: 'id', width: 'minmax(50px,1fr)' },
		{ field: 'title', label: 'title', width: 'minmax(50px,1fr)' },
		{ field: 'caption', label: 'caption', width: 'minmax(50px,1fr)' },
		{ field: 'price', label: 'price', width: 'minmax(50px,1fr)' },
		{ field: 'kn', label: 'kn', width: 'minmax(50px,1fr)' }
	]);
	let footers = $state<s.Footer<ItemsType>[]>([{ caption: 'x1' }, { price: 'x2' }]); */

	/* watch(
		() => params.toURLSearchParams(),
		() => {
			console.log('object');
		}
	); */

	/* watch(
		() => navigator.params.recordId,
		(recordId) => {
			if (!recordId) return;

			console.log('Selected Record ID:', recordId);
		}
	); */

	/*
	const getOnePromise = $derived(await getOne({ ...oneParamsDefaults, id: drawerCommand.id }));
	const oneResult = $derived(resolvePromiseDerived(getOnePromise, 'id'));
	type OneSuccessResultType = NonNullable<(typeof oneResult)['data']>;
	type OneFailureResultType = NonNullable<(typeof oneResult)['error']>;

	const getListPromise = $derived(await getList(params));
	const listResult = $derived(resolvePromiseDerived(getListPromise, 'items'));
	type ListSuccessResultType = NonNullable<(typeof listResult)['data']>['items'][number];
	type ListFailureResultType = NonNullable<(typeof listResult)['error']>;
	*/

	/* let items = $state<ItemType[]>([]); */
</script>

<div>
	<p>pending promises: {$effect.pending()}</p>
	<input
		type="text"
		bind:value={filterData.title}
		placeholder="Search - Title contains..."
		class="border"
		onkeydown={(e) => e.key === 'Enter' && getData()}
	/>
	<input
		type="number"
		bind:value={filterData.quantity}
		placeholder="Search - Quantity equals..."
		class="border"
		onkeydown={(e) => e.key === 'Enter' && getData()}
	/>
	<button onclick={getData} disabled={$effect.pending() > 0} class="bg-warning-300 p-3 disabled:opacity-50"> Search </button>
	<button onclick={() => getFullList(params).refresh()} class="bg-warning-300 p-3 disabled:opacity-50"> Refresh </button>
</div>

<pre>
	{JSON.stringify(await getFullList(params), null, 2)}
</pre>

<!-- <DataTableWrapper results={items} /> -->

<div class="s" style:display="contents">
	<!-- <s.DataTable bind:this={dataTable} {items} {columns} {footers}>
		{#snippet toolbar()}
			<div class="flex gap-0.5">
				<button onclick={() => onselect?.(`${new Date().getTime()}`)}>Test 2</button>
				<button onclick={() => dataTable?.test()}>Test 4</button>
				<input
					type="text"
					bind:value={params.filter.title}
					placeholder="Search - Title contains..."
					class="border"
					onkeydown={(e) => e.key === 'Enter' && console.log('xxx')}
				/>
				<button
					onclick={() => console.log('xxx')}
					disabled={$effect.pending() > 0}
					class="bg-warning-300 p-3 disabled:opacity-50">Search</button
				>
				<span> | </span>
				<button
					onclick={() => console.log('xxx')}
					disabled={$effect.pending() > 0}
					class="bg-warning-300 p-3 disabled:opacity-50"
				>
					Refresh
				</button>
				<button
					onclick={() => console.log('xxx')}
					disabled={$effect.pending() > 0}
					class="bg-warning-300 p-3 disabled:opacity-50">Set RecordID</button
				>
				<button
					onclick={() => console.log('xxx')}
					disabled={$effect.pending() > 0}
					class="bg-warning-300 p-3 disabled:opacity-50">Remove RecordID</button
				>
				<p>
					pending promises:
					{#if $effect.pending()}
						{$effect.pending()}
					{:else}
						0
					{/if}
				</p>
			</div>
		{/snippet}
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
	</s.DataTable> -->
</div>

<style>
	/* .s:global(.s [data-slc-table]) {
		background-color: red;
	} */
</style>
