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
	import { Page, Head, DrawerForm } from '$lib/components/templates';
	// Components
	import { Drawer } from '$lib/components/base/drawer';
	import { confirm } from '$lib/components/base/confirm';
	import { Toasts, createToaster, getToaster } from '$lib/components/base/toast';
	import { Boundary } from '$lib/components/base/boundary';
	import * as s from '$lib/components/base/datatable';
	// Inputs
	import { Hidden, Text, Number, Datetime, Submit, Button, Form } from '$lib/components/base/inputs';
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

	// ----------- Begin Data Table Logic ------------------------------------------------------------------------------------------------------------
	type ItemType = Awaited<ReturnType<typeof getList>>['items'][number];
	let dataTable: s.DataTable<ItemType> | undefined = $state(undefined);
	let columns: s.Column<ItemType>[] = [
		{ field: 'id', label: 'id', width: 'minmax(50px,1fr)' },
		{ field: 'title', label: 'title', width: 'minmax(50px,1fr)' },
		{ field: 'caption', label: 'caption', width: 'minmax(50px,1fr)' },
		{ field: 'quantity', label: 'quantity', width: 'minmax(50px,1fr)' },
		{ field: 'purchase_date', label: 'purchase_date', width: 'minmax(50px,1fr)' }
	];
	let footers: s.Footer<ItemType>[] = [{ caption: 'x1' }, { quantity: 'x2' }];
	// ----------- End Data Table Logic ------------------------------------------------------------------------------------------------------------
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
		<Page.Main.Table boundary>
			{@const items = (await getList(params)).items}
			<s.DataTable bind:this={dataTable} {items} {columns} {footers}>
				{#snippet toolbar()}
					<Text
						bind:value={filterData.title}
						placeholder="Search - Title contains..."
						onkeydown={(e) => e.key === 'Enter' && searchData()}
					/>
					<Number
						bind:value={filterData.quantity}
						placeholder="Search - Quantity equals..."
						onkeydown={(e) => e.key === 'Enter' && searchData()}
					/>
					<Button label="Search" onclick={searchData} disabled={$effect.pending() > 0} />
					<Button label="Refresh" onclick={refreshData} />
					<p>$effect.pending() {$effect.pending()}</p>
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
				{#snippet statusbar()}
					<p>Table Statusbar</p>
				{/snippet}
			</s.DataTable>
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<div>
			<Button
				label="View"
				onclick={() => {
					setParams({ cmd: 'view', id: 'rjqbi24vn3f3k59' });
				}}
			/>
			<Button
				label="Create"
				onclick={() => {
					setParams({ cmd: 'create', id: 'sp7wfdu7zg85vue' });
				}}
			/>
			<Button
				label="Update"
				onclick={() => {
					setParams({ cmd: 'update', id: 'ydmi70g2ghqx2nb' });
				}}
			/>
			<Button label="Delete" onclick={() => setParams({ cmd: 'delete', id: `${Math.round(Math.random() * 1000)}` })} />
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
				<DrawerForm>
					<DrawerForm.Header label={`Update ID: ${drawerCommand.id}`}>
						<Button label=" X " onclick={() => drawer?.close()} />
					</DrawerForm.Header>
					<DrawerForm.Content boundary>
						{@const oneResult = await getOne({ ...oneParamsDefaults, id: drawerCommand.id })}
						{@const updateRemoteForm = updateForm.for(drawerCommand.id).preflight(updateFormSchema)}
						<DrawerForm.Content.Form
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
							{#snippet inputs()}
								<Hidden field={updateRemoteForm.fields.id} value={oneResult.id} />
								<Text label="Title" field={updateRemoteForm.fields.title} value={oneResult.title} />
								<Number label="Quantity" field={updateRemoteForm.fields.quantity} value={oneResult.quantity} />
								<Datetime label="Purchase Date" field={updateRemoteForm.fields.purchase_date} value={oneResult.purchase_date} />
							{/snippet}

							{#snippet buttons()}
								<Button label="Close" onclick={() => drawer?.close()} />
								<Submit label="Update" disabled={!!updateRemoteForm.pending} />
							{/snippet}
						</DrawerForm.Content.Form>
					</DrawerForm.Content>
				</DrawerForm>
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
