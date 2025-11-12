<script lang="ts">
	// SvelteKit
	import { page } from '$app/state';
	// Helper functions
	import { setParams, getParam } from '$lib/utils/hash-url-helper';
	import { getDefaultsFromSchema, injectFilterData, resolvePromiseDerived } from '$lib/utils/filter-string-helper';
	// Utilities
	import { watch } from 'runed';
	// Templates
	import { Page, Head } from '$lib/components/templates';
	// Components
	import { Drawer } from '$lib/components/base/drawer';
	import { confirm } from '$lib/components/base/confirm';
	import { Boundary } from '$lib/components/base/boundary';
	// Types and Schemas
	import { oneParamsSchema, listParamsSchema, updateParamsSchema, type ListParamsSchemaType } from './types';
	// Remote functions
	import { getOne, getList, update } from './page.remote';

	// ----------- Begin Page Variables --------------------------------------------------------------------------------------------------------------
	const pageUrlHash = $derived(page.url.hash);
	// ----------- End Page Variables ----------------------------------------------------------------------------------------------------------------

	// ----------- Begin Data Table Filter Logic -----------------------------------------------------------------------------------------------------
	const listParamsDefaults = getDefaultsFromSchema(listParamsSchema);
	let filterData = $state<ListParamsSchemaType['filterData']>({
		title: listParamsDefaults.filterData.title ?? '',
		quantity: listParamsDefaults.filterData.quantity ?? 0
	});
	let params = $state.raw(injectFilterData(listParamsSchema, filterData));

	const searchData = () => (params = injectFilterData(listParamsSchema, filterData));
	const refreshData = () => getList(params).refresh();
	// ----------- End Data Table Filter Logic -------------------------------------------------------------------------------------------------------

	// ----------- Begin Drawer Logic ----------------------------------------------------------------------------------------------------------------
	const oneParamsDefaults = getDefaultsFromSchema(oneParamsSchema); // kaldırılacak
	let drawer = null as Drawer | null;
	let drawerCommand = $state({ cmd: '', id: '' });
	watch(
		() => pageUrlHash,
		(newHash) => {
			const cmd = getParam('cmd', newHash) || '';
			const id = getParam('id', newHash) || '';
			drawerCommand = { cmd, id };
			if ((cmd !== 'create' && cmd !== 'update' && cmd !== 'view') || !drawer) return;
			drawer.open();
		}
	);
	// ----------- End Drawer Logic ------------------------------------------------------------------------------------------------------------------

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
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<h1 class="text-2xl font-bold">Create - Read - Update - Delete Example</h1>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<Boundary>
				<input
					type="text"
					bind:value={filterData.title}
					placeholder="Search - Title contains..."
					class="border"
					onkeydown={(e) => e.key === 'Enter' && searchData()}
				/>
				<input
					type="number"
					bind:value={filterData.quantity}
					placeholder="Search - Quantity equals..."
					class="border"
					onkeydown={(e) => e.key === 'Enter' && searchData()}
				/>
				<button onclick={searchData} disabled={$effect.pending() > 0} class="bg-warning-300 p-3 disabled:opacity-50">
					Search
				</button>
				<button onclick={refreshData} class="bg-warning-300 p-3 disabled:opacity-50"> Refresh </button>
				<p>$effect.pending() {$effect.pending()}</p>
				<pre>
					{JSON.stringify(await getList(params), null, 2)}
				</pre>
			</Boundary>
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<div>
			<button
				onclick={() => {
					setParams({ cmd: 'view', id: 'rjqbi24vn3f3k59' });
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				View
			</button>
			<button
				onclick={() => {
					setParams({ cmd: 'create', id: 'sp7wfdu7zg85vue' });
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Create
			</button>
			<button
				onclick={() => {
					setParams({ cmd: 'update', id: 'ydmi70g2ghqx2nb' });
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
			onBeforeClose={async () => {
				let shouldClose = true;
				/* shouldClose = await confirm({
					message: 'Bu paneli kapatmak istediğinize emin misiniz?',
					yes: 'Evet',
					no: 'Hayır'
				}); */
				if (shouldClose) {
					setParams({ cmd: '', id: '' });
					/* refreshData(); */
				}
				return shouldClose;
			}}
		>
			<button onclick={() => drawer?.close()} class="bg-error-300 p-3">Close Drawer</button>
			<p>Drawer Content</p>
			<Boundary>
				{#if drawerCommand.cmd === 'create'}
					<p>This is a drawer for creating a new record.</p>
					<pre>
						{JSON.stringify(await getOne({ ...oneParamsDefaults, id: drawerCommand.id }), null, 2)}
					</pre>
				{:else if drawerCommand.cmd === 'update' && drawerCommand.id}
					{@const oneResult = resolvePromiseDerived(await getOne({ ...oneParamsDefaults, id: drawerCommand.id }), 'id')}
					{#if oneResult.data}
						<p>This is a drawer for updating the record with ID: {drawerCommand.id}</p>
						{@const modify = update.for(drawerCommand.id).preflight(updateParamsSchema)}
						<form
							{...modify.enhance(async ({ form, submit }) => {
								try {
									await submit().updates(getList(params));
									form.reset();
									drawer?.close();
									console.log('Successfully saved!');
								} catch (error) {
									console.error('Oh no! Something went wrong');
								}
							})}
						>
							<input {...modify.fields.id.as('hidden', drawerCommand.id)} />
							<label>
								<h2>Title</h2>
								<input {...modify.fields.title.as('text')} value={oneResult.data.title || ''} />
								{#each modify.fields.title.issues() ?? [] as issue}
									<p class="issue">{issue.message}</p>
								{/each}
							</label>
							<label>
								<h2>Quantity</h2>
								<input {...modify.fields.quantity.as('number')} value={oneResult.data.quantity ?? 0} />
								{#each modify.fields.quantity.issues() ?? [] as issue}
									<p class="issue">{issue.message}</p>
								{/each}
							</label>
							<button type="submit" disabled={!!modify.pending}>Update</button>
						</form>
						<pre>
						{JSON.stringify(oneResult.data, null, 2)}
					</pre>
					{:else if oneResult.error}
						{JSON.stringify(oneResult.error, null, 2)}
					{:else}
						<p>Loading...</p>
					{/if}
				{:else if drawerCommand.cmd === 'view' && drawerCommand.id}
					<p>This is a drawer for viewing the record with ID: {drawerCommand.id}</p>
					<pre>
						{JSON.stringify(await getOne({ ...oneParamsDefaults, id: drawerCommand.id }), null, 2)}
					</pre>
				{:else}
					<p>No valid command provided.</p>
				{/if}
			</Boundary>
		</Drawer>
	</Page.Drawer>
</Page>
