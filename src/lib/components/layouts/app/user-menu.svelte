<script lang="ts">
	import { resolve } from '$app/paths';
	import { PUBLIC_ENV_TEST } from '$app/env/public';
	import { t, getSelectedLang, setSelectedLang } from '#lib/app/localization/index.js';
	import { config } from '#lib/app/config.js';
	import { can, canAccessPage } from '#lib/app/acl/access.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';
	import { getUser, logout } from '#lib/remotes/guarded.remote.js';
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import { Icon, type IconKey } from '#lib/components/icons/index.js';
	import { getToaster } from '#lib/components/ui/toast/index.js';
	import { tooltip } from '#lib/attachments/index.js';

	// Üst çubuktaki kullanıcı menüsü (avatar düğmesi). WAI menu deseni: role="menu", öğeler role="menuitem";
	// açılınca ilk öğe odaklanır, ↑ ↓ Home End ile gezilir, Esc kapatır ve odak düğmeye döner (popover).
	// Profil, Mesajlar ve Yardım şimdilik örnek: tıklanınca "Yakında" bildirimi gösterilir.

	const toast = getToaster('app-toaster');

	await getUser(); // ilk yükleme; sonra .current (çıkışta tazelenir)
	await getMyAccess();
	const user = $derived(getUser().current);
	const access = $derived(getMyAccess().current ?? { resources: [], access: {} });
	const showSettings = $derived(canAccessPage(access.resources, access.access, '/app/settings'));
	const showLanguage = $derived(can(access.access, 'app.language'));
	const isDev = PUBLIC_ENV_TEST === 'public.env.development';

	const fullName = $derived([user?.name, user?.surname].filter(Boolean).join(' ') || user?.email || '');
	// Baş harfler: ad soyad, yoksa e-postanın ilk harfi
	const initials = $derived(
		(
			[user?.name, user?.surname]
				.filter(Boolean)
				.map((s: string) => s.trim()[0])
				.join('') ||
			user?.email?.[0] ||
			'?'
		).toLocaleUpperCase(getSelectedLang() === 'tr' ? 'tr-TR' : 'en-US')
	);

	let toggler = $state<ReturnType<typeof Toggler> | null>(null);
	let menuEl = $state<HTMLElement | null>(null);

	const items = () => [...(menuEl?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])];

	// Açılınca ilk öğeye odaklan
	$effect(() => {
		if (toggler?.states.active) queueMicrotask(() => items()[0]?.focus());
	});

	const onkeydown = (e: KeyboardEvent) => {
		const list = items();
		const index = list.indexOf(document.activeElement as HTMLElement);
		const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: list.length - 1 }[e.key];
		if (next === undefined) return;
		e.preventDefault();
		list[(next + list.length) % list.length]?.focus();
	};

	const comingSoon = (close: () => void) => {
		close();
		toast.add({ type: 'info', title: t('coming_soon'), description: t('coming_soon_description') });
	};
</script>

{#snippet avatar(size: string, text: string)}
	<span class="bg-primary-500 text-surface-token-950 inline-flex {size} shrink-0 items-center justify-center rounded-full font-semibold select-none" aria-hidden="true">
		{text}
	</span>
{/snippet}

{#snippet item(icon: IconKey, label: string, onclick: () => void, badge?: number)}
	<button type="button" role="menuitem" tabindex="-1" class="slc-menu-item" {onclick}>
		<Icon name={icon} size={18} />
		<span class="flex-1 truncate">{label}</span>
		{#if badge}
			<span class="bg-primary-100 text-primary-800 rounded-full px-1.5 text-xs font-semibold tabular-nums">{badge}</span>
		{/if}
	</button>
{/snippet}

<Toggler bind:this={toggler} placement="bottom-end" --border="1px solid var(--color-surface-300)" --border-radius="12px" --min-width="260px" --max-width="300px">
	{#snippet trigger({ attr })}
		<button {...attr} class="slc-icon-button rounded-full!" aria-label={t('user_menu')} {@attach tooltip(fullName)}>
			{@render avatar('size-8 text-sm', initials)}
		</button>
	{/snippet}

	{#snippet children({ close, triggerId })}
		<div bind:this={menuEl} role="menu" aria-labelledby={triggerId} tabindex="-1" class="flex flex-col p-1.5" {onkeydown}>
			<!-- Kim giriş yaptı -->
			<div class="flex items-center gap-3 px-2.5 pt-2 pb-3">
				{@render avatar('size-10 text-base', initials)}
				<div class="min-w-0">
					<p class="text-surface-900 truncate text-sm font-semibold">{fullName}</p>
					{#if fullName !== user?.email}<p class="text-surface-500 truncate text-xs">{user?.email}</p>{/if}
				</div>
			</div>

			<hr class="slc-menu-separator" />
			{@render item('user', t('user_menu_profile'), () => comingSoon(close))}
			{@render item('mail', t('user_menu_messages'), () => comingSoon(close), 3)}
			{#if showSettings}
				<a href={resolve('/(app)/app/settings')} role="menuitem" tabindex="-1" class="slc-menu-item" onclick={close}>
					<Icon name="settings" size={18} />
					<span class="flex-1">{t('user_menu_settings')}</span>
				</a>
			{/if}
			{@render item('circle_help', t('user_menu_help'), () => comingSoon(close))}

			{#if showLanguage}
				<hr class="slc-menu-separator" />
				<!-- Dil: tıklayınca diğer dile geçer -->
				{@render item('languages', t('user_menu_language'), () => setSelectedLang(getSelectedLang() === 'tr' ? 'en' : 'tr'))}
			{/if}

			{#if isDev}
				<hr class="slc-menu-separator" />
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- dış adres (PocketBase yönetim paneli) -->
				<a href="http://localhost:8099/_" target="_blank" rel="noopener noreferrer" role="menuitem" tabindex="-1" class="slc-menu-item" onclick={close}>
					<Icon name="database" size={18} />
					<span class="flex-1">{t('user_menu_database')}</span>
				</a>
			{/if}

			<hr class="slc-menu-separator" />
			<form
				{...logout.enhance(async ({ submit }) => {
					try {
						await submit().updates(getUser);
					} catch {
						toast.add({ type: 'error', title: t('error'), description: t('logout') });
					}
				})}
			>
				<button type="submit" role="menuitem" tabindex="-1" class="slc-menu-item text-error-600! w-full">
					<Icon name="log_out" size={18} />
					<span class="flex-1">{t('logout')}</span>
				</button>
			</form>

			<p class="text-surface-500 px-2.5 pt-2 pb-1 text-[11px] tabular-nums">{config.version}</p>
		</div>
	{/snippet}
</Toggler>

<style>
	.slc-menu-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.625rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-surface-800);
		text-align: left;
		cursor: pointer;
		outline: none;
	}
	.slc-menu-item:hover,
	.slc-menu-item:focus-visible {
		background-color: var(--color-surface-200);
		color: var(--color-surface-950);
	}
	.slc-menu-separator {
		margin: 0.25rem 0.5rem;
		border-color: var(--color-surface-200);
	}
</style>
