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
	import { DemoCrudSelectOptionalSingleOptions } from '#lib/types/pocketbase-types.js';
	import { listParamsSchema, createFormSchema, updateFormSchema, cellEditSchema, cellsEditSchema } from './page.shared';
	import { getOne, getList, createForm, updateForm, deleteRecord, deleteRecords, updateCell, updateCells, seedRecords, deleteSeedRecords } from './page.remote';

	const toaster = createToaster({ name: 'page-toaster', position: 'bottom-center' });
	const list = dt.createList(getList, listParamsSchema, { autoLoad: true }); // filtre + sayfalama + sıralama + sorgu
	const drawer = createHashDrawer(); // #cmd=update&id=... → drawer

	type Item = Awaited<ReturnType<typeof getList>>['items'][number];
	let selected = $state<Item['id'][]>([]); // seçili satır id'leri (sayfalar arası korunur)
	const columns: dt.Column<Item>[] = [
		{ field: '_select', type: 'select' },
		{ field: '_actions', type: 'actions', label: 'dt_actions' },
		{ field: 'id', label: 'dt_id', width: 'minmax(50px,1fr)' },
		{ field: 'text_required', label: 'dt_text_required', width: 'minmax(50px,1fr)', editable: true },
		{ field: 'text_optional', label: 'dt_text_optional', width: 'minmax(50px,1fr)', editable: true },
		{ field: 'number_optional', label: 'number_optional', type: 'number', width: '130px', editable: true },
		{ field: 'select_optional_single', label: 'select_optional_single', width: '150px', editable: true, options: Object.values(DemoCrudSelectOptionalSingleOptions) },
		{ field: 'select_optional_multiple', label: 'select_optional_multiple', type: 'list', width: '180px' },
		{ field: 'date_optional', label: 'date_optional', type: 'date', width: '130px', editable: true },
		{ field: 'bool_optional', label: 'bool_optional', type: 'bool', width: '120px', editable: true },
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

	// Tablo içinde hücre düzenleme.
	// validateCell: kaydetmeden önce (preflight gibi) aynı şemayla doğrular; mesaj dönerse düzenleyici açık kalır.
	// editCell: kaydeder; withOverride (list.updatesWith) yeni değeri hemen gösterir, sunucu listeyi tazeleyince
	// gerçek veri gelir, hata olursa SvelteKit override'ı geri alır.
	const cellArgs = ({ row, field, value }: dt.CellEditEvent<Item>) => ({ id: row.id, field, value });
	const validateCell = (e: dt.CellEditEvent<Item>) => {
		const result = v.safeParse(cellEditSchema, cellArgs(e));
		return result.success ? undefined : result.issues[0].message;
	};
	// Optimistik görünüm: listede ilgili kayıtlara alanları uygular (withOverride)
	const applyEdits = (edits: v.InferOutput<typeof cellEditSchema>[]) =>
		list.updatesWith((result) => ({
			...result,
			items: result.items.map((item) => {
				const own = edits.filter((edit) => edit.id === item.id);
				return own.length ? { ...item, ...Object.fromEntries(own.map((edit) => [edit.field, edit.value])) } : item;
			})
		}));

	const editCell = async (e: dt.CellEditEvent<Item>) => {
		const args = v.parse(cellEditSchema, cellArgs(e));
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
		const args = v.parse(cellsEditSchema, edits.map(cellArgs));
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

	// Sağ tık menüsü: hücrenin üzerinde açılır (popover + fixed konum); seçim/aralık korunur
	let menu = $state<{ x: number; y: number; row: Item }>();
	const menuPopover = (node: HTMLElement) => {
		node.showPopover();
		const off = () => (menu = undefined);
		node.addEventListener('toggle', (e) => (e as ToggleEvent).newState === 'closed' && off());
		return () => node.hidePopover();
	};
	// Sıra önemli: odak tabloya (onay penceresi açılırsa odağı o alır), işlem (menüdeki satırı okur), en son menü kapanır
	const menuAction = (run: () => void) => () => {
		table?.helpers.focus();
		run();
		menu = undefined;
	};

	// Footer: kısayollar (sum/avg/min/max/count) ve fonksiyon; bu sayfadaki kayıtlardan hesaplanır, diğerleri metin
	const footers: dt.Footer<Item>[] = [
		{ text_optional: 'Toplam', number_optional: 'sum(2)', date_optional: 'count()' },
		{ text_optional: 'Ortalama', number_optional: 'avg(2)', bool_optional: (items) => `${items.filter((item) => item.bool_optional).length} ✓` },
		{ text_optional: 'En büyük', number_optional: 'max()' }
	];

	// Görünen satırlar (onVisibleRowsChange): durum çubuğunda gösterilir. Sonsuz kaydırma gibi işler için de kullanılabilir.
	let visibleRows = $state<dt.VisibleRows>();

	// Arama sonucu boş: bilgi ver (yalnızca yeni sorguda, tazelemede değil)
	const onTableLoad = ({ reason, totalItems }: dt.LoadEvent<Item>) => {
		if (reason === 'query' && totalItems === 0) toaster.add({ type: 'info', title: t('dt_no_data') });
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
		<input.Button variant="filled" label={t('search')} onclick={list.search} />
		<input.Button variant="ghost" color="surface" label={t('refresh')} onclick={list.refresh} disabled={list.loading} />
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
				onContextMenu={({ row, event }) => (menu = { x: event.clientX, y: event.clientY, row })}
				rowClass={(row) => (row.bool_optional ? 'font-semibold' : undefined)}
				onVisibleRowsChange={(rows) => (visibleRows = rows)}
			>
				{#snippet statusbar()}
					{#if visibleRows && visibleRows.total > 0}
						<p class="slc-visible-rows">{t('dt_visible_rows', { from: visibleRows.first + 1, to: visibleRows.last + 1, total: visibleRows.total })}</p>
					{/if}
				{/snippet}
				{#snippet actions(row)}
					<dt.ActionButton label={t('update')} icon="update" onclick={() => drawer.show('update', row.id)} />
					<dt.ActionButton label={t('delete')} icon="delete" class="text-error-500!" onclick={() => remove(row.id)} />
					<dt.ActionButton label={t('view')} icon="view" onclick={() => drawer.show('view', row.id)} />
				{/snippet}
			</dt.DataTable>
			{#if menu}
				{@const row = menu.row}
				<div class="slc-context-menu" role="menu" popover="auto" style:left="{menu.x}px" style:top="{menu.y}px" {@attach menuPopover}>
					<button type="button" role="menuitem" onclick={menuAction(() => drawer.show('update', row.id))}>{t('update')}</button>
					<button type="button" role="menuitem" onclick={menuAction(() => table?.helpers.copy())}>{t('dt_copy')}</button>
					<button type="button" role="menuitem" class="danger" onclick={menuAction(() => removeMany(targetsOf(row.id)))}>
						{t('delete')}{targetsOf(row.id).length > 1 ? ` (${targetsOf(row.id).length})` : ''}
					</button>
				</div>
			{/if}
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

<style>
	/* Sağ tık menüsü: imlecin olduğu yerde (popover üst katmanda; fixed konum) */
	.slc-context-menu {
		position: fixed;
		inset: auto;
		margin: 0;
		display: flex;
		flex-direction: column;
		min-width: 10rem;
		padding: 0.25rem;
		border: 1px solid var(--color-surface-300);
		border-radius: 0.5rem;
		background-color: var(--color-surface-50);
		box-shadow: 0 8px 24px -6px color-mix(in srgb, black 25%, transparent);
	}
	.slc-context-menu button {
		padding: 0.375rem 0.625rem;
		border-radius: 0.25rem;
		text-align: left;
		cursor: pointer;
	}
	.slc-context-menu button:hover,
	.slc-context-menu button:focus-visible {
		background-color: var(--color-surface-200);
		outline: none;
	}
	.slc-visible-rows {
		padding: 0.125rem 0.75rem 0.25rem;
		font-size: 0.75rem;
		color: var(--color-surface-500);
	}
	.slc-context-menu .danger {
		color: var(--color-error-600);
	}
</style>
