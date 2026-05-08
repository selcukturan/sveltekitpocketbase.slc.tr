<script lang="ts">
	// Valibot
	import { getDefaults } from 'valibot';
	// SvelteKit
	import { isHttpError } from '@sveltejs/kit';
	// Helper functions
	import { setParams, getParam } from '$lib/utils/hash-url-helper';
	import { t } from '$lib/app/localization.svelte';
	import { watchUrlHash } from '$lib/attachments';
	// Templates
	import { Page, Head, DrawerFormContent } from '$lib/components/templates';
	// All Input Components
	import * as input from '$lib/components/ui/inputs';
	// All Datatable Components
	import * as dt from '$lib/components/ui/datatable';
	// Components
	import { Drawer } from '$lib/components/ui/drawer';
	import { confirm } from '$lib/components/ui/confirm';
	import { Toasts, createToaster } from '$lib/components/ui/toast';
	// Types and Schemas
	import { oneParamsSchema, listParamsSchema, updateFormSchema, type ListParamsSchemaType, type OneParamsSchemaType } from './page.shared';
	import { TestDatatableSelectSingleOptions, TestDatatableSelectMultipleOptions } from '$lib/types/pocketbase-types';
	// Remote functions
	import { getOne, getList, updateForm } from './page.remote';

	// ----------- Begin Page Context ----------------------------------------------------------------------------------------------------------------
	const pageToaster = createToaster({ name: 'page-toaster', position: 'bottom-center' });
	// ----------- End Page Context ------------------------------------------------------------------------------------------------------------------

	// ----------- Begin Data Table Filter Logic -----------------------------------------------------------------------------------------------------
	const listParamsSchemaDefaults: ListParamsSchemaType = getDefaults(listParamsSchema);
	let params = $state(listParamsSchemaDefaults); // initial
	let filterData = $state(listParamsSchemaDefaults.filterData); // initial

	const query = $derived(getList(params));

	const search = () => (params = { ...params, filterData: { ...filterData } });
	const refresh = () => query.refresh();
	// ----------- End Data Table Filter Logic -------------------------------------------------------------------------------------------------------

	// ----------- Begin Drawer Logic ----------------------------------------------------------------------------------------------------------------
	const oneParamsDefaults: OneParamsSchemaType = getDefaults(oneParamsSchema);
	let drawer = $state<Drawer | undefined>(undefined);
	let drawerCommand = $state({ cmd: '', id: '' }); // initial
	// ----------- End Drawer Logic ------------------------------------------------------------------------------------------------------------------

	// ----------- Begin Data Table Logic ------------------------------------------------------------------------------------------------------------
	type DataType = Awaited<typeof query>;
	type ItemType = DataType['items'][number] & { slcAction?: string };
	let datatable = $state<dt.DataTable<ItemType> | undefined>(undefined);
	let columns: dt.Column<ItemType>[] = [
		{ field: 'slcAction', label: 'actions', width: '150px' },
		{ field: 'id', label: 'id', width: 'minmax(50px,1fr)' },
		{ field: 'title', label: 'title', width: 'minmax(50px,1fr)' },
		{ field: 'caption', label: 'caption', width: 'minmax(50px,1fr)' },
		{ field: 'quantity', label: 'quantity', width: 'minmax(50px,1fr)' },
		{ field: 'purchase_date', label: 'purchase_date', width: 'minmax(50px,1fr)' }
	];
	let footers: dt.Footer<ItemType>[] = [{ caption: 'x1' }, { quantity: 'x2' }];
	// ----------- End Data Table Logic ------------------------------------------------------------------------------------------------------------
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Toasts toasterName="page-toaster" />

