<script lang="ts">
	import { SplitPane } from '$lib/components/base/split-pane';
	import type { Length } from '$lib/components/base/split-pane/types';
	import { PageSidebar, PageContainer } from '../';
	import { getConfigStates } from '$lib/client/config.svelte';
	import { Icon } from '$lib/components/icons';
	import type { PageLayoutPropsType } from '../types';

	let { pageSidebardata, children }: PageLayoutPropsType = $props();

	const config = getConfigStates();

	if (config.hidePageSidebar) config.hidePageSidebar = false;

	const handleClick = () => {
		config.hidePageSidebar = !config.hidePageSidebar;
	};

	const item = localStorage.getItem('slc:splitpane');
	let initialPos: Length = item ? JSON.parse(item).position : '250px';
</script>

<SplitPane
	id="main"
	type={config.isMobileBreakpoint ? 'vertical' : 'horizontal'}
	onchange={(position) => {
		localStorage.setItem('slc:splitpane', `{"position":"${position}"}`);
		// pos = position;
	}}
	class="slc-app-page-layout"
	min={config.hidePageSidebar ? '0%' : '150px'}
	max="450px"
	pos={config.hidePageSidebar ? '0%' : initialPos}
>
	{#snippet slotA()}
		<section
			class="border-surface-300
			bg-surface-50
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
				style:display={config.hideSidebar ? 'none' : 'block'}
				class="bg-surface-50 absolute z-[52] inline-flex h-5 w-5 transform cursor-pointer items-center justify-center rounded-full border text-center align-middle leading-none select-none"
				class:mobile-position={config.isMobileBreakpoint}
				class:desktop-position={!config.isMobileBreakpoint}
				aria-label={config.hidePageSidebar ? 'Show sidebar' : 'Hide sidebar'}
			>
				<Icon name={config.hidePageSidebar ? `chevron-right` : `chevron-left`} size={config.isMobileBreakpoint ? `14px` : `16px`} />
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
