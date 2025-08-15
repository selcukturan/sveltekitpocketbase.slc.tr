<script lang="ts">
	import { enhance } from '$app/forms';
	import { getGlobalContext } from '$lib/client/app/global.svelte';
	import { ThemeToggle } from '$lib/components/base/theme-toggle';
	import { PUBLIC_ENV_TEST } from '$env/static/public';
	import { config } from '$lib/client/app';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['header'];
	let { class: classes, style, ...attributes }: Props = $props();

	const global = getGlobalContext();

	const handleClick = () => {
		global.hidePageSidebar = !global.hideSidebar;
		global.hideSidebar = !global.hideSidebar;
	};
</script>

<header class="{classes} {'border-b'}" {...attributes}>
	<nav class="flex h-full w-full items-stretch">
		<div class="flex items-stretch gap-3">
			<button
				onclick={handleClick}
				class={`${global.hideSidebar ? `bg-surface-200 ` : ``} text-surface-500 hover:bg-surface-200 active:bg-surface-300 items-center justify-center rounded-md p-0.5 text-center select-none`}
				aria-label={global.hidePageSidebar ? 'Show sidebar' : 'Hide sidebar'}
			>
				<i
					class={`${global.hideSidebar ? `ri-sidebar-unfold-line` : `ri-sidebar-fold-line`} !text-xl`}
				></i>
			</button>
		</div>
		<div class="flex flex-1 items-center justify-center gap-4">
			{#if PUBLIC_ENV_TEST === 'public.env.development'}
				<a href="http://localhost:8099/_" target="_blank">Local Database</a>
				<p>-</p>
			{/if}
			<p>{config.version}</p>
		</div>
		<div class="flex items-center gap-4">
			<!-- class="btn slc-will-close w-full justify-start text-nowrap" -->
			<form action="/logout" method="POST" use:enhance>
				<button
					type="submit"
					class="bg-primary-300 hover:bg-primary-300/80 text-primary-900 flex cursor-pointer rounded-sm px-2.5 *:disabled:opacity-50"
				>
					Çıkış Yap
				</button>
			</form>
			<ThemeToggle />
		</div>
	</nav>
</header>
