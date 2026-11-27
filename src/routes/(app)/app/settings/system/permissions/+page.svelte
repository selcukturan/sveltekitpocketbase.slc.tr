<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head } from '#lib/components/templates/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { resolvePermissions, can, SUPER_ROLE_TYPES, type AclResource, type AclRole } from '#lib/app/acl/access.js';
	import { buildTree, type MenuNode } from '#lib/app/menu/tree.js';
	import { menuTitle } from '#lib/app/menu/menu.js';
	import { getPermissionData, setPermission } from './page.remote';

	// Yetki ekranı: bir özne (Herkes, rol ya da kullanıcı) seçilir; kaynak × işlem matrisinde her hücre o öznenin
	// satırıdır (İzin / Engel / Belirtilmemiş). Belirtilmemiş hücrede etkin sonuç soluk gösterilir (önizleme): rol ve
	// Herkes satırları da hesaba katılarak, app/acl/access.ts'teki aynı kuralla (resolvePermissions) tarayıcıda hesaplanır.
	const toaster = createToaster({ name: 'permissions-toaster', position: 'bottom-center' });

	type Effect = 'allow' | 'deny' | '';
	let subjectValue = $state(''); // '' = Herkes, 'role:<id>', 'user:<id>'
	let busy = $state<string | null>(null); // kaydedilen hücre

	const cellKey = (resource: string, action: string) => `${resource}|${action}`;

	async function toggle(resource: AclResource, actionId: string, current: Effect) {
		// Rol ve Herkes: Belirtilmemiş ↔ İzin. Kullanıcı: Belirtilmemiş → İzin → Engel → Belirtilmemiş.
		const next: Effect = current === '' ? 'allow' : current === 'allow' && subject.kind === 'user' ? 'deny' : '';
		busy = cellKey(resource.id, actionId);
		try {
			await setPermission({ resource: resource.id, action: actionId, role: subject.role, user: subject.user, effect: next });
		} catch (error) {
			toaster.error(error);
		} finally {
			busy = null;
		}
	}

	// await en sonda: await'ten sonraki kod bileşen bağlamında çalışmaz (getContext: createToaster… hata verir)
	const data = $derived(await getPermissionData());

	const subject = $derived.by(() => {
		const [kind, id = ''] = subjectValue.split(':');
		if (kind === 'role') {
			const role = data.roles.find((r) => r.id === id);
			return { kind: 'role' as const, role: id, user: '', roles: role ? [role] : [] };
		}
		if (kind === 'user') {
			const user = data.users.find((u) => u.id === id);
			const roles = data.roles.filter((r) => user?.role.includes(r.id));
			return { kind: 'user' as const, role: '', user: id, roles };
		}
		return { kind: 'everyone' as const, role: '', user: '', roles: [] as AclRole[] };
	});
	const isSuper = $derived(subject.roles.some((r) => r.status === 'active' && SUPER_ROLE_TYPES.includes(r.type)));

	// Öznenin kendi satırları (hücre → effect) ve etkin izinler
	const own = $derived(new Map(data.permissions.filter((p) => p.role === subject.role && p.user === subject.user).map((p) => [cellKey(p.resource, p.action), p.effect])));
	const access = $derived(
		resolvePermissions({
			subject: { id: subject.user, roles: subject.roles },
			actions: data.actions,
			resources: data.resources,
			permissions: data.permissions
		})
	);

	// Satırlar: kaynak ağacı derinlik sırasıyla (menü, sonra uygulama özellikleri)
	type Row = { resource: AclResource; depth: number };
	const rows = $derived.by(() => {
		const byId = new Map(data.resources.map((r) => [r.id, r]));
		const tree = buildTree(data.resources.map((r) => ({ id: r.id, parent_id: r.parent || null, title: r.label, sort: r.sort })));
		const out: Row[] = [];
		const walk = (nodes: MenuNode[], depth: number) => {
			for (const node of nodes) {
				out.push({ resource: byId.get(node.id)!, depth });
				walk(node.children, depth + 1);
			}
		};
		walk(tree, 0);
		return out;
	});

	const actionTitle = (a: { key: string; label: string }) => t(`acl.action.${a.key}`, undefined, a.label);
	const resourceTitle = (r: AclResource) => menuTitle({ id: r.key, title: r.label });
	const hint = $derived(subject.kind === 'user' ? t('acl_user_hint') : subject.kind === 'role' ? t('acl_role_hint') : t('acl_everyone_hint'));
</script>

<Head>
	<title>{t('acl_title')} - SLC Web Applications</title>
</Head>

<Toasts toasterName="permissions-toaster" />

