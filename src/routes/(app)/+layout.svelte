<script lang="ts">
	import { Icons } from '$lib/components/icons';
	import { Toaster, appToaster } from '$lib/components/zagjs/toast';
	import type { SidebarDataType } from '$lib/components/base/app-layout/types';
	import { AppLayout } from '$lib/components/base/app-layout/view';
	import { initGlobalContext } from '$lib/client/app/global.svelte';
	import { Tooltip } from 'bits-ui';
	import { navigating } from '$app/state';
	import { ProgressBar } from '$lib/components/base/app-progress-bar';

	let { children } = $props();

	const global = initGlobalContext();

	let sidebarData: SidebarDataType[] = [
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
	];
</script>

<svelte:window bind:innerWidth={global.windowWidth} />

<Icons />

<ProgressBar navigate={navigating} />

<Toaster toaster={appToaster} />

<Tooltip.Provider delayDuration={0} disableHoverableContent={true}>
	<AppLayout {sidebarData}>
		{@render children?.()}
	</AppLayout>
</Tooltip.Provider>
