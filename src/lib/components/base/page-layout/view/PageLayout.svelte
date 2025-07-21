<script lang="ts">
	import { SplitPane } from '$lib/components/base/split-pane';
	import type { Length } from '$lib/components/base/split-pane/types';
	import { PageSidebar, PageContainer } from '../';
	import { getGlobalContext } from '$lib/client/app/global.svelte';
	import { Icon } from '$lib/components/icons';
	import type { PageLayoutPropsType } from '../types';

	let { pageSidebardata, children }: PageLayoutPropsType = $props();

	const global = getGlobalContext();

	if (global.hidePageSidebar) global.hidePageSidebar = false;

	const handleClick = () => {
		global.hidePageSidebar = !global.hidePageSidebar;
	};

	// const item = localStorage.getItem('slc:splitpane');
	let initialPos: Length = $derived.by(() => {
		if (global.isMobileBreakpoint) {
			return global.pageSidebarWidth.vertical ? (`${global.pageSidebarWidth.vertical}px` as Length) : ('150px' as Length);
		} else {
			return global.pageSidebarWidth.horizontal ? (`${global.pageSidebarWidth.horizontal}px` as Length) : ('150px' as Length);
		}
	});
</script>

<SplitPane
	id="main"
	type={global.isMobileBreakpoint ? 'vertical' : 'horizontal'}
	onchange={(position) => {
		// REMOVE THIS CODE
		localStorage.removeItem('slc:splitpane');
		if (global.isMobileBreakpoint) {
			global.pageSidebarWidth.vertical = parseInt(position, 10);
		} else {
			global.pageSidebarWidth.horizontal = parseInt(position, 10);
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
				style:display={global.hideSidebar ? 'none' : 'block'}
				class="bg-surface-50 absolute z-52 inline-flex h-5 w-5 transform cursor-pointer items-center justify-center rounded-full border text-center align-middle leading-none select-none"
				class:mobile-position={global.isMobileBreakpoint}
				class:desktop-position={!global.isMobileBreakpoint}
				aria-label={global.hidePageSidebar ? 'Show sidebar' : 'Hide sidebar'}
			>
				<Icon name={global.hidePageSidebar ? `chevron-right` : `chevron-left`} size="16px" />
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

<style lang="postcss">
	.mobile-position {
		@apply top-[var(--pos)] left-1/2 -translate-x-1/2 -translate-y-1/2;
	}
	.desktop-position {
		@apply top-1/2 left-[var(--pos)] -translate-x-1/2 -translate-y-1/2;
	}
</style>
