<script lang="ts">
	// Valibot
	import { getDefaults } from 'valibot';
	// SvelteKit
	import { isHttpError } from '@sveltejs/kit';
	// Helper functions
	import { setParams, getParam } from '#lib/utils/hash-url-helper.js';
	import { t } from '#lib/app/localization/index.js';
	import { watchUrlHash } from '#lib/attachments/index.js';
	// Templates
	import { Page, Head, DrawerFormContent } from '#lib/components/templates/index.js';
	// All Input Components
	import * as input from '#lib/components/ui/inputs/index.js';
	// All Form Input Components
	import * as formInput from '#lib/components/ui/form_inputs/index.js';
	// All Datatable Components
	import * as dt from '#lib/components/ui/datatable/index.js';
	// Components
	import { Drawer } from '#lib/components/ui/drawer/index.js';
	import { confirm } from '#lib/components/ui/confirm/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	// Types and Schemas
	import { oneParamsSchema, listParamsSchema, createFormSchema, updateFormSchema, type ListParamsSchemaType, type OneParamsSchemaType } from './page.shared';
	// Remote functions
	import { getOne, getList, createForm, updateForm, deleteRecord } from './page.remote';

	// ----------- Begin Page Context ----------------------------------------------------------------------------------------------------------------
	const pageToaster = createToaster({ name: 'page-toaster', position: 'bottom-center' });
	// ----------- End Page Context ------------------------------------------------------------------------------------------------------------------

	// ----------- Begin Data Table Filter Logic -----------------------------------------------------------------------------------------------------
	const listParamsSchemaDefaults: ListParamsSchemaType = getDefaults(listParamsSchema);
	let params = $state({ ...listParamsSchemaDefaults, timestamp: new Date().getTime() }); // initial
	let filterData = $state(listParamsSchemaDefaults.filterData); // initial

	const query = $derived(getList(params));

	const search = () => {
		params = { ...params, filterData: { ...filterData }, timestamp: new Date().getTime() };
	};
	const refresh = () => query.refresh();
	// ----------- End Data Table Filter Logic -------------------------------------------------------------------------------------------------------

	// ----------- Begin Drawer Logic ----------------------------------------------------------------------------------------------------------------
	const oneParamsDefaults: OneParamsSchemaType = getDefaults(oneParamsSchema);
	let drawerRef = $state<Drawer | undefined>(undefined);
	let drawerCommand = $state({ cmd: '', id: '' }); // initial
	let drawerFormIsChanged = $state(false);
	// ----------- End Drawer Logic ------------------------------------------------------------------------------------------------------------------

	// ----------- Begin Form Submit Logic -----------------------------------------------------------------------------------------------------------
	type RecordType = Awaited<ReturnType<typeof getOne>>;

	const showError = (error: unknown) => {
		const myError = isHttpError(error) ? error : null;
		pageToaster.add({
			type: 'error',
			title: t('error'),
			description: myError?.body.message ?? t('error_generic'),
			action: {
				label: t('close'),
				onClick: (id) => {
					pageToaster.remove(id);
				}
			}
		});
	};

	// create ve update formlarının ortak gönderim akışı
	// Alan hataları (istemci ön kontrolü, sunucu valibot, PocketBase) ilgili input'un altında gösterilir.
	const submitAndNotify = async (run: () => Promise<boolean>) => {
		try {
			if (await run()) {
				drawerFormIsChanged = false;
				drawerRef?.close();
				pageToaster.add({ type: 'success', title: 'Başarıyla kaydedildi!', description: 'Başarıyla kaydedildi!' });
			} else {
				pageToaster.add({ type: 'error', title: t('error'), description: t('invalid_data') });
			}
		} catch (error) {
			showError(error);
		}
	};
	// ----------- End Form Submit Logic -------------------------------------------------------------------------------------------------------------

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

