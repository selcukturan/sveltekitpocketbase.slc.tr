<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head, DrawerFormContent } from '#lib/components/templates/index.js';
	import * as input from '#lib/components/ui/inputs/index.js';
	import * as formInput from '#lib/components/ui/form_inputs/index.js';
	import * as dt from '#lib/components/ui/datatable/index.js';
	import { Drawer, createHashDrawer } from '#lib/components/ui/drawer/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	import { TABLE, createFormSchema, updateFormSchema } from './page.shared';
	import { getOne, getList, createForm, updateForm, deleteRecords, updateCells } from './page.remote';

	const toaster = createToaster({ name: 'page-toaster', position: 'bottom-center' });
	const list = dt.createList(getList, TABLE.listParamsSchema, { autoLoad: true }); // filtre + sayfalama + sıralama + sorgu
	const drawer = createHashDrawer(); // #cmd=update&id=... → drawer

	type Item = Awaited<ReturnType<typeof getList>>['items'][number];
	let table = $state<ReturnType<typeof dt.DataTable<Item>>>(); // bind:this → table.helpers (copy, focus, ...)

	// create/update ortak kaydetme: gönderim, listeyi tazeleme, drawer'ı kapatma, bildirim (alan hataları inputların altında)
	const save = formInput.createFormSave({ list, drawer, onSuccess: toaster.success, onError: toaster.error });

	// Tablo içinde hücre düzenleme: doğrulama (TABLE şeması), anında gösterme, kaydetme ve hata bildirimi
	const cellEdit = dt.createCellEdit({ list, table: TABLE, save: updateCells, onError: toaster.error });
	// Satır silme: onay, silme, seçimden çıkarma, bildirim; Delete tuşu (onKeyDown) ve sağ tık hedefleri (targetsOf)
	const rowDelete = dt.createRowDelete({ list, table: () => table, remove: deleteRecords, onSuccess: toaster.success, onError: toaster.error });
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
	<input.Button icon="close" iconOnly label={t('close')} class="rounded-full!" variant="ghost" color="surface" onclick={drawer.close} />
{/snippet}

<Head title="create-read-update-delete" />

<Toasts toasterName="page-toaster" />

<Page>
	<Page.Header>
		<Page.Header.Table>
			<!-- Filtreler ve etiketleri TABLE tanımından -->
			<dt.FilterBar {list} filters={TABLE.filters} />
			<input.Button variant="ghost" color="surface" label={t('refresh')} onclick={list.refresh} disabled={list.loading} />
			{#snippet actions()}
				<input.Button variant="filled" color="primary" label={t('create')} onclick={() => drawer.show('create')} />
			{/snippet}
		</Page.Header.Table>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<!-- Kolonlar TABLE tanımından (sıralama, filtre, düzenleme izinleri orada); burada yalnızca sayfaya özgü kolonlar
				 eklenir, override ile sunum değişir (izin verilemez). Footer kısayolları (sum/avg/max/count) bu sayfadaki
				 kayıtlardan hesaplanır. -->
			<dt.DataTable
				bind:this={table}
				{list}
				{...cellEdit}
				persist="grapes-crud-simple"
				selection="multiple"
				freezeLeft={2}
				columns={TABLE.columnsFor<Item>({
					prepend: [
						{ field: '_select', type: 'select' },
						{ field: '_actions', type: 'actions', label: 'dt_actions' }
					]
				})}
				footers={[
					{ text_optional: 'Toplam', number_optional: 'sum(2)', date_optional: 'count()' },
					{ text_optional: 'Ortalama', number_optional: 'avg(2)', bool_optional: (items) => `${items.filter((item) => item.bool_optional).length} ✓` },
					{ text_optional: 'En büyük', number_optional: 'max()' }
				]}
				onKeyDown={rowDelete.onKeyDown}
				onRowActivate={(row) => drawer.show('update', row.id)}
				onLoad={({ reason, totalItems }) => reason === 'query' && totalItems === 0 && toaster.add({ type: 'info', title: t('dt_no_data') })}
				onError={(error) => toaster.error(error)}
				rowClass={(row) => (row.bool_optional ? 'font-semibold' : undefined)}
			>
				<!-- Sağ tık menüsü: konum, kapanma ve odağı tablo yönetir (ContextMenu tuşu / Shift+F10 da açar) -->
				{#snippet contextMenu(row)}
					{@const targets = rowDelete.targetsOf(row.id)}
					<dt.MenuItem label={t('update')} onclick={() => drawer.show('update', row.id)} />
					<dt.MenuItem label={t('dt_copy')} onclick={() => table?.helpers.copy()} />
					<dt.MenuItem label={targets.length > 1 ? `${t('delete')} (${targets.length})` : t('delete')} danger onclick={() => rowDelete.remove(targets)} />
				{/snippet}
				{#snippet actions(row)}
					<dt.ActionButton label={t('update')} icon="update" onclick={() => drawer.show('update', row.id)} />
					<dt.ActionButton label={t('delete')} icon="delete" class="text-error-500!" onclick={() => rowDelete.remove([row.id])} />
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
							{...form.preflight(createFormSchema).enhance(save)}
						>
							{#snippet inputs()}
								{@render recordInputs(form.fields, {})}
							{/snippet}
							{#snippet buttons({ isChanged } = {})}
								<formInput.Button variant="ghost" color="surface" label={t('close')} onclick={drawer.close} />
								<formInput.ButtonGroup>
									<formInput.Button type="reset" variant="ghost" color="surface" label={t('form_reset')} disabled={!isChanged} />
									<formInput.Button type="submit" label={t('create')} disabled={Boolean(form.pending)} />
								</formInput.ButtonGroup>
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawer.cmd === 'update' && drawer.id}
				{@const form = updateForm.for(drawer.id)}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`${t('update')} - ID: ${drawer.id}`}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						{@const record = await getOne({ id: drawer.id, timestamp: Date.now() })}
						<DrawerFormContent.Content.Form
							enctype="multipart/form-data"
							schema={updateFormSchema}
							{form}
							onIsChange={drawer.setChanged}
							{...form.preflight(updateFormSchema).enhance(save)}
						>
							{#snippet inputs()}
								<formInput.Hidden field={form.fields.id} value={record.id} />
								{@render recordInputs(form.fields, record)}
							{/snippet}
							{#snippet buttons({ isChanged } = {})}
								<formInput.Button variant="ghost" color="surface" label={t('close')} onclick={drawer.close} />
								<formInput.ButtonGroup>
									<formInput.Button type="reset" variant="ghost" color="surface" label={t('form_reset')} disabled={!isChanged} />
									<formInput.Button type="submit" variant="filled" color="surface" label={t('update')} disabled={Boolean(form.pending) || !isChanged} />
								</formInput.ButtonGroup>
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawer.cmd === 'view' && drawer.id}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`${t('view')} - ID: ${drawer.id}`}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						{@const record = await getOne({ id: drawer.id, timestamp: Date.now() })}
						<dt.RecordView {record} />
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{/if}
		</Drawer>
	</Page.Drawer>
</Page>
