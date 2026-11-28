<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head } from '#lib/components/templates/index.js';
	import * as input from '#lib/components/ui/inputs/index.js';
	import * as dt from '#lib/components/ui/datatable/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	import { SUPER_ROLE_TYPES } from '#lib/app/acl/access.js';
	import { menuTitle } from '#lib/app/menu/menu.js';
	import { matrixParamsSchema, parseSubject, ACTION_FIELD, type MatrixRow, type Effect } from './page.shared';
	import { getPermissionSubjects, getPermissionMatrix, setPermissions } from './page.remote';

	// Yetki ekranı: bir özne (Herkes, rol ya da kullanıcı) seçilir; DataTable'da satır = kaynak, kolon = işlem. Hücre
	// öznenin kendi satırıdır (İzin / Engel / boş = belirtilmemiş). Boş hücrede etkin sonuç soluk gösterilir (önizleme;
	// sunucuda aynı kuralla hesaplanır). Düzenleme tablonun kendisiyle: Enter ya da çift tıklama açılır listeyi açar;
	// Ctrl+C / Ctrl+V ile bir satırın izinleri başka satırlara toplu yapıştırılır (tek istek).
	const toaster = createToaster({ name: 'permissions-toaster', position: 'bottom-center' });
	const list = dt.createList(getPermissionMatrix, matrixParamsSchema);

	let subjectValue = $state('everyone');
	const changeSubject = (value: string) => {
		list.filter.subject = value;
		list.search();
	};

	// Kayıtlar sırayla gider: aynı hücre art arda değiştirilirse (İzin → boş) istekler sunucuya ters sırada varıp eski
	// değeri bırakmasın. Özne düzenleme anında alınır (sırada beklerken özne değişse de doğru özneye yazılır).
	let queue: Promise<void> = Promise.resolve();
	const save = (edits: dt.CellEditEvent<MatrixRow>[]) => {
		const subjectAtEdit = subjectValue;
		return (queue = queue.then(() => send(subjectAtEdit, edits)));
	};

	async function send(subjectAtEdit: string, edits: dt.CellEditEvent<MatrixRow>[]) {
		const actionId = new Map(subjects.actions.map((a) => [`${ACTION_FIELD}${a.key}`, a.id]));
		const cells = edits.map((e) => ({ resource: e.row.id, action: actionId.get(e.field as string)!, effect: (e.value as Effect | null) ?? null }));
		const patch = new Map(edits.map((e) => [`${e.row.id}|${e.field as string}`, e.value]));
		try {
			// Optimistik: yeni değer yanıt beklenmeden görünür; sunucu tazelenmiş matrisi (etkin sonuçlarla) aynı yanıtta gönderir
			await setPermissions({ subject: subjectAtEdit, edits: cells }).updates(
				...list.updatesWith((rows) =>
					rows.map((row) => {
						const changed = Object.keys(row).filter((field) => patch.has(`${row.id}|${field}`));
						return changed.length ? { ...row, ...Object.fromEntries(changed.map((field) => [field, patch.get(`${row.id}|${field}`)])) } : row;
					})
				)
			);
		} catch (error) {
			toaster.error(error);
		}
	}

	// await en sonda: await'ten sonraki kod bileşen bağlamında çalışmaz (getContext: createToaster… hata verir)
	const subjects = $derived(await getPermissionSubjects());

	const subject = $derived(parseSubject(subjectValue));
	const subjectOptions = $derived([
		{ value: 'everyone', label: t('acl_everyone') },
		...subjects.roles.map((r) => ({ value: `role:${r.id}`, label: `${t('acl_role')}: ${r.label}${r.status === 'active' ? '' : ' (–)'}` })),
		...subjects.users.map((u) => ({ value: `user:${u.id}`, label: `${t('acl_user')}: ${u.label || u.email}` }))
	]);
	const isSuper = $derived.by(() => {
		const user = subjects.users.find((u) => u.id === subject.user);
		const roles = subjects.roles.filter((r) => r.id === subject.role || user?.role.includes(r.id));
		return roles.some((r) => r.status === 'active' && SUPER_ROLE_TYPES.includes(r.type));
	});

	// Kolonlar işlemlerden (veritabanı): kaynak adı + işlem başına bir hücre. Engel seçeneği yalnızca kullanıcıda.
	const effectOptions = $derived([{ value: 'allow', label: t('acl_allow') }, ...(subject.kind === 'user' ? [{ value: 'deny', label: t('acl_deny') }] : [])]);
	const columns = $derived<dt.Column<MatrixRow>[]>([
		{ field: 'label', label: 'acl_resource', width: 'minmax(260px,2fr)', sortable: false },
		...subjects.actions.map((a): dt.Column<MatrixRow> => ({
			field: `${ACTION_FIELD}${a.key}`,
			label: t(`acl.action.${a.key}`, undefined, a.label),
			width: 'minmax(95px,1fr)',
			align: 'center',
			sortable: false,
			editable: subjects.canEdit,
			options: effectOptions
		}))
	]);

	// Yapıştırılan değer de buradan geçer: yalnızca allow / deny / boş; rol ve Herkes'te deny yok
	const validateCell = (e: dt.CellEditEvent<MatrixRow>) => {
		if (e.value === null) return undefined;
		if (e.value !== 'allow' && e.value !== 'deny') return t('acl_invalid_effect');
		if (e.value === 'deny' && subject.kind !== 'user') return t('acl_role_deny');
		return undefined;
	};

	const hint = $derived(subject.kind === 'user' ? t('acl_user_hint') : subject.kind === 'role' ? t('acl_role_hint') : t('acl_everyone_hint'));
