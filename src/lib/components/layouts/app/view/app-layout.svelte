<script lang="ts">
	import { page } from '$app/state';
	import { t } from '#lib/app/localization/index.js';
	import { AppSidebar, AppHeader, NavTree } from '..';
	import type { AppLayoutPropsType } from '../types';
	import { getGlobalContext } from '#lib/app/global.svelte.js';
	import { MENU } from '#lib/app/menu/menu.js';
	import { findActivePath } from '#lib/app/menu/tree.js';
	import { SplitPane } from '#lib/components/base/split-pane/index.js';
	import type { Length } from '#lib/components/base/split-pane/types.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { tooltip } from '#lib/attachments/index.js';

	// Uygulama iskeleti: üst çubuk · modül rayı (menü kökleri) · aktif modülün menü ağacı (split pane) · içerik (<main>).
	// Menü tek yerden gelir (app/menu/menu.ts); modüllerin ayrı layout dosyası yoktur. Alt menüsü olmayan modülde
	// (ör. ana sayfa) ağaç gösterilmez, içerik tüm alanı alır.
	let { children, class: classes, ...attributes }: AppLayoutPropsType = $props();

	const global = getGlobalContext();

	// Adrese karşılık gelen yol: [modül, …, sayfa]. Modül rayda, yol ağaçta işaretlenir.
	const activePath = $derived(findActivePath(MENU, page.url.pathname));
	const module = $derived(activePath[0]);
	const activeIds = $derived(new Set(activePath.map((node) => node.id)));
	const activeId = $derived(activePath.at(-1)?.id);
	const hasTree = $derived(module !== undefined && module.children.length > 0);

	// Ağaç daraltılmış: kendi düğmesiyle ya da üst çubuktaki "paneli gizle" ile (odak modu)
	const collapsed = $derived(global.hideSidebar || global.hidePageSidebar);

	const initialPos: Length = $derived.by(() => {
		const size = global.isMobileBreakpoint ? global.pageSidebarSize.vertical : global.pageSidebarSize.horizontal;
		return `${size || 150}px` as Length;
	});
	const toggleLabel = $derived(global.hidePageSidebar ? t('show_menu') : t('hide_menu'));
	const toggleIcon = $derived(
		global.isMobileBreakpoint ? (global.hidePageSidebar ? 'chevron_down' : 'chevron_up') : global.hidePageSidebar ? 'chevron_right' : 'chevron_left'
	);
</script>

<div class="{classes} flex h-full w-full flex-col" {...attributes}>
	<AppHeader />
	<div class="flex flex-1 flex-col overflow-hidden sm:flex-row">
		<div class="{global.hideSidebar ? 'hidden' : 'block'} bg-surface-50 overflow-hidden border-r-0 border-b sm:border-r sm:border-b-0">
			<AppSidebar modules={MENU} activeId={module?.id} />
		</div>
		<div class="flex-1 overflow-hidden">
			{#if hasTree && module}
				<SplitPane
					id="main"
					type={global.isMobileBreakpoint ? 'vertical' : 'horizontal'}
					onchange={(position) => {
						if (global.isMobileBreakpoint) global.pageSidebarSize.vertical = parseInt(position, 10);
						else global.pageSidebarSize.horizontal = parseInt(position, 10);
					}}
					class="slc-app-page-layout"
					min={collapsed ? '0%' : '150px'}
					max="450px"
					pos={collapsed ? '0%' : initialPos}
				>
					{#snippet slotA()}
						<div class="bg-surface-50 text-surface-700 h-full w-full overflow-hidden border-r-0 border-b sm:border-r sm:border-b-0">
							<button
								type="button"
								onclick={() => (global.hidePageSidebar = !global.hidePageSidebar)}
								style:display={global.hideSidebar ? 'none' : 'inline-flex'}
								class="bg-surface-50 text-surface-600 hover:bg-quaternary-50/90 absolute z-52 h-7 w-7 cursor-pointer items-center justify-center rounded-full border p-px select-none sm:h-6 sm:w-6"
								class:pt-3={global.hidePageSidebar && global.isMobileBreakpoint}
								class:pl-2={global.hidePageSidebar && !global.isMobileBreakpoint}
								class:mobile-position={global.isMobileBreakpoint}
								class:desktop-position={!global.isMobileBreakpoint}
								aria-label={toggleLabel}
								aria-expanded={!global.hidePageSidebar}
								{@attach tooltip({ text: toggleLabel })}
							>
								<Icon name={toggleIcon} size="16px" />
							</button>
							<NavTree {module} {activeIds} {activeId} expanded={global.menuExpanded} />
						</div>
					{/snippet}
					{#snippet slotB()}
						<main class="relative flex h-full w-full flex-col overflow-hidden">
							{@render children?.()}
						</main>
					{/snippet}
				</SplitPane>
			{:else}
				<main class="relative flex h-full w-full flex-col overflow-hidden">
					{@render children?.()}
				</main>
			{/if}
		</div>
	</div>
</div>

<style>
	.mobile-position {
		top: var(--pos);
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.desktop-position {
		top: 50%;
		left: var(--pos);
		transform: translate(-50%, -50%);
	}
</style>
