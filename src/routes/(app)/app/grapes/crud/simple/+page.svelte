<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head, DrawerFormContent } from '#lib/components/templates/index.js';
	import * as input from '#lib/components/ui/inputs/index.js';
	import * as formInput from '#lib/components/ui/form_inputs/index.js';
	import * as dt from '#lib/components/ui/datatable/index.js';
	import { Drawer, createHashDrawer } from '#lib/components/ui/drawer/index.js';
	import { confirm } from '#lib/components/ui/confirm/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	import { listParamsSchema, createFormSchema, updateFormSchema } from './page.shared';
	import { getOne, getList, createForm, updateForm, deleteRecord, seedRecords, deleteSeedRecords } from './page.remote';

	const toaster = createToaster({ name: 'page-toaster', position: 'bottom-center' });
	const list = dt.createList(getList, listParamsSchema, { autoLoad: true }); // filtre + sayfalama + sıralama + sorgu
	const drawer = createHashDrawer(); // #cmd=update&id=... → drawer

	type Item = Awaited<ReturnType<typeof getList>>['items'][number];
	const columns: dt.Column<Item>[] = [
		{ field: '_actions', type: 'actions', label: 'dt_actions', width: '120px', sortable: false },
		{ field: 'id', label: 'dt_id', width: 'minmax(50px,1fr)' },
		{ field: 'text_required', label: 'dt_text_required', width: 'minmax(50px,1fr)' },
		{ field: 'text_optional', label: 'dt_text_optional', width: 'minmax(50px,1fr)' },
		{ field: 'number_optional', label: 'number_optional', type: 'number', width: '130px' },
		{ field: 'select_optional_single', label: 'select_optional_single', width: '150px' },
		{ field: 'select_optional_multiple', label: 'select_optional_multiple', type: 'list', width: '180px' },
		{ field: 'date_optional', label: 'date_optional', type: 'date', width: '130px' },
		{ field: 'bool_optional', label: 'bool_optional', type: 'bool', width: '120px' },
		{ field: 'updated', label: 'updated', type: 'datetime', width: '170px' }
	];

	// create/update ortak gönderim: alan hataları inputların altında, genel sonuç toast ile
	const save = async (submit: () => Promise<boolean>) => {
		try {
			if (!(await submit())) return toaster.error(null, t('invalid_data'));
			drawer.closeClean();
			toaster.success(t('toast_saved_title'), t('toast_saved_description'));
		} catch (error) {
			toaster.error(error);
		}
	};

	const remove = async (id: string) => {
		if (!(await confirm({ message: t('delete_confirm_with_id', { id }), yes: t('delete'), no: t('cancel'), danger: true }))) return;
		try {
			await deleteRecord({ id }).updates(...list.updates);
			toaster.success(t('toast_deleted_title'), t('toast_deleted_description', { id }));
		} catch (error) {
			toaster.error(error);
		}
	};

	// GEÇİCİ: sayfalama/virtual scroll testi (page.remote.ts'teki seed bölümüyle birlikte silinecek)
	let seeding = $state(false);
	const seed = async (message: string, run: () => Promise<{ count?: number; deleted?: number }>) => {
		if (!(await confirm({ title: 'Test verisi', message, danger: true }))) return;
		seeding = true;
		try {
			const result = await run();
			toaster.success('Tamamlandı', `${result.count ?? result.deleted} kayıt işlendi.`);
		} catch (error) {
			toaster.error(error);
		} finally {
			seeding = false;
		}
	};
</script>

