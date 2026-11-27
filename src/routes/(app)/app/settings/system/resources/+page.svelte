<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head, DrawerFormContent } from '#lib/components/templates/index.js';
	import * as input from '#lib/components/ui/inputs/index.js';
	import * as formInput from '#lib/components/ui/form_inputs/index.js';
	import * as dt from '#lib/components/ui/datatable/index.js';
	import { Drawer, createHashDrawer } from '#lib/components/ui/drawer/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	import { Icon, type IconKey } from '#lib/components/icons/index.js';
	import { can } from '#lib/app/acl/access.js';
	import { menuTitle } from '#lib/app/menu/menu.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';
	import { RESOURCES, ACTIONS, KINDS, ICONS, resourceCreateSchema, resourceUpdateSchema, actionCreateSchema, type ResourceRow, type ActionRow } from './page.shared';
	import {
		getResources,
		getActions,
		createResource,
		updateResource,
		updateResourceCells,
		deleteResources,
		createAction,
		updateActionCells,
		deleteActions
	} from './page.remote';

	// Kaynak (menü) ve işlem düzenleme. Üstte kaynaklar (ağaç sırası; hücrede ad, ikon, adres, eşleşme, sıra, aktif, gizli
	// düzenlenir; anahtar ve tür oluşturulduktan sonra değişmez; üst kaynak ve işlemler drawer formundan), altta işlemler.
	// Kurallar sunucuda (page.shared.ts → checkResource): adres gerçek bir sayfa olmalı, sayfanın erişim işlemi olmalı…
	const toaster = createToaster({ name: 'resources-toaster', position: 'bottom-center' });
	const resourceList = dt.createList(getResources, RESOURCES.listParamsSchema);
	const actionList = dt.createList(getActions, ACTIONS.listParamsSchema);
	const drawer = createHashDrawer({ noIdCommands: ['create', 'create-action'] });

	let resourceTable = $state<ReturnType<typeof dt.DataTable<ResourceRow>>>();
	let actionTable = $state<ReturnType<typeof dt.DataTable<ActionRow>>>();

	const saveResource = formInput.createFormSave({ list: resourceList, drawer, onSuccess: toaster.success, onError: toaster.error });
	const saveAction = formInput.createFormSave({ list: actionList, drawer, onSuccess: toaster.success, onError: toaster.error });
	const resourceCellEdit = dt.createCellEdit({ list: resourceList, table: RESOURCES, save: updateResourceCells, onError: toaster.error });
	const actionCellEdit = dt.createCellEdit({ list: actionList, table: ACTIONS, save: updateActionCells, onError: toaster.error });
	const resourceDelete = dt.createRowDelete({
		list: resourceList,
		table: () => resourceTable,
		remove: deleteResources,
		onSuccess: toaster.success,
		onError: toaster.error
	});
	const actionDelete = dt.createRowDelete({ list: actionList, table: () => actionTable, remove: deleteActions, onSuccess: toaster.success, onError: toaster.error });

	// Seçenekler (formlar): üst kaynak yalnızca modül ya da grup; işlemler işlem tablosundan
	const resourceRows = $derived(resourceList.query?.current?.items ?? []);
	const parentOptions = $derived(
		resourceRows
			.filter((r) => r.kind === 'module' || r.kind === 'group')
			.map((r) => ({ value: r.id, label: `${'— '.repeat(r.depth)}${menuTitle({ id: r.key, title: r.label })}` }))
	);
	const actionOptions = $derived((actionList.query?.current?.items ?? []).map((a) => ({ value: a.id, label: t(`acl.action.${a.key}`, undefined, a.label) })));
	const accessId = $derived((actionList.query?.current?.items ?? []).find((a) => a.key === 'access')?.id);
	const kindOptions = KINDS.map((kind) => ({ value: kind, label: t(`acl_kind_${kind}`) }));
	const iconOptions = ICONS.map((icon) => ({ value: icon, label: icon }));

	const resourceColumns = RESOURCES.columnsFor<ResourceRow>({
		prepend: [{ field: '_actions', type: 'actions', label: 'dt_actions' }],
		// Adres yalnızca sayfa ve modülde, eşleşme yalnızca adresi olanda (sunucu da denetler)
		override: {
			href: { editable: (row) => row.kind === 'page' || row.kind === 'module' },
			match: { editable: (row) => row.href !== '' }
		}
	});
	const actionColumns = ACTIONS.columnsFor<ActionRow>({ prepend: [{ field: '_actions', type: 'actions', label: 'dt_actions' }] });

	// await en sonda: await'ten sonraki kod bileşen bağlamında çalışmaz (getContext: createToaster… hata verir)
	const access = $derived((await getMyAccess()).access);
	const allow = $derived({
		create: can(access, 'settings.system.resources', 'create'),
		update: can(access, 'settings.system.resources', 'update'),
		delete: can(access, 'settings.system.resources', 'delete')
	});
