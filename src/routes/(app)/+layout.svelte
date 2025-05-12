<script lang="ts">
	import { Icons } from '$lib/components/icons';
	import type { SidebarDataType } from '$lib/components/base/app-layout/types';
	import { AppLayout } from '$lib/components/base/app-layout/view';
	import { setGlobalStates } from '$lib/client/global.svelte';

	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	const globalStates = setGlobalStates({
		pageTitle: 'SLC',
		appName: 'SLC Web App',
		pxMobileBreakpoint: 640,
		isMobileBreakpoint: false,
		hideSidebar: false,
		hidePageSidebar: false
	});

	let w = $state(1000);

	afterNavigate(() => {
		w = window.innerWidth;
	});

	$effect(() => {
		globalStates.isMobileBreakpoint = w < (globalStates.pxMobileBreakpoint || 550); // medya sorgulari ile yapamadigimiz seyler icin
	});

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

<svelte:window bind:innerWidth={w} />

<Icons />

<AppLayout {sidebarData}>
	{@render children?.()}
</AppLayout>
