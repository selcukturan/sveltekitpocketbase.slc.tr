<script lang="ts">
	import * as v from 'valibot';
	import { Page, Head } from '$lib/components/templates';
	import { type ListParamsSchemaType, listParamsSchema } from './types';
	import { getFullList } from './page.remote';
	import { setParams, injectFilterData, hashParam } from '$lib/utils/filter-string-helper';
	import { watch } from 'runed';
	import PageDataTable from './PageDataTable.svelte';
	import { page } from '$app/state';

	const pageUrlHash = $derived(page.url.hash);

	let params = $state<ListParamsSchemaType>(v.getDefaults(listParamsSchema));

	let filterData = $state<ListParamsSchemaType['filterData']>({ title: '', quantity: 0 });

	watch(
		() => pageUrlHash,
		(pageUrlHash) => {
			const cmd = hashParam('cmd', pageUrlHash);
			switch (cmd) {
				case 'list':
					const listId = hashParam('id', pageUrlHash);
					if (listId) {
						console.log(`List Triggered: ${listId}`);
						params = injectFilterData(listParamsSchema, filterData);
						getFullList(params).refresh();
					}
					break;
				case 'view':
					const viewId = hashParam('id', pageUrlHash);
					if (viewId) {
						console.log(`View - Open Drawer: ${viewId}`);
					}
					break;
				case 'create':
					console.log('Create');
					break;
				case 'update':
					const updateId = hashParam('id', pageUrlHash);
					if (updateId) {
						console.log(`Update - Open Drawer: ${updateId}`);
					}
					break;
				case 'delete':
					console.log('Delete');
					break;
			}
		}
	);
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<!-- <p>effect.pending: {$effect.pending()}</p> -->
		<p>c</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table boundary>
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
			<button
				onclick={() => setParams({ cmd: 'list', id: `${Math.round(Math.random() * 1000)}` })}
				disabled={$effect.pending() > 0}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Search
			</button>
			<button
				onclick={() => setParams({ cmd: 'list', id: `${Math.round(Math.random() * 1000)}` })}
				class="bg-warning-300 p-3 disabled:opacity-50">List</button
			>
			<button
				onclick={() => setParams({ cmd: 'view', id: `${Math.round(Math.random() * 1000)}` })}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				View
			</button>
			<button onclick={() => setParams({ cmd: '', id: '' })} class="bg-error-300 p-3 disabled:opacity-50">
				No View
			</button>
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

			<PageDataTable records={await getFullList(params)} />
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