<!-- create ve update formlarının ortak inputları; kurallar page.shared.ts şemasından gelir -->
{#snippet recordInputs(fields: typeof createForm.fields, data: Partial<RecordType>)}
	<formInput.Text label="text_required" field={fields.text_required} value={data.text_required} />
	<formInput.Text label="text_optional" field={fields.text_optional} value={data.text_optional} />
	<formInput.Select label="select_optional_multiple" field={fields.select_optional_multiple} value={data.select_optional_multiple} />
	<formInput.Select label="select_optional_single" field={fields.select_optional_single} value={data.select_optional_single} />
	<formInput.Relation label="relation_optional_multiple" field={fields.relation_optional_multiple} value={data.relation_optional_multiple} />
	<formInput.Relation label="relation_optional_single" field={fields.relation_optional_single} value={data.relation_optional_single} />
	<formInput.Email label="email_optional" field={fields.email_optional} value={data.email_optional} />
	<formInput.Number label="number_optional" field={fields.number_optional} value={data.number_optional} />
	<formInput.Textarea label="textarea_optional" field={fields.textarea_optional} value={data.textarea_optional} />
	<formInput.Url label="url_optional" field={fields.url_optional} value={data.url_optional} />
	<formInput.Date label="date_optional" field={fields.date_optional} value={data.date_optional} />
	<formInput.Datetime label="datetime_optional" field={fields.datetime_optional} value={data.datetime_optional} />
	<formInput.File label="file_optional_single" field={fields.file_optional_single} value={data.file_optional_single} />
	<formInput.File label="file_optional_multiple" field={fields.file_optional_multiple} value={data.file_optional_multiple} />
	<formInput.Bool label="bool_optional" text="Rahatsız Etmeyin (Do not disturb)" field={fields.bool_optional} value={data.bool_optional} />
{/snippet}

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Toasts toasterName="page-toaster" />

<Page>
	<Page.Header>
		<input.Button label={t('create')} onclick={() => setParams({ cmd: 'create', id: '' })} />
		<div class="flex gap-2 p-2">
			<input.Text
				id="filter_text_required"
				bind:value={filterData.filter_text_required}
				placeholder="Search - text_required contains..."
				onkeydown={(e) => e.key === 'Enter' && search()}
			/>
			<input.Text
				id="filter_text_optional"
				bind:value={filterData.filter_text_optional}
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
				onPagination={(p) => {
					params = { ...params, ...p, timestamp: new Date().getTime() };
				}}
				sort={params.options.sort}
				onSort={(s) => {
					params = { ...params, options: { ...params.options, sort: s }, timestamp: new Date().getTime() };
				}}
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
													try {
														await deleteRecord({ id: dr.row.id }).updates(query);
														pageToaster.add({
															type: 'success',
															title: 'Başarıyla silindi!',
															description: `[${dr.row.id}] ID'li kayıt silindi!`
														});
													} catch (error) {
														showError(error);
													}
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
				if (drawerRef && (cmd === 'create' || (id && ['update', 'view'].includes(cmd)))) drawerRef.open();
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
				<!-- .for(): drawer her açılışta temiz bir form örneği alır; kapanınca örnek (değerler, hatalar) silinir -->
				{@const form = createForm.for('create')}
				<DrawerFormContent>
					<DrawerFormContent.Header label="Create">
						<input.Button label=" X " onclick={() => drawerRef?.close()} />
					</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						<DrawerFormContent.Content.Form
							enctype="multipart/form-data"
							schema={createFormSchema}
							{form}
							onIsChange={(v) => (drawerFormIsChanged = v)}
							{...form.preflight(createFormSchema).enhance(({ submit }) => submitAndNotify(() => submit().updates(query)))}
						>
							{#snippet inputs()}
								{@render recordInputs(form.fields, {})}
							{/snippet}

							{#snippet buttons()}
								<formInput.Button label={t('close')} onclick={() => drawerRef?.close(true)} />
								<formInput.Button type="submit" label={t('create')} disabled={Boolean(form.pending)} />
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawerCommand.cmd === 'update' && drawerCommand.id}
				{@const form = updateForm.for(drawerCommand.id)}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`Update ID: ${drawerCommand.id}`}>
						<input.Button label=" X " onclick={() => drawerRef?.close()} />
					</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						{@const timestamp = new Date().getTime()}
						{@const dbData = await getOne({ ...oneParamsDefaults, id: drawerCommand.id, timestamp })}
						<DrawerFormContent.Content.Form
							enctype="multipart/form-data"
							schema={updateFormSchema}
							{form}
							onIsChange={(v) => (drawerFormIsChanged = v)}
							{...form.preflight(updateFormSchema).enhance(({ submit }) => submitAndNotify(() => submit().updates(query)))}
						>
							{#snippet inputs()}
								<formInput.Hidden field={form.fields.id} value={dbData.id} />
								{@render recordInputs(form.fields, dbData)}
							{/snippet}

							{#snippet buttons()}
								<formInput.Button label={t('close')} onclick={() => drawerRef?.close(true)} />
								<!-- <formInput.Button type="submit" label={t('update')} disabled={Boolean(form.pending) || !drawerFormIsChanged} /> -->
								<formInput.Button type="submit" label={t('update')} disabled={Boolean(form.pending)} />
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
