<script lang="ts">
	import { SplitPane } from '$lib/components/base/split-pane';
	import type { Length } from '$lib/components/base/split-pane/types';
	import { PageSidebar, PageContainer } from '../';
	import { getGlobalContext } from '$lib/client/app/global.svelte';

	import type { PageLayoutPropsType } from '../types';

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
			return global.pageSidebarSize.horizontal
				? (`${global.pageSidebarSize.horizontal}px` as Length)
				: ('150px' as Length);
		}
	});

	let icon = $derived.by(() => {
		if (global.isMobileBreakpoint) {
			return global.hidePageSidebar ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line';
		} else {
			return global.hidePageSidebar ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line';
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
				style:display={global.hideSidebar ? 'none' : 'flex'}
				class="bg-surface-50
				text-surface-600
				hover:bg-quaternary-50/90
				absolute
				z-52
				h-7
				w-7
				cursor-pointer
				items-center
				justify-center
				rounded-full
				border
				select-none
				sm:h-5 sm:w-5"
				class:mobile-position={global.isMobileBreakpoint}
				class:desktop-position={!global.isMobileBreakpoint}
				aria-label={global.hidePageSidebar ? 'Show sidebar' : 'Hide sidebar'}
			>
				<i
					class={`${icon} !text-base !leading-px ${global.hidePageSidebar ? (global.isMobileBreakpoint ? 'mt-3' : 'ml-2') : ''}`}
				></i>
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