<Page>
	<Page.Header>
		<h1 class="text-lg font-semibold">{t('acl_title')}</h1>
		<label class="ml-4 flex items-center gap-2 text-sm">
			<span class="text-surface-600">{t('acl_subject')}</span>
			<select bind:value={subjectValue} class="border-surface-300 bg-surface-50 rounded border px-2 py-1">
				<option value="">{t('acl_everyone')}</option>
				<optgroup label={t('acl_roles')}>
					{#each data.roles as role (role.id)}
						<option value="role:{role.id}">{role.label}{role.status === 'active' ? '' : ' (–)'}</option>
					{/each}
				</optgroup>
				<optgroup label={t('acl_users')}>
					{#each data.users as user (user.id)}
						<option value="user:{user.id}">{user.label || user.email}</option>
					{/each}
				</optgroup>
			</select>
		</label>
	</Page.Header>
	<Page.Main>
		<div class="flex h-full flex-col gap-3 overflow-auto p-4">
			<div class="text-surface-600 flex flex-col gap-1 text-sm">
				{#if !data.canEdit}<p role="status" class="text-warning-800">{t('acl_readonly')}</p>{/if}
				{#if isSuper}<p role="status" class="text-warning-800">{t('acl_super_role')}</p>{/if}
				<p>{hint}</p>
				<p class="flex flex-wrap items-center gap-3" aria-label={t('acl_legend')}>
					<span class="slc-cell slc-allow">✓</span>{t('acl_allow')}
					<span class="slc-cell slc-deny">✕</span>{t('acl_deny')}
					<span class="slc-cell slc-inherited">✓</span>{t('acl_inherited_allow')}
					<span class="slc-cell">·</span>{t('acl_inherited_deny')}
				</p>
			</div>

			<table class="slc-matrix bg-surface-50 border-surface-200 w-max border-collapse rounded border text-sm" data-testid="acl-matrix">
				<thead>
					<tr>
						<th scope="col" class="text-left">{t('acl_resource')}</th>
						{#each data.actions as action (action.id)}
							<th scope="col">{actionTitle(action)}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each rows as { resource, depth }, i (resource.id)}
						{#if resource.kind === 'feature' && rows[i - 1]?.resource.kind !== 'feature'}
							<tr><th colspan={data.actions.length + 1} scope="colgroup" class="text-surface-500 pt-4 text-left">{t('acl_features')}</th></tr>
						{/if}
						<tr class:opacity-50={!resource.active}>
							<th scope="row" class="text-left font-normal" class:font-semibold={resource.kind === 'module' || resource.kind === 'group'}>
								<span style:padding-left="{resource.kind === 'feature' ? 0 : depth * 1.25}rem">{resourceTitle(resource)}</span>
							</th>
							{#each data.actions as action (action.id)}
								<td class="text-center">
									{#if resource.actions.includes(action.id)}
										{@const effect = (own.get(cellKey(resource.id, action.id)) ?? '') as Effect}
										{@const allowed = can(access, resource.key, action.key)}
										{@const state =
											effect === 'allow'
												? t('acl_allow')
												: effect === 'deny'
													? t('acl_deny')
													: `${t('acl_unset')} (${allowed ? t('acl_inherited_allow') : t('acl_inherited_deny')})`}
										<button
											type="button"
											class="slc-cell"
											class:slc-allow={effect === 'allow'}
											class:slc-deny={effect === 'deny'}
											class:slc-inherited={effect === '' && allowed}
											disabled={!data.canEdit || busy !== null}
											aria-busy={busy === cellKey(resource.id, action.id)}
											aria-label={t('acl_cell_label', { resource: resourceTitle(resource), action: actionTitle(action), state })}
											title={state}
											onclick={() => toggle(resource, action.id, effect)}
										>
											{#if busy === cellKey(resource.id, action.id)}
												<Icon name="loader" size={14} class="animate-spin" />
											{:else}
												{effect === 'deny' ? '✕' : effect === 'allow' || allowed ? '✓' : '·'}
											{/if}
										</button>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Page.Main>
</Page>

<style>
	.slc-matrix :is(th, td) {
		padding: 0.25rem 0.5rem;
		border-bottom: 1px solid var(--color-surface-200);
		white-space: nowrap;
	}
	.slc-matrix thead th {
		position: sticky;
		top: 0;
		z-index: 1;
		background-color: var(--color-surface-100);
	}
	.slc-cell {
		display: inline-flex;
		width: 1.75rem;
		height: 1.75rem;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--color-surface-300);
		border-radius: 0.375rem;
		color: var(--color-surface-400);
	}
	button.slc-cell:not(:disabled) {
		cursor: pointer;
	}
	button.slc-cell:not(:disabled):hover {
		border-color: var(--color-surface-600);
	}
	.slc-allow {
		border-color: var(--color-success-600);
		background-color: var(--color-success-100);
		color: var(--color-success-800);
		font-weight: 600;
	}
	.slc-deny {
		border-color: var(--color-error-600);
		background-color: var(--color-error-100);
		color: var(--color-error-800);
		font-weight: 600;
	}
	.slc-inherited {
		color: var(--color-success-600);
	}
</style>
