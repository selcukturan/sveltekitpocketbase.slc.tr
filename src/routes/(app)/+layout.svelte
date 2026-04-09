<script lang="ts">
	import { AppLayout, type SidebarDataType } from '$lib/components/layouts/app';
	import { initGlobalContext } from '$lib/app/global.svelte';
	import { navigating } from '$app/state';
	import { ProgressBar } from '$lib/components/base/app-progress-bar';
	import { Toasts, createToaster } from '$lib/components/base/toast';
	import { getUser } from '$lib/remotes/guarded.remote';
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { children } = $props();

	const global = initGlobalContext();
	const toasterName = 'app-toaster';

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

	createToaster({ name: toasterName });

	// let user = $derived(await getUser());
	let user = getUser();

	const watch = () => {
		user.current;
		untrack(() => user.current === null && goto(resolve('/login')));
	};
</script>

<svelte:window bind:innerWidth={global.windowWidth} />

<div class:slc-user-watcher={true} style:display="contents" {@attach watch}>
	{#if user.current !== null}
		<Toasts {toasterName} />

		<ProgressBar navigate={navigating}>
			<AppLayout {sidebarData}>
				{@render children?.()}
			</AppLayout>
		</ProgressBar>
	{:else}
		<!-- <div>Not Authenticated</div> -->
	{/if}
</div>
