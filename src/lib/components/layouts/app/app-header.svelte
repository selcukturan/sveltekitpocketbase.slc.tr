<script lang="ts">
	import { getGlobalContext } from '#lib/app/global.svelte.js';
	import { t } from '#lib/app/localization/localization.svelte.js';
	import { ThemeToggle } from '#lib/components/ui/theme-toggle/index.js';
	import { LangToggle } from '#lib/components/ui/lang-toggle/index.js';
	import { PUBLIC_ENV_TEST } from '$app/env/public';
	import { config } from '#lib/app/config.js';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { tooltip } from '#lib/attachments/index.js';
	import { logout } from '#lib/remotes/guarded.remote.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { getUser } from '#lib/remotes/guarded.remote.js';
	import { Notifications } from '#lib/components/ui/notifications/index.js';
	import { can } from '#lib/app/acl/access.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';

	type Props = SvelteHTMLElements['header'] & {
		onMenu?: () => void; // mobilde menü düğmesi (drawer'ı açar)
		onSearch?: () => void; // menüde arama (Ctrl+K penceresi)
	};
	let { class: classes, style, onMenu, onSearch, ...attributes }: Props = $props();

	const global = getGlobalContext();

	// Odak modu: modül rayı ve menü ağacı birlikte gizlenir. Menü ağacının kendi daralt/genişlet tercihi korunur.
	const handleClick = () => {
		global.hideSidebar = !global.hideSidebar;
	};

	const tooltipText = $derived(global.hideSidebar ? t('show_panel') : t('hide_panel'));

	// Uygulama özellikleri (acl_resources kind: feature): izin yoksa düğme görünmez. (await en sonda: bileşen bağlamı)
	await getMyAccess(); // ilk yükleme; tazelemeler senkron (bkz. app-layout)
	const access = $derived(getMyAccess().current?.access ?? {});
</script>

<header class="{classes} border-b" {...attributes}>
	<div class="flex h-full w-full items-stretch">
		<div class="flex items-stretch gap-3">
			{#if global.isMobileBreakpoint}
				<!-- Mobil: ray gizli; menü (modüller + ağaç) drawer'da -->
				<button
					type="button"
					onclick={onMenu}
					class="text-surface-600 hover:bg-surface-200 active:bg-surface-300 inline-flex items-center justify-center rounded-md p-1 select-none"
					aria-label={t('menu')}
					aria-haspopup="dialog"
				>
					<Icon name="menu" />
				</button>
			{:else}
				<button
					onclick={handleClick}
					class={`${global.hideSidebar ? `bg-surface-200 ` : ``} text-surface-500 hover:bg-surface-200 active:bg-surface-300 items-center justify-center rounded-md p-0.5 text-center select-none`}
					aria-label={tooltipText}
					aria-pressed={global.hideSidebar}
					{@attach tooltip(tooltipText)}
				>
					<Icon name={global.hideSidebar ? 'panel_right_close' : 'panel_right_open'} />
				</button>
			{/if}
		</div>
		<!-- Sürüm bilgisi: dar ekranda yer açmak için gizli -->
		<div class="hidden flex-1 items-center justify-center gap-4 sm:flex">
			{#if PUBLIC_ENV_TEST === 'public.env.development'}
				<a href="http://localhost:8099/_" target="_blank">Local Database</a>
				<p>-</p>
			{/if}
			<p>{config.version}</p>
		</div>
		<div class="ml-auto flex items-center gap-2 sm:gap-4">
			<!-- Menüde arama: Ctrl+K / ⌘K ile de açılır -->
			<button
				type="button"
				onclick={onSearch}
				aria-haspopup="dialog"
				aria-keyshortcuts="Control+K Meta+K"
				class="border-surface-300 text-surface-600 hover:bg-surface-200 inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm select-none"
			>
				<Icon name="search" size={16} />
				<span class="hidden sm:inline">{t('menu_search')}</span>
				<kbd class="text-surface-500 hidden text-xs md:inline">Ctrl K</kbd>
			</button>
			{#if can(access, 'app.notifications')}<Notifications />{/if}
			<form
				{...logout.enhance(async ({ submit }) => {
					try {
						if (await submit().updates(getUser)) {
							console.log('Successfully logged out!');
							// window.location.href = '/login';
						} else {
							console.log('Invalid data!');
						}
					} catch (error) {
						console.log('Oh no! Something went wrong');
					}
				})}
			>
				<!-- form içeriği -->

				<button
					class="bg-primary-300 hover:bg-primary-300/80 text-primary-900 flex cursor-pointer rounded-sm px-2.5 whitespace-nowrap *:disabled:opacity-50"
					{@attach tooltip(t('logout'))}
				>
					{t('logout')}
				</button>
			</form>

			<ThemeToggle />

			{#if can(access, 'app.language')}<LangToggle />{/if}
		</div>
	</div>
</header>
