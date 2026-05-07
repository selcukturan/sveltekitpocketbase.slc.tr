<script lang="ts">
	import { AppLayout, type SidebarDataType } from '$lib/components/layouts/app';
	import { initGlobalContext } from '$lib/app/global.svelte';
	import { navigating } from '$app/state';
	import { ProgressBar } from '$lib/components/base/app-progress-bar';
	import { Toasts, createToaster } from '$lib/components/ui/toast';
	import { getUser } from '$lib/remotes/guarded.remote';
	import { resolve } from '$app/paths';

	let { children } = $props();

	const global = initGlobalContext();
	const toasterName = 'app-toaster';

	createToaster({ name: toasterName });

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

<svelte:window bind:innerWidth={global.windowWidth} />

<svelte:boundary>
	{#if (await getUser()) !== null}
		<Toasts {toasterName} />

		<ProgressBar navigate={navigating}>
			<AppLayout {sidebarData}>
				{@render children?.()}
			</AppLayout>
		</ProgressBar>
	{:else}
		<div class="flex h-screen w-screen flex-col items-center justify-center gap-3">
			<p class="animate-color-change text-lg font-medium">Not Authenticated</p>
			<a href={resolve('/login')} class="animate-color-change underline underline-offset-4 hover:opacity-80"> Go To Login Page </a>
		</div>
	{/if}

	{#snippet pending()}
		<p>App initializing...</p>
	{/snippet}
</svelte:boundary>

<style>
	.animate-color-change {
		color: var(--color-surface-50);
		animation: colorChange 500ms ease 500ms forwards;
	}

	@keyframes colorChange {
		to {
			color: var(--color-surface-900);
		}
	}
</style>
