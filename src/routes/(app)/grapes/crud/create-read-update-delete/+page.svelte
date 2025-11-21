<script lang="ts">
	// SvelteKit
	import { page } from '$app/state';
	import { isHttpError } from '@sveltejs/kit';
	// Helper functions
	import { setParams, getParam } from '$lib/utils/hash-url-helper';
	import { getDefaultsFromSchema, injectFilterData } from '$lib/utils/filter-string-helper';
	// Utilities
	import { watch } from 'runed';
	// Templates
	import { Page, Head } from '$lib/components/templates';
	// Components
	import { Drawer } from '$lib/components/base/drawer';
	import { confirm } from '$lib/components/base/confirm';
	import { Toasts, createToaster, getToaster } from '$lib/components/base/toast';
	import { Boundary } from '$lib/components/base/boundary';
	// Inputs
	import { Hidden, Text, Number, Datetime, Submit, Button } from '$lib/components/base/inputs';
	// Types and Schemas
	import { oneParamsSchema, listParamsSchema, updateFormSchema, type ListParamsSchemaType } from './types';
	// Remote functions
	import { getOne, getList, updateForm } from './page.remote';

	// ----------- Begin Page Context ----------------------------------------------------------------------------------------------------------------
	const appToaster = getToaster('app-toaster');
	const pageToaster = createToaster({ name: 'page-toaster', position: 'bottom-center' });
	// ----------- End Page Context ------------------------------------------------------------------------------------------------------------------

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

<Toasts toasterName="page-toaster" />

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
			{#if drawerCommand.cmd === 'create'}
				<Boundary>
					<p>This is a drawer for creating a new record.</p>
					<pre>
						{JSON.stringify(await getOne({ ...oneParamsDefaults, id: drawerCommand.id }), null, 2)}
					</pre>
				</Boundary>
			{:else if drawerCommand.cmd === 'update' && drawerCommand.id}
				<Boundary>
					{@const oneResult = await getOne({ ...oneParamsDefaults, id: drawerCommand.id })}
					{@const updateRemoteForm = updateForm.for(drawerCommand.id).preflight(updateFormSchema)}
					<form
						id="page-update-form"
						style="display: flex; width: 100%; height: 100%; flex-direction: column; overflow: hidden;"
						{...updateRemoteForm.enhance(async ({ submit }) => {
							try {
								await submit().updates(getList(params));
								drawer?.close();
								pageToaster.add({
									type: 'success',
									title: 'Başarıyla kaydedildi!',
									description: 'Başarıyla kaydedildi!',
									action: {
										label: 'Close',
										onClick: (id) => {
											pageToaster.remove(id);
										}
									}
								});
							} catch (error) {
								const myError = isHttpError(error) ? error : null;
								pageToaster.add({
									type: 'error',
									title: 'Hata!',
									description: 'Client: ' + myError?.body.message,
									action: {
										label: 'Close',
										onClick: (id) => {
											pageToaster.remove(id);
										}
									}
								});
							}
						})}
					>
						<header class="bg-surface-100/80 flex items-center justify-between border-b p-4">
							<div class="flex w-full items-center justify-between">
								<h2 class="text-lg font-semibold">Update ID: {drawerCommand.id}</h2>
								<Button label=" X " onclick={() => drawer?.close()} />
							</div>
						</header>
						<main class="flex-1 overflow-y-auto p-4">
							<Hidden field={updateRemoteForm.fields.id} value={drawerCommand.id} />
							<Text label="Title" field={updateRemoteForm.fields.title} value={oneResult.title} />
							<Number label="Quantity" field={updateRemoteForm.fields.quantity} value={oneResult.quantity} />
							<Datetime label="Purchase Date" field={updateRemoteForm.fields.purchase_date} value={oneResult.purchase_date} />
						</main>
						<footer class="bg-surface-100/80 border-t p-4">
							<div class="flex justify-end">
								<Button label="Close" onclick={() => drawer?.close()} />
								<Submit label="Update" disabled={!!updateRemoteForm.pending} />
							</div>
						</footer>
					</form>
					<!-- <Submit label="Update2" form="page-update-form" /> -->
				</Boundary>
			{:else if drawerCommand.cmd === 'view' && drawerCommand.id}
				<Boundary>
					<p>This is a drawer for viewing the record with ID: {drawerCommand.id}</p>
					<pre>
						{JSON.stringify(await getOne({ ...oneParamsDefaults, id: drawerCommand.id }), null, 2)}
					</pre>
				</Boundary>
			{/if}
		</Drawer>
	</Page.Drawer>
</Page>
