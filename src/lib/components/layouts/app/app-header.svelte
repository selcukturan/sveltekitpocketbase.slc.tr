<script lang="ts">
	import { getGlobalContext } from '#lib/app/global.svelte.js';
	import { t } from '#lib/app/localization/localization.svelte.js';
	import { ThemeToggle } from '#lib/components/ui/theme-toggle/index.js';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { tooltip } from '#lib/attachments/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { Notifications } from '#lib/components/ui/notifications/index.js';
	import { can } from '#lib/app/acl/access.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';
	import UserMenu from './user-menu.svelte';

	// Üst çubuk: [panel / menü düğmesi · uygulama adı] [arama] [bildirimler · tema · kullanıcı menüsü]
	// Dil seçimi, sürüm, çıkış ve (geliştirmede) veritabanı bağlantısı kullanıcı menüsünde.
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

<header class="{classes} bg-surface-50 flex h-12 shrink-0 items-center gap-2 border-b px-2 sm:gap-4 sm:px-3" {...attributes}>
	<!-- Sol: panel düğmesi ve uygulama adı -->
	<div class="flex min-w-0 items-center gap-2 md:flex-1">
		{#if global.isMobileBreakpoint}
			<!-- Mobil: ray gizli; menü (modüller + ağaç) drawer'da -->
			<button type="button" onclick={onMenu} class="slc-icon-button" aria-label={t('menu')} aria-haspopup="dialog">
				<Icon name="menu" size={20} />
			</button>
		{:else}
			<button type="button" onclick={handleClick} class="slc-icon-button" aria-label={tooltipText} aria-pressed={global.hideSidebar} {@attach tooltip(tooltipText)}>
				<Icon name={global.hideSidebar ? 'panel_right_close' : 'panel_right_open'} size={20} />
			</button>
		{/if}
		<span class="text-surface-800 hidden truncate text-sm font-semibold md:inline">{t('app_name')}</span>
	</div>

	<!-- Orta: menüde arama (Ctrl+K / ⌘K ile de açılır) -->
	<div class="flex flex-1 justify-end sm:justify-center">
		<button
			type="button"
			onclick={onSearch}
			aria-haspopup="dialog"
			aria-keyshortcuts="Control+K Meta+K"
			class="slc-icon-button sm:border-surface-300 sm:bg-surface-100 sm:hover:border-surface-400 sm:hover:bg-surface-100 sm:text-surface-500 sm:w-full sm:max-w-sm sm:justify-start sm:gap-2 sm:border sm:px-3"
		>
			<Icon name="search" size={18} />
			<span class="sr-only flex-1 text-left text-sm sm:not-sr-only">{t('menu_search_placeholder')}</span>
			<kbd class="border-surface-300 text-surface-500 hidden rounded border px-1.5 font-sans text-[11px] md:inline">Ctrl K</kbd>
		</button>
	</div>

	<!-- Sağ: bildirimler, tema, kullanıcı -->
	<div class="flex items-center justify-end gap-1 md:flex-1">
		{#if can(access, 'app.notifications')}<Notifications />{/if}
		<ThemeToggle />
		<span class="bg-surface-200 mx-1 hidden h-6 w-px sm:block" aria-hidden="true"></span>
		<UserMenu />
	</div>
</header>
