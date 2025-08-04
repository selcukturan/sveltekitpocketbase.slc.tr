<script lang="ts">
	import { AppLayout, type SidebarDataType } from '$lib/components/layouts/app';
	import { initGlobalContext } from '$lib/client/app/global.svelte';
	import { navigating } from '$app/state';
	import { ProgressBar } from '$lib/components/base/app-progress-bar';
	import { createToaster, Toasts } from '$lib/components/base/toast';

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

	const appToaster = createToaster('app-toaster');
</script>

<svelte:window bind:innerWidth={global.windowWidth} />

<Toasts id="app-toaster" position="bottom-right" />

<ProgressBar navigate={navigating}>
	<AppLayout {sidebarData}>
		{@render children?.()}
	</AppLayout>
</ProgressBar>