<Page>
	<Page.Header>
		<input.Button label={t('create')} onclick={() => setParams({ cmd: 'create', id: 'sp7wfdu7zg85vue' })} />
		<div class="flex gap-2 p-2">
			<input.Text id="filter_title" bind:value={filterData.title} placeholder="Search - Title contains..." onkeydown={(e) => e.key === 'Enter' && search()} />
			<input.Number
				id="filter_quantity"
				bind:value={filterData.quantity}
				placeholder="Search - Quantity equals..."
				onkeydown={(e) => e.key === 'Enter' && search()}
			/>
			<input.Button label={t('search')} onclick={search} disabled={query.loading} />
			<input.Button label={t('refresh')} onclick={refresh} />
		</div>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<dt.DataTable bind:this={datatable} {query} {columns} {footers} onPagination={(p) => (params = { ...params, ...p })}>
				{#snippet headerRow(hr)}
					<dt.HeaderRow {hr}>
						{#snippet headerCell(hc)}
							<dt.HeaderCell {hr} {hc}>
								{t('dt_' + hc.label)}
							</dt.HeaderCell>
						{/snippet}
					</dt.HeaderRow>
				{/snippet}
				{#snippet dataRow(dr)}
					<dt.DataRow {dr}>
						{#snippet dataCell(dc)}
							{#if String(dc.col.data.field) === 'slcAction'}
								<dt.DataCell {dr} {dc}>
									<div class="flex h-full w-full items-center justify-center gap-1">
										<dt.ActionButton
											label={t('update')}
											icon="update"
											onclick={() => {
												setParams({ cmd: 'update', id: dr.row.id });
											}}
										/>
										<dt.ActionButton
											label={t('delete')}
											icon="delete"
											class="text-error-500!"
											onclick={async () => {
												const shouldDelete = await confirm({
													message: t('delete_confirm_with_id', { id: dr.row.id }),
													yes: t('yes'),
													no: t('no')
												});
												if (shouldDelete) {
													pageToaster.add({
														type: 'success',
														title: 'Başarıyla silindi!',
														description: `[${dr.row.id}] ID'li kayıt silindi!`
													});
												}
											}}
										/>
										<dt.ActionButton
											label={t('view')}
											icon="view"
											onclick={() => {
												setParams({ cmd: 'view', id: dr.row.id });
											}}
										/>
									</div>
								</dt.DataCell>
							{:else}
								<dt.DataCell {dr} {dc}>
									{dc.value}
								</dt.DataCell>
							{/if}
						{/snippet}
					</dt.DataRow>
				{/snippet}
				{#snippet footerRow(fr)}
					<dt.FooterRow {fr}>
						{#snippet footerCell(fc)}
							<dt.FooterCell {fr} {fc}>
								{fc.value}
							</dt.FooterCell>
						{/snippet}
					</dt.FooterRow>
				{/snippet}
			</dt.DataTable>
		</Page.Main.Table>
	</Page.Main>
	<!-- 
	<Page.Footer>
		<p>Page.Footer</p>
	</Page.Footer> 
	-->
	<!-- Page Hidden Drawer Area -->
	<Page.Drawer>
		<Drawer
			bind:this={drawer}
			{@attach watchUrlHash((currentHash) => {
				const cmd = getParam('cmd', currentHash) || '';
				const id = getParam('id', currentHash) || '';
				drawerCommand = { cmd, id };
				if (drawer && id && ['create', 'update', 'view'].includes(cmd)) drawer.open();
			})}
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
				<p>This is a drawer for creating a new record.</p>
			{:else if drawerCommand.cmd === 'update' && drawerCommand.id}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`Update ID: ${drawerCommand.id}`}>
						<input.Button
							label=" X "
							onclick={() => {
								drawer?.close();
							}}
						/>
					</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						<DrawerFormContent.Content.Form
							inputData={await getOne({ ...oneParamsDefaults, id: drawerCommand.id })}
							initialValidate={true}
							enctype="multipart/form-data"
							schema={updateFormSchema}
							form={updateForm}
							{...updateForm.preflight(updateFormSchema).enhance(async ({ /* form, */ submit }) => {
								try {
									if (await submit().updates(query)) {
										// başarılı
										drawer?.close();

										pageToaster.add({
											type: 'success',
											title: 'Başarıyla kaydedildi!',
											description: 'Başarıyla kaydedildi!',
											action: {
												label: t('close'),
												onClick: (id) => {
													pageToaster.remove(id);
												}
											}
										});
									} else {
										// geçersiz veri
										pageToaster.add({
											type: 'error',
											title: t('error'),
											description: t('invalid_data')
										});
									}
								} catch (error) {
									// hata
									const myError = isHttpError(error) ? error : null;
									pageToaster.add({
										type: 'error',
										title: 'Hata!',
										description: 'Client: ' + myError?.body.message,
										action: {
											label: t('close'),
											onClick: (id) => {
												pageToaster.remove(id);
											}
										}
									});
								}
							})}
						>
							{#snippet inputs({ inputData })}
								<input.Hidden field={updateForm.fields.id} value={inputData.id} />
								<input.Text label="Title" field={updateForm.fields.title} value={inputData.title} />
								<input.Number label="Quantity" field={updateForm.fields.quantity} value={inputData.quantity} />
								<input.Datetime label="Purchase Date" field={updateForm.fields.purchase_date} value={inputData.purchase_date} />
								<input.Email label="Email" field={updateForm.fields.email} value={inputData.email} />
								<input.Url label="Url" field={updateForm.fields.url} value={inputData.url} />
								<input.Textarea label="Textarea" field={updateForm.fields.textarea} value={inputData.textarea} />
								<input.Relation
									label="Relation Single"
									collection="crud_relation_single"
									field={updateForm.fields.relation_single}
									value={inputData.relation_single}
								/>
								<input.Relation
									multiple
									label="Relation Multiple"
									collection="crud_relation_multiple"
									field={updateForm.fields.relation_multiple}
									value={inputData.relation_multiple}
								/>
								<input.Select
									label="Select Single"
									field={updateForm.fields.select_single}
									value={inputData.select_single}
									options={Object.values(TestDatatableSelectSingleOptions).map((value) => ({
										value,
										label: value.charAt(0).toUpperCase() + value.slice(1)
									}))}
								/>
								<input.Select
									multiple
									label="Select Multiple"
									field={updateForm.fields.select_multiple}
									value={inputData.select_multiple}
									options={Object.values(TestDatatableSelectMultipleOptions).map((value) => ({
										value,
										label: value.toUpperCase()
									}))}
								/>
								<input.File label="Single File" field={updateForm.fields.single_file} value={inputData.single_file} />
								<input.File multiple label="Multiple Files" field={updateForm.fields.multiple_files} value={inputData.multiple_files} />
								<input.Bool label="Boolean" field={updateForm.fields.bool} value={inputData.bool} />
							{/snippet}

							{#snippet buttons()}
								<input.Button label={t('close')} onclick={() => drawer?.close(true)} />
								<input.Submit label={t('update')} disabled={Boolean(updateForm.pending)} />
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawerCommand.cmd === 'view' && drawerCommand.id}
				<p>This is a drawer for creating a new record.</p>
			{/if}
		</Drawer>
	</Page.Drawer>
</Page>
