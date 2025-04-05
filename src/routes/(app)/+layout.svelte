<script lang="ts">
	import { Icons } from '$lib/components/icons';
	import type { SidebarDataType } from '$lib/components/base/app-layout/types';
	import { AppLayout } from '$lib/components/base/app-layout/view';
	import { setGlobalStates } from '$lib/states/global.svelte';

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
			title: 'Logs',
			href: '/logs',
			icon: 'chart-spline'
		},
		{
			title: 'Development',
			href: '/dev',
			icon: 'square-code'
		},
		{
			title: 'Doluca',
			href: '/dlc',
			icon: 'grape'
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
