<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head, DrawerFormContent } from '#lib/components/templates/index.js';
	import * as input from '#lib/components/ui/inputs/index.js';
	import * as formInput from '#lib/components/ui/form_inputs/index.js';
	import * as dt from '#lib/components/ui/datatable/index.js';
	import { Drawer, createHashDrawer } from '#lib/components/ui/drawer/index.js';
	import { confirm } from '#lib/components/ui/confirm/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	import * as v from 'valibot';
	import { TABLE, createFormSchema, updateFormSchema } from './page.shared';
	import { getOne, getList, createForm, updateForm, deleteRecord, deleteRecords, updateCell, updateCells } from './page.remote';

	const toaster = createToaster({ name: 'page-toaster', position: 'bottom-center' });
	const list = dt.createList(getList, TABLE.listParamsSchema, { autoLoad: true }); // filtre + sayfalama + sıralama + sorgu
	const drawer = createHashDrawer(); // #cmd=update&id=... → drawer

	type Item = Awaited<ReturnType<typeof getList>>['items'][number];
	let selected = $state<Item['id'][]>([]); // seçili satır id'leri (sayfalar arası korunur)
	// Kolonlar page.shared.ts'teki TABLE tanımından (sıralama, filtre, düzenleme izinleri orada). Burada yalnızca
	// sayfaya özgü kolonlar eklenir; override ile sunum değiştirilebilir (izin verilemez). TABLE'daki bir alan Item'da
	// yoksa derleme hatası verir.
	const columns = TABLE.columnsFor<Item>({
		prepend: [
			{ field: '_select', type: 'select' },
			{ field: '_actions', type: 'actions', label: 'dt_actions' }
		]
	});

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

	// Tablo içinde hücre düzenleme.
	// validateCell: kaydetmeden önce (preflight gibi) aynı şemayla doğrular; mesaj dönerse düzenleyici açık kalır.
	// editCell: kaydeder; withOverride (list.updatesWith) yeni değeri hemen gösterir, sunucu listeyi tazeleyince
	// gerçek veri gelir, hata olursa SvelteKit override'ı geri alır.
	const cellArgs = ({ row, field, value }: dt.CellEditEvent<Item>) => ({ id: row.id, field, value });
	const validateCell = (e: dt.CellEditEvent<Item>) => {
		const result = v.safeParse(TABLE.cellEditSchema, cellArgs(e));
		return result.success ? undefined : result.issues[0].message;
	};
	// Optimistik görünüm: listede ilgili kayıtlara alanları uygular (withOverride)
	const applyEdits = (edits: v.InferOutput<typeof TABLE.cellEditSchema>[]) =>
		list.updatesWith((result) => ({
			...result,
			items: result.items.map((item) => {
				const own = edits.filter((edit) => edit.id === item.id);
				return own.length ? { ...item, ...Object.fromEntries(own.map((edit) => [edit.field, edit.value])) } : item;
			})
		}));

	const editCell = async (e: dt.CellEditEvent<Item>) => {
		const args = v.parse(TABLE.cellEditSchema, cellArgs(e));
		try {
			await updateCell(args).updates(...applyEdits([args]));
		} catch (error) {
			toaster.error(error);
		}
	};

	// Ctrl+V ile yapıştırma: tek istek. Geçersiz hücreler tabloda elendi, sayısı bildirilir.
	const editCells = async (edits: dt.CellEditEvent<Item>[], { invalid }: { invalid: number }) => {
		if (invalid > 0) toaster.error(null, t('dt_paste_invalid', { count: invalid }));
		if (edits.length === 0) return;
		const args = v.parse(TABLE.cellsEditSchema, edits.map(cellArgs));
		try {
			await updateCells(args).updates(...applyEdits(args));
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

	// Toplu silme: tek kayıt için remove'a düşer. Silinenler seçimden çıkarılır.
	const removeMany = async (ids: Item['id'][]) => {
		if (ids.length === 1) return remove(ids[0]);
		if (!(await confirm({ message: t('delete_confirm_many', { count: ids.length }), yes: t('delete'), no: t('cancel'), danger: true }))) return;
		try {
			await deleteRecords({ ids }).updates(...list.updates);
			selected = selected.filter((id) => !ids.includes(id));
			toaster.success(t('toast_deleted_title'), t('toast_deleted_many', { count: ids.length }));
		} catch (error) {
			toaster.error(error);
		}
	};

	// --- DataTable olay örnekleri ---------------------------------------------------------------------------------
	let table = $state<ReturnType<typeof dt.DataTable<Item>>>(); // bind:this → table.helpers (copy, focus, ...)

	// Silinecekler: seçili satırlar; yoksa (ya da hedef satır seçimde değilse) yalnızca o satır
	const targetsOf = (rowId: Item['id']) => (selected.includes(rowId) ? selected : [rowId]);

	// Delete: seçili satırları ya da aktif hücrenin satırını siler (yerleşik davranış olmadığı için preventDefault yalnızca işlenince)
	const onTableKeyDown = (e: KeyboardEvent, { cell, selected: ids }: dt.KeyContext<Item>) => {
		if (e.key !== 'Delete') return;
		const target = ids.length > 0 ? ids : cell ? [cell.row.id] : [];
		if (target.length === 0) return;
		e.preventDefault();
		removeMany(target);
	};

	// Footer: kısayollar (sum/avg/min/max/count) ve fonksiyon; bu sayfadaki kayıtlardan hesaplanır, diğerleri metin
	const footers: dt.Footer<Item>[] = [
		{ text_optional: 'Toplam', number_optional: 'sum(2)', date_optional: 'count()' },
		{ text_optional: 'Ortalama', number_optional: 'avg(2)', bool_optional: (items) => `${items.filter((item) => item.bool_optional).length} ✓` },
		{ text_optional: 'En büyük', number_optional: 'max()' }
	];

	// Arama sonucu boş: bilgi ver (yalnızca yeni sorguda, tazelemede değil)
	const onTableLoad = ({ reason, totalItems }: dt.LoadEvent<Item>) => {
		if (reason === 'query' && totalItems === 0) toaster.add({ type: 'info', title: t('dt_no_data') });
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
		<!-- Filtreler ve etiketleri TABLE tanımından -->
		<dt.FilterBar {list} filters={TABLE.filters} />
		<input.Button variant="ghost" color="surface" label={t('refresh')} onclick={list.refresh} disabled={list.loading} />
		<div class="ml-auto flex items-center gap-2">
			<input.Button variant="filled" color="primary" label={t('create')} onclick={() => drawer.show('create')} />
		</div>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<dt.DataTable
				bind:this={table}
				{list}
				{columns}
				{footers}
				freezeLeft={2}
				selection="multiple"
				bind:selected
				persist="grapes-crud-simple"
				onCellEdit={editCell}
				onCellsEdit={editCells}
				onCopy={({ rows, cols, partial }) =>
					partial
						? toaster.add({ type: 'warning', title: t('dt_copied_title'), description: t('dt_copied_partial', { count: rows * cols }) })
						: toaster.success(t('dt_copied_title'), t('dt_copied', { count: rows * cols }))}
				{validateCell}
				onRowActivate={(row) => drawer.show('update', row.id)}
				onLoad={onTableLoad}
				onError={(error) => toaster.error(error)}
				onKeyDown={onTableKeyDown}
				rowClass={(row) => (row.bool_optional ? 'font-semibold' : undefined)}
			>
				<!-- Sağ tık menüsü: konum, kapanma ve odağı tablo yönetir (ContextMenu tuşu / Shift+F10 da açar) -->
				{#snippet contextMenu(row)}
					{@const targets = targetsOf(row.id)}
					<dt.MenuItem label={t('update')} onclick={() => drawer.show('update', row.id)} />
					<dt.MenuItem label={t('dt_copy')} onclick={() => table?.helpers.copy()} />
					<dt.MenuItem label={targets.length > 1 ? `${t('delete')} (${targets.length})` : t('delete')} danger onclick={() => removeMany(targets)} />
				{/snippet}
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
						{@const record = await getOne({ id: drawer.id, timestamp: Date.now() })}
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
						{@const record = await getOne({ id: drawer.id, timestamp: Date.now() })}
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
