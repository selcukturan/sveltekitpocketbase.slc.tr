<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { t } from '#lib/app/localization/index.js';
	import { AppSidebar, AppHeader, NavTree, MobileNav, Forbidden, Breadcrumb, CommandPalette, type Crumb } from '..';
	import { menuEntries } from '#lib/app/menu/search.js';
	import type { AppLayoutPropsType } from '../types';
	import { getGlobalContext, TREE_MIN, TREE_MAX, TREE_DEFAULT } from '#lib/app/global.svelte.js';
	import { buildAppMenu, menuTitle } from '#lib/app/menu/menu.js';
	import { findActivePath, firstHref } from '#lib/app/menu/tree.js';
	import { canAccessPage, resourceTrail } from '#lib/app/acl/access.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';
	import { SplitPane } from '#lib/components/base/split-pane/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { tooltip } from '#lib/attachments/index.js';

	// Uygulama iskeleti: üst çubuk · modül rayı (menü kökleri) · aktif modülün menü ağacı · içerik (<main>).
	// Menü veritabanından gelir (getMyAccess → buildAppMenu): yalnızca erişilebilen sayfalar; modüllerin ayrı layout
	// dosyası yoktur. Alt menüsü olmayan modülde (ör. ana sayfa) ağaç yoktur, içerik tüm alanı alır.
	// Sayfa koruması: adres bir kaynakla eşleşmiyorsa ya da erişim izni yoksa sayfanın yerine 403 görünümü çizilir
	// (sayfa kurulmaz). Asıl koruma remote fonksiyonlardadır (requirePermission).
	//
	// Ekran boyutuna göre (global.screen):
	// - masaüstü (≥ 1024): ray + ağaç split pane'de (genişlik sürüklenir/klavyeyle değişir, daraltılabilir, kaydedilir)
	// - tablet (640–1023): ray + ağaç içeriğin üstünde açılan panel (varsayılan kapalı; sayfaya gidince, Esc ya da dışarı
	//   tıklayınca kapanır)
	// - mobil (< 640): ray gizli; üst çubuktaki menü düğmesi drawer'ı açar (modüller + ağaç)
	// İçerik her boyutta aynı yerde durur (split pane'in sağ bölmesi): pencere boyutu değişince sayfa yeniden kurulmaz.
	let { children, class: classes, ...attributes }: AppLayoutPropsType = $props();

	const global = getGlobalContext();

	// Tablet: ağaç paneli
	let tabletOpen = $state(false);
	const tabletLabel = $derived(tabletOpen ? t('hide_menu') : t('show_menu'));

	let mobileNav = $state<ReturnType<typeof MobileNav>>();
	let palette = $state<ReturnType<typeof CommandPalette>>();

	afterNavigate(() => (tabletOpen = false));
	global.openSearch = () => palette?.open();

	// Masaüstü: ağaç daraltılmış (kendi düğmesiyle ya da üst çubuktaki odak moduyla)
	const collapsed = $derived(global.hideSidebar || global.hidePageSidebar);
	const desktopTree = $derived(global.screen === 'desktop' && !collapsed);

	const toggleLabel = $derived(global.hidePageSidebar ? t('show_menu') : t('hide_menu'));

	// Yetki (await bağlam gerektiren çağrılardan sonra: getContext, afterNavigate await'ten sonra çalışmaz)
	await getMyAccess();
	// İlk yükleme bir kez beklenir; tazelemeler senkron .current ile okunur ($derived(await …) her tazelemede async iş
	// başlatıyor, aynı yanıtla gelen tablo güncellemesi sıra karışınca kayboluyordu; bkz. docs/d02_layout).
	const acl = $derived(getMyAccess().current ?? { resources: [], access: {} });
	const menu = $derived(buildAppMenu(acl.resources, acl.access));
	const allowed = $derived(canAccessPage(acl.resources, acl.access, page.url.pathname));

	// Konum çubuğu: sayfanın kaynağından köke. Modül → ilk erişilebilir sayfası (menüde yoksa bağlantısız), grup düz metin,
	// diğer sayfalar kendi adresi; son öğe bulunulan sayfa.
	// Menüde arama (Ctrl+K): kullanıcının menüsündeki sayfalar
	const searchEntries = $derived(menuEntries(menu, menuTitle));

	const crumbs = $derived(
		resourceTrail(acl.resources, page.url.pathname).map((r): Crumb => {
			const module = r.kind === 'module' ? menu.find((m) => m.id === r.key) : undefined;
			return { key: r.key, title: menuTitle({ id: r.key, title: r.label }), href: module ? firstHref(module) : r.kind === 'page' ? r.href : undefined };
		})
	);

	// Adrese karşılık gelen yol: [modül, …, sayfa]. Modül rayda, yol ağaçta işaretlenir.
	const activePath = $derived(findActivePath(menu, page.url.pathname));
	const module = $derived(activePath[0]);
	const activeIds = $derived(new Set(activePath.map((node) => node.id)));
	const activeId = $derived(activePath.at(-1)?.id);
	const hasTree = $derived(module !== undefined && module.children.length > 0);