</script>

{#snippet resourceInputs(fields: typeof createResource.fields | typeof updateResource.fields, data: Partial<ResourceRow>)}
	<formInput.Text label={t('acl_res_label')} field={fields.label} value={data.label} />
	<formInput.Select label={t('acl_res_parent')} field={fields.parent} value={data.parent ?? ''} options={parentOptions} />
	<formInput.Select label={t('acl_res_icon')} field={fields.icon} value={data.icon ?? ''} options={iconOptions} />
	<formInput.Text label={t('acl_res_href')} field={fields.href} value={data.href} />
	<formInput.Select label={t('acl_res_match')} field={fields.match} value={data.match || 'exact'} />
	<formInput.Number label={t('acl_res_sort')} field={fields.sort} value={data.sort} />
	<formInput.Select label={t('acl_res_actions')} field={fields.actions} value={data.actionIds ?? []} options={actionOptions} />
	<formInput.Bool label={t('acl_res_active')} text={t('acl_res_active')} field={fields.active} value={data.active ?? true} />
	<formInput.Bool label={t('acl_res_hidden')} text={t('acl_res_hidden_text')} field={fields.hidden} value={data.hidden ?? false} />
{/snippet}

{#snippet closeButton()}
	<input.Button icon="close" iconOnly label={t('close')} class="rounded-full!" variant="ghost" color="surface" onclick={drawer.close} />
{/snippet}

{#snippet formButtons(pending: boolean, isChanged: boolean | undefined, create: boolean)}
	<formInput.Button variant="ghost" color="surface" label={t('close')} onclick={drawer.close} />
	<formInput.ButtonGroup>
		<formInput.Button type="reset" variant="ghost" color="surface" label={t('form_reset')} disabled={!isChanged} />
		<formInput.Button type="submit" label={create ? t('create') : t('update')} disabled={pending || (!create && !isChanged)} />
	</formInput.ButtonGroup>
{/snippet}

<Head>
	<title>{t('acl_resources_title')} - SLC Web Applications</title>
</Head>

<Toasts toasterName="resources-toaster" />

<Page>
	<Page.Header>
		<h1 class="text-lg font-semibold">{t('acl_resources_title')}</h1>
		<div class="ml-auto flex gap-2">
			{#if allow.create}
				<input.Button variant="filled" color="primary" label={t('acl_resource_create')} onclick={() => drawer.show('create')} />
				<input.Button variant="ghost" color="surface" label={t('acl_action_create')} onclick={() => drawer.show('create-action')} />
			{/if}
		</div>
	</Page.Header>
	<Page.Main>
		<div class="flex h-full min-h-0 flex-col gap-3 p-3">
			<p class="text-surface-600 px-1 text-sm">{t('acl_resources_hint')}</p>
			<div class="border-surface-200 flex min-h-0 flex-[3] flex-col overflow-hidden rounded-lg border" data-testid="acl-resources">
				<dt.DataTable
					bind:this={resourceTable}
					list={resourceList}
					columns={resourceColumns}
					{...allow.update ? resourceCellEdit : {}}
					onKeyDown={allow.delete ? resourceDelete.onKeyDown : undefined}
					onRowActivate={(row) => allow.update && drawer.show('update', row.id)}
					onError={(error) => toaster.error(error)}
					persist="acl-resources"
					freezeLeft={2}
					rowClass={(row) => (row.active ? undefined : 'opacity-50')}
				>
					{#snippet dataRow(dr)}
						<dt.DataRow {dr}>
							{#snippet dataCell(dc)}
								{#if dc.col.data.type === 'actions'}
									<dt.DataCell {dr} {dc}>
										<div class="flex h-full w-full items-center justify-center gap-1">
											{#if allow.update}<dt.ActionButton label={t('update')} icon="update" onclick={() => drawer.show('update', dr.row.id)} />{/if}
											{#if allow.delete}
												<dt.ActionButton label={t('delete')} icon="delete" class="text-error-500!" onclick={() => resourceDelete.remove([dr.row.id])} />
											{/if}
										</div>
									</dt.DataCell>
								{:else if dc.col.data.field === 'label'}
									<dt.DataCell {dr} {dc} class={dr.row.kind === 'module' || dr.row.kind === 'group' ? 'font-semibold' : undefined}>
										<span class="flex min-w-0 items-center gap-1.5" style:padding-left="{dr.row.depth * 1.25}rem">
											{#if dr.row.icon && ICONS.includes(dr.row.icon)}<Icon name={dr.row.icon as IconKey} size={16} />{/if}
											<span class="truncate">{dr.row.label}</span>
										</span>
									</dt.DataCell>
								{:else if dc.col.data.field === 'kind'}
									<dt.DataCell {dr} {dc}>{t(`acl_kind_${dr.row.kind}`)}</dt.DataCell>
								{:else}
									<dt.DataCell {dr} {dc} />
								{/if}
							{/snippet}
						</dt.DataRow>
					{/snippet}
				</dt.DataTable>
			</div>
			<div class="border-surface-200 flex min-h-0 flex-[2] flex-col overflow-hidden rounded-lg border" data-testid="acl-actions">
				<dt.DataTable
					bind:this={actionTable}
					list={actionList}
					columns={actionColumns}
					{...allow.update ? actionCellEdit : {}}
					onKeyDown={allow.delete ? actionDelete.onKeyDown : undefined}
					onError={(error) => toaster.error(error)}
					persist="acl-actions"
				>
					{#snippet actions(row)}
						{#if allow.delete}
							<dt.ActionButton label={t('delete')} icon="delete" class="text-error-500!" onclick={() => actionDelete.remove([row.id])} />
						{/if}
					{/snippet}
				</dt.DataTable>
			</div>
		</div>
	</Page.Main>
	<Page.Drawer>
		<Drawer bind:this={drawer.ref} {@attach drawer.watch} onBeforeClose={drawer.beforeClose}>
			{#if drawer.cmd === 'create' && allow.create}
				{@const form = createResource.for('create')}
				<DrawerFormContent>
					<DrawerFormContent.Header label={t('acl_resource_create')}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						<DrawerFormContent.Content.Form
							schema={resourceCreateSchema}
							{form}
							onIsChange={drawer.setChanged}
							{...form.preflight(resourceCreateSchema).enhance(saveResource)}
						>
							{#snippet inputs()}
								<formInput.Text label={t('acl_res_key')} field={form.fields.key} />
								<formInput.Select label={t('acl_res_kind')} field={form.fields.kind} value="page" options={kindOptions} />
								{@render resourceInputs(form.fields, { actionIds: accessId ? [accessId] : [] })}
							{/snippet}
							{#snippet buttons({ isChanged } = {})}
								{@render formButtons(Boolean(form.pending), isChanged, true)}
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawer.cmd === 'update' && drawer.id && allow.update}
				{@const form = updateResource.for(drawer.id)}
				{@const record = resourceRows.find((r) => r.id === drawer.id)}
				<DrawerFormContent>
					<DrawerFormContent.Header label={`${t('update')} - ${record?.key ?? drawer.id}`}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						{#if record}
							<DrawerFormContent.Content.Form
								schema={resourceUpdateSchema}
								{form}
								onIsChange={drawer.setChanged}
								{...form.preflight(resourceUpdateSchema).enhance(saveResource)}
							>
								{#snippet inputs()}
									<formInput.Hidden field={form.fields.id} value={record.id} />
									<p class="text-surface-600 text-sm">{t('acl_res_key')}: <code>{record.key}</code> · {t(`acl_kind_${record.kind}`)}</p>
									{@render resourceInputs(form.fields, record)}
								{/snippet}
								{#snippet buttons({ isChanged } = {})}
									{@render formButtons(Boolean(form.pending), isChanged, false)}
								{/snippet}
							</DrawerFormContent.Content.Form>
						{:else}
							<p>{t('error_not_found')}</p>
						{/if}
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{:else if drawer.cmd === 'create-action' && allow.create}
				{@const form = createAction.for('create-action')}
				<DrawerFormContent>
					<DrawerFormContent.Header label={t('acl_action_create')}>{@render closeButton()}</DrawerFormContent.Header>
					<DrawerFormContent.Content boundary>
						<DrawerFormContent.Content.Form schema={actionCreateSchema} {form} onIsChange={drawer.setChanged} {...form.preflight(actionCreateSchema).enhance(saveAction)}>
							{#snippet inputs()}
								<formInput.Text label={t('acl_res_key')} field={form.fields.key} />
								<formInput.Text label={t('acl_res_label')} field={form.fields.label} />
								<formInput.Number label={t('acl_res_sort')} field={form.fields.sort} />
							{/snippet}
							{#snippet buttons({ isChanged } = {})}
								{@render formButtons(Boolean(form.pending), isChanged, true)}
							{/snippet}
						</DrawerFormContent.Content.Form>
					</DrawerFormContent.Content>
				</DrawerFormContent>
			{/if}
		</Drawer>
	</Page.Drawer>
</Page>
