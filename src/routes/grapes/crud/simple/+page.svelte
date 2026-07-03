<script lang="ts">
	// Valibot
	import { getDefaults } from 'valibot';
	// SvelteKit
	import { isHttpError } from '@sveltejs/kit';
	// Helper functions
	import { setParams, getParam } from '$lib/utils/hash-url-helper';
	import { t } from '$lib/app/localization';
	import { watchUrlHash } from '$lib/attachments';
	// Templates
	import { Page, Head, DrawerFormContent } from '$lib/components/templates';
	// All Input Components
	import * as input from '$lib/components/ui/inputs';
	// All Form Input Components
	import * as formInput from '$lib/components/ui/form_inputs';
	// All Datatable Components
	import * as dt from '$lib/components/ui/datatable';
	// Components
	import { Drawer } from '$lib/components/ui/drawer';
	import { confirm } from '$lib/components/ui/confirm';
	import { Toasts, createToaster } from '$lib/components/ui/toast';
	// Types and Schemas
	import { oneParamsSchema, listParamsSchema, updateFormSchema, type ListParamsSchemaType, type OneParamsSchemaType } from './page.shared';
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
	let drawerRef = $state<Drawer | undefined>(undefined);
	let drawerCommand = $state({ cmd: '', id: '' }); // initial
	let drawerFormIsChanged = $state(false);
	// ----------- End Drawer Logic ------------------------------------------------------------------------------------------------------------------

	// ----------- Begin Data Table Logic ------------------------------------------------------------------------------------------------------------
	type DataType = Awaited<typeof query>;
	type ItemType = DataType['items'][number] & { slcAction?: string };
	let datatable = $state<dt.DataTable<ItemType> | undefined>(undefined);
	let columns: dt.Column<ItemType>[] = [
		{ field: 'slcAction', label: 'actions', width: '150px', sortable: false },
		{ field: 'id', label: 'id', width: 'minmax(50px,1fr)' },
		{ field: 'text_required', label: 'text_required', width: 'minmax(50px,1fr)' },
		{ field: 'text_optional', label: 'text_optional', width: 'minmax(50px,1fr)' }
	];
	let footers: dt.Footer<ItemType>[] = [{ text_required: 'x1', text_optional: 'x1' }, { text_optional: 'y2' }];
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
			<input.Text
				id="filter_text_required"
				bind:value={filterData.text_required}
				placeholder="Search - text_required contains..."
				onkeydown={(e) => e.key === 'Enter' && search()}
			/>
			<input.Text
				id="filter_text_optional"
				bind:value={filterData.text_optional}
				placeholder="Search - text_optional contains..."
				onkeydown={(e) => e.key === 'Enter' && search()}
			/>
			<input.Button label={t('search')} onclick={search} disabled={query.loading} />
			<input.Button label={t('refresh')} onclick={refresh} />
		</div>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<dt.DataTable
				bind:this={datatable}
				{query}
				{columns}
				{footers}
				freezeLeft={1}
				freezeRight={0}
				onPagination={(p) => (params = { ...params, ...p })}
				sort={params.options.sort}
				onSort={(s) => (params = { ...params, options: { ...params.options, sort: s } })}
				onRowClick={(row) => setParams({ cmd: 'update', id: row.id })}
			>
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
										<dt.ActionButton label={t('update')} icon="update" onclick={() => setParams({ cmd: 'update', id: dr.row.id })} />
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
										<dt.ActionButton label={t('view')} icon="view" onclick={() => setParams({ cmd: 'view', id: dr.row.id })} />
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
			bind:this={drawerRef}
			{@attach watchUrlHash((currentHash) => {
				const cmd = getParam('cmd', currentHash) || '';
				const id = getParam('id', currentHash) || '';
				drawerCommand = { cmd, id };
				if (drawerRef && id && ['create', 'update', 'view'].includes(cmd)) drawerRef.open();
			})}
			onBeforeClose={async () => {
				if (drawerFormIsChanged) {
					let shouldClose = await confirm({
						message: 'Kaydedilmemiş değişiklikleriniz var. Bunları gerçekten silmek istiyor musunuz?',
						yes: 'Evet',
						no: 'Hayır'
					});
					if (shouldClose) {
						setParams({ cmd: '', id: '' });
					}
					return shouldClose;
				} else {
					setParams({ cmd: '', id: '' });
					return true;
				}
			}}
		>
			{#if drawerCommand.cmd === 'create'}
				<p>This is a drawer for creating a new record.</p>
			{:else if drawerCommand.cmd === 'update' && drawerCommand.id}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`Update ID: ${drawerCommand.id}`}>
						<input.Button label=" X " onclick={() => drawerRef?.close()} />
					</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						{@const dbData = await getOne({ ...oneParamsDefaults, id: drawerCommand.id })}
						<DrawerFormContent.Content.Form
							enctype="multipart/form-data"
							schema={updateFormSchema}
							form={updateForm}
							OnIsChange={(v) => (drawerFormIsChanged = v)}
							{...updateForm.preflight(updateFormSchema).enhance(async ({ /* form, */ submit }) => {
								try {
									if (await submit().updates(query)) {
										// başarılı
										drawerFormIsChanged = false;
										drawerRef?.close();

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
							{#snippet inputs()}
								<formInput.Hidden field={updateForm.fields.id} value={dbData.id} />
								<formInput.Text label="text_required" field={updateForm.fields.text_required} value={dbData.text_required} />
								<formInput.Text label="text_optional" field={updateForm.fields.text_optional} value={dbData.text_optional} />
								<formInput.Select
									multiple
									field={updateForm.fields.select_optional_multiple}
									value={dbData.select_optional_multiple}
									options={[
										{ label: 'html', value: 'html' },
										{ label: 'css', value: 'css' },
										{ label: 'javascript', value: 'javascript' }
									]}
								/>
								<formInput.Select
									field={updateForm.fields.select_optional_single}
									value={dbData.select_optional_single}
									options={[
										{ label: 'linux', value: 'linux' },
										{ label: 'mac', value: 'mac' },
										{ label: 'windows', value: 'windows' }
									]}
								/>
								<formInput.Relation
									multiple
									collection="demo_relation_input_multiple"
									label="Multiple Relation"
									field={updateForm.fields.relation_optional_multiple}
									value={dbData.relation_optional_multiple}
								/>
								<formInput.Relation
									collection="demo_relation_input_single"
									label="Single Relation"
									field={updateForm.fields.relation_optional_single}
									value={dbData.relation_optional_single}
								/>
								<formInput.File label="Single File" field={updateForm.fields.file_optional_single} value={dbData.file_optional_single} />
								<formInput.File label="Multiple Files" multiple field={updateForm.fields.file_optional_multiple} value={dbData.file_optional_multiple} />
							{/snippet}

							{#snippet buttons()}
								<formInput.Button label={t('close')} onclick={() => drawerRef?.close(true)} />
								<!-- <formInput.Button type="submit" label={t('update')} disabled={Boolean(updateForm.pending) || !drawerFormIsChanged} /> -->
								<formInput.Button type="submit" label={t('update')} disabled={Boolean(updateForm.pending)} />
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
