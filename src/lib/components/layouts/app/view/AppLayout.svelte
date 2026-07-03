<script lang="ts">
	import { AppSidebar, AppHeader } from '../';
	import type { AppLayoutPropsType, SidebarDataType } from '../types';
	import { getGlobalContext } from '$lib/app/global.svelte';

	let { children, class: classes, ...attributes }: AppLayoutPropsType = $props();

	let global = getGlobalContext();

	let sidebarData: SidebarDataType[] = $state([
		{
			title: 'Home',
			href: '/',
			icon: 'home'
		},
		{
			title: 'Grapes',
			href: '/grapes',
			icon: 'grape'
		},
		{
			title: 'Data Table',
			href: '/data-table',
			icon: 'data-table'
		},
		{
			title: 'Logs',
			href: '/logs',
			icon: 'chart-spline'
		},
		{
			title: 'Developments',
			href: '/developments',
			icon: 'square-code'
		},
		{
			title: 'Settings',
			href: '/settings',
			icon: 'settings'
		}
	]);
</script>

<section class="{classes} flex h-full w-full flex-col" {...attributes}>
	<AppHeader />
	<main class="flex-1 overflow-hidden">
		<section class="flex h-full w-full flex-col sm:flex-row">
			<div class={`${global.hideSidebar ? 'hidden' : 'block'} bg-surface-50 overflow-hidden border-r-0 border-b sm:border-r sm:border-b-0`}>
				<AppSidebar {sidebarData} />
			</div>
			<div class="flex-1 overflow-hidden">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</section>
	</main>
	<!-- <AppFooter /> -->
</section>
