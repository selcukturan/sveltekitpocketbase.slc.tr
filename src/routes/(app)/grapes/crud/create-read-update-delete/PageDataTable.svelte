<script lang="ts">
	import * as v from 'valibot';
	import { page } from '$app/state';
	import { watch } from 'runed';
	import { injectFilterData } from '$lib/utils/filter-string-helper';
	import { setParams, hashParam } from '$lib/utils/hash-url-helper';

	import { type ListParamsSchemaType, listParamsSchema } from './types';
	import { getFullList } from './page.remote';

	const pageUrlHash = $derived(page.url.hash);

	let params = $state<ListParamsSchemaType>(v.getDefaults(listParamsSchema));

	let filterData = $state<ListParamsSchemaType['filterData']>({ title: '', quantity: 0 });

	const getData = () => {
		params = injectFilterData(listParamsSchema, filterData);
	};

	const promise = $derived(getFullList(params));
	const records = $derived(await promise);

	let isOpen = $state('close' as 'open' | 'close' | 'waiting');
	watch(
		() => pageUrlHash,
		(currHash, prevHash) => {
			isOpen = 'close';

			const prevCmd = prevHash ? hashParam('cmd', prevHash) : undefined;
			const prevId = prevHash ? hashParam('id', prevHash) : undefined;

			const currCmd = hashParam('cmd', currHash);
			const currId = hashParam('id', currHash);
			switch (currCmd) {
				case 'list':
					if (currId) {
						console.log(`List Triggered: ${currId}`);
						// params = injectFilterData(listParamsSchema, filterData);
					}
					break;
				case 'view':
					if (currId) {
						console.log(`View - Open Drawer: ${currId}`);
					}
					break;
				case 'create':
					console.log('Create');
					isOpen = 'open';
					break;
				case 'update':
					if (currId) {
						console.log(`Update - Open Drawer: ${currId}`);
					}
					break;
				case 'delete':
					console.log('Delete');
					break;
			}
		}
	);

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
</script>

<div>
	<p>pending promises: {$effect.pending()}</p>
	<input
		type="text"
		bind:value={filterData.title}
		placeholder="Search - Title contains..."
		class="border"
		onkeydown={(e) => e.key === 'Enter' && setParams({ cmd: 'list', id: `${Math.round(Math.random() * 1000)}` })}
	/>
	<input
		type="number"
		bind:value={filterData.quantity}
		placeholder="Search - Quantity equals..."
		class="border"
		onkeydown={(e) => e.key === 'Enter' && setParams({ cmd: 'list', id: `${Math.round(Math.random() * 1000)}` })}
	/>
	<!-- onclick={() => setParams({ cmd: 'list', id: `${Math.round(Math.random() * 1000)}` })} -->
	<button onclick={getData} class="bg-warning-300 p-3 disabled:opacity-50">Search</button>
	<button onclick={() => getFullList(params).refresh()} class="bg-warning-300 p-3 disabled:opacity-50">Refresh</button>
	<button
		onclick={() => setParams({ cmd: 'list', id: `${Math.round(Math.random() * 1000)}` })}
		class="bg-warning-300 p-3 disabled:opacity-50">Refresh(List)</button
	>
	<button
		onclick={() => setParams({ cmd: 'view', id: `${Math.round(Math.random() * 1000)}` })}
		class="bg-warning-300 p-3 disabled:opacity-50"
	>
		View
	</button>
	<button onclick={() => setParams({ cmd: '', id: '' })} class="bg-error-300 p-3 disabled:opacity-50"> No View </button>
	<button
		onclick={() => setParams({ cmd: 'create', id: `${Math.round(Math.random() * 1000)}` })}
		class="bg-warning-300 p-3 disabled:opacity-50"
	>
		Create
	</button>
	<button
		onclick={() => setParams({ cmd: 'update', id: `${Math.round(Math.random() * 1000)}` })}
		class="bg-warning-300 p-3 disabled:opacity-50"
	>
		Update
	</button>
	<button onclick={() => setParams({ cmd: '', id: '' })} class="bg-error-300 p-3 disabled:opacity-50">
		No Update
	</button>
	<button
		onclick={() => setParams({ cmd: 'delete', id: `${Math.round(Math.random() * 1000)}` })}
		class="bg-warning-300 p-3 disabled:opacity-50"
	>
		Delete
	</button>
</div>

<pre>
	{#if typeof records === 'object' && 'items' in records}
		{JSON.stringify(records.items, null, 2)}
	{:else}
		{JSON.stringify(records, null, 2)}
	{/if}
	<!-- {JSON.stringify(records, null, 2)} -->
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