</script>

<Head>
	<title>{t('acl_title')} - {t('app_name')}</title>
</Head>

<Toasts toasterName="permissions-toaster" />

<Page>
	<Page.Header>
		<h1 class="text-lg font-semibold">{t('acl_title')}</h1>
		<div class="ml-4 w-80 max-w-full">
			<input.Select
				required
				aria-label={t('acl_subject')}
				options={subjectOptions}
				bind:value={subjectValue}
				onValueChange={({ value, initial }) => !initial && changeSubject(value)}
			/>
		</div>
	</Page.Header>
	<Page.Main>
		<div class="flex h-full min-h-0 flex-col gap-2 p-3">
			<div class="text-surface-600 flex flex-col gap-1 px-1 text-sm">
				{#if !subjects.canEdit}<p role="status" class="text-warning-800">{t('acl_readonly')}</p>{/if}
				{#if isSuper}<p role="status" class="text-warning-800">{t('acl_super_role')}</p>{/if}
				<p>{hint}</p>
				<p class="flex flex-wrap items-center gap-3" aria-label={t('acl_legend')}>
					<span class="slc-acl slc-allow">✓</span>{t('acl_allow')}
					<span class="slc-acl slc-deny">✕</span>{t('acl_deny')}
					<span class="slc-acl slc-inherited">✓</span>{t('acl_inherited_allow')}
					<span class="slc-acl">·</span>{t('acl_inherited_deny')}
				</p>
			</div>
			<div class="border-surface-200 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border" data-testid="acl-matrix">
				<dt.DataTable
					{list}
					{columns}
					{validateCell}
					onCellEdit={subjects.canEdit ? (e) => save([e]) : undefined}
					onCellsEdit={subjects.canEdit
						? async (edits, { invalid }) => {
								if (invalid > 0) toaster.error(null, t('dt_paste_invalid', { count: invalid }));
								if (edits.length > 0) await save(edits);
							}
						: undefined}
					onError={(error) => toaster.error(error)}
					persist="acl-permissions"
					freezeLeft={1}
					borders="both"
					rowClass={(row) => (row.active ? undefined : 'opacity-50')}
				>
					{#snippet dataRow(dr)}
						<dt.DataRow {dr}>
							{#snippet dataCell(dc)}
								{@const field = dc.col.data.field as string}
								{#if field === 'label'}
									<dt.DataCell {dr} {dc} class={dr.row.kind === 'module' || dr.row.kind === 'group' ? 'font-semibold' : undefined}>
										<span class="truncate" style:padding-left="{dr.row.kind === 'feature' ? 0 : dr.row.depth * 1.25}rem">
											{menuTitle({ id: dr.row.key, title: dr.row.label })}
										</span>
										{#if dr.row.kind === 'feature'}<span class="text-surface-500 ml-2 text-xs">({t('acl_feature')})</span>{/if}
									</dt.DataCell>
								{:else}
									{@const action = field.slice(ACTION_FIELD.length)}
									{#if dr.row.defined.includes(action)}
										{@const effect = dc.value as Effect | null}
										{@const allowed = dr.row.effective.includes(action)}
										{@const state = effect ?? (allowed ? 'inherit-allow' : 'inherit-off')}
										<dt.DataCell {dr} {dc}>
											<span
												class="slc-acl"
												class:slc-allow={effect === 'allow'}
												class:slc-deny={effect === 'deny'}
												class:slc-inherited={state === 'inherit-allow'}
												data-state={state}
												title={effect === 'allow'
													? t('acl_allow')
													: effect === 'deny'
														? t('acl_deny')
														: `${t('acl_unset')} (${allowed ? t('acl_inherited_allow') : t('acl_inherited_deny')})`}
											>
												{effect === 'deny' ? '✕' : effect === 'allow' || allowed ? '✓' : '·'}
											</span>
										</dt.DataCell>
									{:else}
										<!-- işlem bu kaynakta tanımlı değil: boş, düzenlenemez (yapıştırmada atlanır) -->
										<dt.DataCell {dr} {dc} editable={false}><span></span></dt.DataCell>
									{/if}
								{/if}
							{/snippet}
						</dt.DataRow>
					{/snippet}
				</dt.DataTable>
			</div>
		</div>
	</Page.Main>
</Page>

<style>
	.slc-acl {
		display: inline-flex;
		width: 1.5rem;
		height: 1.5rem;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--color-surface-300);
		border-radius: 0.375rem;
		color: var(--color-surface-400);
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
