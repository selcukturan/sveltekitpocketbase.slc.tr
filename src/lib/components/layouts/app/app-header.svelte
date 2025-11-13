<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { getGlobalContext } from '$lib/app/global.svelte';
	import { t, getSelectedLang, setSelectedLang } from '$lib/app/localization.svelte';
	import { ThemeToggle } from '$lib/components/base/theme-toggle';
	import { PUBLIC_ENV_TEST } from '$env/static/public';
	import { config } from '$lib/app/config';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { goto } from '$app/navigation';
	import { tooltip } from '$lib/attachments';

	type Props = SvelteHTMLElements['header'];
	let { class: classes, style, ...attributes }: Props = $props();

	const global = getGlobalContext();
	/* const locales = getLocalizationContext(); */

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
				<i class={`${global.hideSidebar ? `ri-sidebar-unfold-line` : `ri-sidebar-fold-line`} text-xl!`}></i>
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
			<form
				action="/logout"
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'redirect') {
							goto(result.location);
						} else {
							await applyAction(result);
						}
					};
				}}
			>
				<button
					type="submit"
					class="bg-primary-300 hover:bg-primary-300/80 text-primary-900 flex cursor-pointer rounded-sm px-2.5 *:disabled:opacity-50"
					{@attach tooltip(t('logout'))}
				>
					{t('logout')}
				</button>
			</form>
			<ThemeToggle />
			<button
				onclick={() => setSelectedLang(getSelectedLang() === 'tr' ? 'en' : 'tr')}
				class="bg-primary-50 hover:bg-secondary-500/80 text-primary-100 flex cursor-pointer rounded-sm px-2.5 *:disabled:opacity-50"
				{@attach tooltip(getSelectedLang() === 'tr' ? 'Change language to English' : 'Dili Türkçe yap')}
			>
				{#if getSelectedLang() === 'tr'}
					<span>🇹🇷</span>
				{:else}
					<span>🇬🇧</span>
				{/if}
			</button>
		</div>
	</nav>
</header>