</script>

<svelte:window
	onkeydown={(e) => {
		if (tabletOpen && e.key === 'Escape') tabletOpen = false;
		// Ctrl+K / ⌘K: menüde arama (tarayıcının kendi Ctrl+K'sı yerine)
		if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			palette?.open();
		}
	}}
/>

{#snippet tree()}
	{#if module}
		<NavTree {module} {activeIds} {activeId} expanded={global.menuExpanded} onToggle={global.setExpanded} />
	{/if}
{/snippet}

{#snippet content()}
	<div class="flex h-full w-full flex-col overflow-hidden">
		<Breadcrumb items={crumbs} />
		<main class="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
			{#if allowed}
				{@render children?.()}
			{:else}
				<Forbidden />
			{/if}
		</main>
	</div>
{/snippet}

<div class="{classes} flex h-full w-full flex-col" {...attributes}>
	<AppHeader onMenu={() => mobileNav?.open()} onSearch={() => palette?.open()} />
	<div class="flex flex-1 flex-row overflow-hidden">
		<div class="{global.hideSidebar || global.screen === 'mobile' ? 'hidden' : 'block'} bg-surface-50 overflow-hidden border-r">
			<AppSidebar modules={menu} activeId={module?.id} />
		</div>
		<div class="relative flex-1 overflow-hidden">
			{#if hasTree}
				<SplitPane
					id="main"
					type="horizontal"
					class="slc-app-page-layout"
					min={desktopTree ? `${TREE_MIN}px` : '0%'}
					max={`${TREE_MAX}px`}
					pos={desktopTree ? `${global.treeWidth}px` : '0%'}
					resetPos={`${TREE_DEFAULT}px`}
					dividerLabel={t('menu_resize')}
					onchange={(position) => global.setTreeWidth(parseInt(position, 10))}
				>
					{#snippet slotA()}
						<div class="bg-surface-50 text-surface-700 h-full w-full overflow-hidden border-r">
							{#if global.screen === 'desktop'}
								<button
									type="button"
									onclick={global.toggleTree}
									style:display={global.hideSidebar ? 'none' : 'inline-flex'}
									class="slc-tree-toggle"
									class:pl-2={global.hidePageSidebar}
									style:left="var(--pos)"
									aria-label={toggleLabel}
									aria-expanded={!global.hidePageSidebar}
									{@attach tooltip({ text: toggleLabel })}
								>
									<Icon name={global.hidePageSidebar ? 'chevron_right' : 'chevron_left'} size="16px" />
								</button>
								{@render tree()}
							{/if}
						</div>
					{/snippet}
					{#snippet slotB()}
						{@render content()}
					{/snippet}
				</SplitPane>

				{#if global.screen === 'tablet' && !global.hideSidebar}
					{#if tabletOpen}
						<!-- Dışarı tıklama paneli kapatır (klavyede Esc) -->
						<div class="slc-tree-backdrop" aria-hidden="true" onclick={() => (tabletOpen = false)}></div>
						<div class="slc-tree-overlay bg-surface-50 text-surface-700">
							{@render tree()}
						</div>
					{/if}
					<button
						type="button"
						onclick={() => (tabletOpen = !tabletOpen)}
						class="slc-tree-toggle"
						class:pl-2={!tabletOpen}
						style:left={tabletOpen ? 'min(20rem, 80%)' : '0px'}
						aria-label={tabletLabel}
						aria-expanded={tabletOpen}
						{@attach tooltip({ text: tabletLabel })}
					>
						<Icon name={tabletOpen ? 'chevron_left' : 'chevron_right'} size="16px" />
					</button>
				{/if}
			{:else}
				{@render content()}
			{/if}
		</div>
	</div>
</div>

<MobileNav bind:this={mobileNav} modules={menu} {activePath} />
<CommandPalette bind:this={palette} entries={searchEntries} />

<style>
	/* Ağacı aç/kapat düğmesi: bölücünün (ya da panelin) kenarında, dikeyde ortada */
	.slc-tree-toggle {
		position: absolute;
		top: 50%;
		z-index: 52;
		display: inline-flex;
		width: 1.5rem;
		height: 1.5rem;
		align-items: center;
		justify-content: center;
		padding: 1px;
		border: 1px solid var(--color-surface-300);
		border-radius: 9999px;
		background-color: var(--color-surface-50);
		color: var(--color-surface-600);
		cursor: pointer;
		transform: translate(-50%, -50%);
		user-select: none;
	}
	.slc-tree-toggle:hover {
		background-color: var(--color-quaternary-50);
	}
	/* Tablet paneli: içeriğin üstünde, solda */
	.slc-tree-overlay {
		position: absolute;
		inset-block: 0;
		left: 0;
		z-index: 50;
		width: min(20rem, 80%);
		border-right: 1px solid var(--color-surface-300);
		box-shadow: 8px 0 24px -8px rgb(0 0 0 / 0.3);
	}
	.slc-tree-backdrop {
		position: absolute;
		inset: 0;
		z-index: 49;
		background-color: rgb(0 0 0 / 0.15);
	}
</style>
