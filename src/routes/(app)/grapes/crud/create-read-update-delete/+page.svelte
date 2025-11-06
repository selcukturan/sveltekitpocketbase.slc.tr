<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { setParams, hashParam } from '$lib/utils/hash-url-helper';
	import { isActionFailure } from '@sveltejs/kit';

	import { Drawer } from '$lib/components/base/drawer';
	import { confirm } from '$lib/components/base/confirm';

	import { injectFilterData, getDefaultsFromSchema } from '$lib/utils/filter-string-helper';
	import { type ListParamsSchemaType, listParamsSchema } from './types';
	import { getFullList } from './page.remote';

	const listParamsDefaults = getDefaultsFromSchema(listParamsSchema);

	let filterData = $state<ListParamsSchemaType['filterData']>({
		title: listParamsDefaults.filterData.title ?? '',
		quantity: listParamsDefaults.filterData.quantity ?? 0
	});
	let params = $state.raw(injectFilterData(listParamsSchema, filterData));

	const getData = () => {
		params = injectFilterData(listParamsSchema, filterData);
	};

	import PageDataTable from './PageDataTable.svelte';

	const pageUrlHash = $derived(page.url.hash);
	let drawer = null as Drawer | null;
	let drawerCommand = $state({ cmd: '', id: '' });

	const drawerOpen = (cmd: string, id: string) => {
		if ((cmd !== 'create' && cmd !== 'update' && cmd !== 'view') || !drawer) return;
		drawerCommand = { cmd, id };
		drawer.open();
	};
	const drawerClose = () => {
		if (!drawer) return;
		drawer.close();
	};
	onMount(() => {
		const cmd = hashParam('cmd', pageUrlHash) || '';
		const id = hashParam('id', pageUrlHash) || '';
		drawerOpen(cmd, id);
	});
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
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
		<button onclick={getData} disabled={$effect.pending() > 0} class="bg-warning-300 p-3 disabled:opacity-50">
			Search
		</button>
		<button onclick={() => getFullList(params).refresh()} class="bg-warning-300 p-3 disabled:opacity-50">
			Refresh
		</button>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table boundary>
			<PageDataTable records={await getFullList(params)} />
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<div>
			<button
				onclick={() => {
					drawerOpen('view', `${Math.round(Math.random() * 1000)}`);
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				View
			</button>
			<button
				onclick={() => {
					drawerOpen('create', `${Math.round(Math.random() * 1000)}`);
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Create
			</button>
			<button
				onclick={() => {
					drawerOpen('update', `${Math.round(Math.random() * 1000)}`);
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Update
			</button>
			<button
				onclick={() => setParams({ cmd: 'delete', id: `${Math.round(Math.random() * 1000)}` })}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Delete
			</button>
		</div>
	</Page.Footer>
	<Page.Drawer>
		<Drawer
			bind:this={drawer}
			onOpen={() => setParams({ ...drawerCommand })}
			onBeforeClose={async () => {
				const shouldClose = await confirm({
					message: 'Bu paneli kapatmak istediğinize emin misiniz?',
					yes: 'Evet',
					no: 'Hayır'
				});

				if (shouldClose) {
					drawerCommand = { cmd: '', id: '' };
				}
				return shouldClose;
			}}
			onClose={() => setParams({ ...drawerCommand })}
		>
			<p>This is a drawer for creating a new record.</p>
			<p>Current CMD: {drawerCommand.cmd}</p>
			<p>Current ID: {drawerCommand.id}</p>
			<button onclick={drawerClose} class="bg-error-300 p-3">Close Drawer</button>
		</Drawer>
	</Page.Drawer>
</Page>
