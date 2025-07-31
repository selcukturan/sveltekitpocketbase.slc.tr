<script lang="ts">
	import { Toaster, appToaster } from '$lib/components/zagjs/toast';
	import type { SidebarDataType } from '$lib/components/base/app-layout/types';
	import { AppLayout } from '$lib/components/base/app-layout/view';
	import { initGlobalContext } from '$lib/client/app/global.svelte';
	import { navigating } from '$app/state';
	import { ProgressBar } from '$lib/components/base/app-progress-bar';

	let { children } = $props();

	const global = initGlobalContext();

	let sidebarData: SidebarDataType[] = [
		{
			title: 'Home',
			href: '/',
			icon: 'ri-home-5-line'
		},
		{
			title: 'Grapes',
			href: '/grapes',
			icon: 'ri-color-filter-line'
		},
		{
			title: 'Data Table',
			href: '/data-table',
			icon: 'ri-table-3'
		},
		{
			title: 'Logs',
			href: '/logs',
			icon: 'ri-line-chart-line'
		},
		{
			title: 'Developments',
			href: '/developments',
			icon: 'ri-code-box-line'
		},
		{
			title: 'Settings',
			href: '/settings',
			icon: 'ri-tools-line'
		}
	];
</script>

<svelte:window bind:innerWidth={global.windowWidth} />

<!-- <Icons /> -->

<ProgressBar navigate={navigating}>
	<Toaster toaster={appToaster}>
		<AppLayout {sidebarData}>
			{@render children?.()}
		</AppLayout>
	</Toaster>
</ProgressBar>