<!-- create ve update formlarının ortak inputları; kurallar page.shared.ts şemasından gelir -->
{#snippet recordInputs(fields: typeof createForm.fields, data: Partial<Item>)}
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
	<formInput.Bool label="bool_optional" text={t('do_not_disturb')} field={fields.bool_optional} value={data.bool_optional} />
{/snippet}

{#snippet closeButton()}
	<input.Button icon="close" iconOnly class="rounded-full!" variant="ghost" color="surface" onclick={drawer.close} />
{/snippet}

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Toasts toasterName="page-toaster" />

<Page>
	<Page.Header>
		<div class="w-56">
			<input.Text bind:value={list.filter.filter_text_required} placeholder={t('search_contains', { field: 'text_required' })} onkeydown={list.searchOnEnter} />
		</div>
		<div class="w-56">
			<input.Text bind:value={list.filter.filter_text_optional} placeholder={t('search_contains', { field: 'text_optional' })} onkeydown={list.searchOnEnter} />
		</div>
		<input.Button variant="filled" label={t('search')} onclick={list.search} disabled={list.loading} />
		<input.Button variant="ghost" color="surface" label={t('refresh')} onclick={list.refresh} />
		<div class="ml-auto flex items-center gap-2">
			<!-- GEÇİCİ: test butonları -->
			<input.Button
				variant="ghost"
				color="warning"
				label="+10.000 test"
				disabled={seeding}
				onclick={() => seed('10.000 rastgele kayıt eklensin mi? (1-2 dk sürebilir)', () => seedRecords({ count: 10000 }).updates(...list.updates))}
			/>
			<input.Button
				variant="ghost"
				color="error"
				label="Testleri sil"
				disabled={seeding}
				onclick={() => seed('"seed-" ile işaretli tüm test kayıtları silinsin mi?', () => deleteSeedRecords().updates(...list.updates))}
			/>
			<input.Button variant="filled" color="primary" label={t('create')} onclick={() => drawer.show('create')} />
		</div>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<dt.DataTable {list} {columns} freezeLeft={1} onRowClick={(row) => drawer.show('update', row.id)}>
				{#snippet actions(row)}
					<dt.ActionButton label={t('update')} icon="update" onclick={() => drawer.show('update', row.id)} />
					<dt.ActionButton label={t('delete')} icon="delete" class="text-error-500!" onclick={() => remove(row.id)} />
					<dt.ActionButton label={t('view')} icon="view" onclick={() => drawer.show('view', row.id)} />
				{/snippet}
			</dt.DataTable>
		</Page.Main.Table>
	</Page.Main>
	<Page.Drawer>
		<Drawer bind:this={drawer.ref} {@attach drawer.watch} onBeforeClose={drawer.beforeClose}>
			{#if drawer.cmd === 'create'}
				<!-- .for(): drawer her açılışta temiz bir form örneği alır; kapanınca örnek (değerler, hatalar) silinir -->
				{@const form = createForm.for('create')}
				<DrawerFormContent>
					<DrawerFormContent.Header label={t('create')}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						<DrawerFormContent.Content.Form
							enctype="multipart/form-data"
							schema={createFormSchema}
							{form}
							onIsChange={drawer.setChanged}
							{...form.preflight(createFormSchema).enhance(({ submit }) => save(() => submit().updates(...list.updates)))}
						>
							{#snippet inputs()}
								{@render recordInputs(form.fields, {})}
							{/snippet}
							{#snippet buttons({ isChanged } = {})}
								<formInput.Button variant="ghost" color="surface" label={t('close')} onclick={drawer.close} />
								<div class="flex gap-2">
									<formInput.Button type="reset" variant="ghost" color="surface" label={t('form_reset')} disabled={!isChanged} />
									<formInput.Button type="submit" label={t('create')} disabled={Boolean(form.pending)} />
								</div>
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawer.cmd === 'update' && drawer.id}
				{@const form = updateForm.for(drawer.id)}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`${t('update')} - ID: ${drawer.id}`}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						{@const record = await getOne({ id: drawer.id, options: {}, timestamp: Date.now() })}
						<DrawerFormContent.Content.Form
							enctype="multipart/form-data"
							schema={updateFormSchema}
							{form}
							onIsChange={drawer.setChanged}
							{...form.preflight(updateFormSchema).enhance(({ submit }) => save(() => submit().updates(...list.updates)))}
						>
							{#snippet inputs()}
								<formInput.Hidden field={form.fields.id} value={record.id} />
								{@render recordInputs(form.fields, record)}
							{/snippet}
							{#snippet buttons({ isChanged } = {})}
								<formInput.Button variant="ghost" color="surface" label={t('close')} onclick={drawer.close} />
								<div class="flex gap-2">
									<formInput.Button type="reset" variant="ghost" color="surface" label={t('form_reset')} disabled={!isChanged} />
									<formInput.Button type="submit" variant="filled" color="surface" label={t('update')} disabled={Boolean(form.pending) || !isChanged} />
								</div>
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawer.cmd === 'view' && drawer.id}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`${t('view')} - ID: ${drawer.id}`}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						{@const record = await getOne({ id: drawer.id, options: {}, timestamp: Date.now() })}
						<!-- minmax(0,1fr): değer kolonu içeriğe göre büyüyüp yatay scroll üretmez; uzun değerler satır kaydırır -->
						<dl class="grid grid-cols-[minmax(7rem,max-content)_minmax(0,1fr)] content-start gap-x-6 gap-y-3 overflow-x-hidden overflow-y-auto p-6 text-sm">
							{#each Object.entries(record) as [key, value] (key)}
								<dt class="text-surface-500 font-medium break-all">{key}</dt>
								<dd class="min-w-0"><dt.Value {value} wrap /></dd>
							{/each}
						</dl>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{/if}
		</Drawer>
	</Page.Drawer>
</Page>
