<script lang="ts">
	import 'tabulator-tables/dist/css/tabulator_simple.min.css';
	import { AppLayout, type SidebarDataType } from '$lib/components/layouts/app';
	import { initGlobalContext } from '$lib/client/app/global.svelte';
	import { navigating } from '$app/state';
	import { ProgressBar } from '$lib/components/base/app-progress-bar';
	import { Toasts, createToaster } from '$lib/components/base/toast';
	// import { appToaster } from '$lib/components/base/toast';

	let { children, data } = $props();

	const global = initGlobalContext();

	let sidebarData: SidebarDataType[] = $state([
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
			title: 'ERP',
			href: '/erp',
			icon: 'ri-clapperboard-line'
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
	]);

	const role: string = data?.user?.role || '';

	let filteredSidebarData = $derived.by(() => {
		if (role.startsWith(':demo:')) {
			return sidebarData.filter((item) => item.title !== 'ERP');
		}
		return sidebarData;
	});

	createToaster({ name: 'app-toaster' });
</script>

<svelte:window bind:innerWidth={global.windowWidth} />

<Toasts toasterName="app-toaster" />

<ProgressBar navigate={navigating}>
	<AppLayout sidebarData={filteredSidebarData}>
		{@render children?.()}
	</AppLayout>
</ProgressBar>
