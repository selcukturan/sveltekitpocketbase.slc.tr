<script lang="ts">
	import { SplitPane } from '$lib/components/base/split-pane';
	import type { Length } from '$lib/components/base/split-pane/types';
	import { PageSidebar, PageContainer } from '../';
	import { getGlobalContext } from '$lib/app/global.svelte';

	import type { PageLayoutPropsType } from '../types';
	import { Icon } from '$lib/components/icons';
	import { t } from '$lib/app/localization.svelte';
	import { tooltip } from '$lib/attachments';

	let { pageSidebardata, children }: PageLayoutPropsType = $props();

	const global = getGlobalContext();

	if (global.hidePageSidebar) global.hidePageSidebar = false;

	const handleClick = () => {
		global.hidePageSidebar = !global.hidePageSidebar;
	};

	let initialPos: Length = $derived.by(() => {
		if (global.isMobileBreakpoint) {
			return global.pageSidebarSize.vertical ? (`${global.pageSidebarSize.vertical}px` as Length) : ('150px' as Length);
		} else {
			return global.pageSidebarSize.horizontal ? (`${global.pageSidebarSize.horizontal}px` as Length) : ('150px' as Length);
		}
	});

	let icon = $derived.by(() => {
		if (global.isMobileBreakpoint) {
			return global.hidePageSidebar ? 'chevron-down' : 'chevron-up';
		} else {
			return global.hidePageSidebar ? 'chevron-right' : 'chevron-left';
		}
	});
</script>

<SplitPane
	id="main"
	type={global.isMobileBreakpoint ? 'vertical' : 'horizontal'}
	onchange={(position) => {
		if (global.isMobileBreakpoint) {
			global.pageSidebarSize.vertical = parseInt(position, 10);
		} else {
			global.pageSidebarSize.horizontal = parseInt(position, 10);
		}
	}}
	class="slc-app-page-layout"
	min={global.hidePageSidebar ? '0%' : '150px'}
	max="450px"
	pos={global.hidePageSidebar ? '0%' : initialPos}
>
	{#snippet slotA()}
		<section
			class="bg-surface-50
			text-surface-700
			h-full
			w-full
			overflow-hidden
			border-r-0
			border-b
			sm:border-r
			sm:border-b-0"
		>
			<button
				type="button"
				onclick={handleClick}
				style:display={global.hideSidebar ? 'none' : 'inline-flex'}
				class="bg-surface-50 text-surface-600 hover:bg-quaternary-50/90 absolute z-52 h-7 w-7 cursor-pointer items-center justify-center rounded-full border p-0.25 select-none sm:h-6 sm:w-6"
				class:pt-3={global.hidePageSidebar && global.isMobileBreakpoint}
				class:pl-2={global.hidePageSidebar && !global.isMobileBreakpoint}
				class:mobile-position={global.isMobileBreakpoint}
				class:desktop-position={!global.isMobileBreakpoint}
				aria-label={global.hidePageSidebar ? t('show_menu') : t('hide_menu')}
				{@attach tooltip({ text: global.hidePageSidebar ? t('show_menu') : t('hide_menu') })}
			>
				<Icon name={icon} size="16px" />
			</button>
			<PageSidebar {pageSidebardata} />
		</section>
	{/snippet}

	{#snippet slotB()}
		<section class="flex h-full w-full flex-col overflow-hidden">
			<header class="bg-success-50 hidden p-1">
				<h6>PAGE COMMON HEADER</h6>
			</header>
			<PageContainer>
				{#if children}
					{@render children()}
				{/if}
			</PageContainer>
			<footer class="bg-warning-50 hidden p-1">
				<h6>PAGE COMMON FOOTER</h6>
			</footer>
		</section>
	{/snippet}
</SplitPane>

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
