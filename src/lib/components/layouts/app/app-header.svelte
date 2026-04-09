<script lang="ts">
	import { getGlobalContext } from '$lib/app/global.svelte';
	import { t, getSelectedLang, setSelectedLang } from '$lib/app/localization.svelte';
	import { ThemeToggle } from '$lib/components/base/theme-toggle';
	import { PUBLIC_ENV_TEST } from '$env/static/public';
	import { config } from '$lib/app/config';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { tooltip } from '$lib/attachments';
	import { getUser, logout } from '$lib/remotes/guarded.remote';

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
				{...logout.enhance(async ({ submit }) => {
					try {
						if (await submit().updates(getUser())) {
							console.log('Successfully logged out!');
						} else {
							console.log('Invalid data!');
						}
					} catch (error) {
						console.log('Oh no! Something went wrong');
					}
				})}
			>
				<!-- form içeriği -->

				<button
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
					<!-- Turkey Flag (TR) -->
					<svg class="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
						<rect width="1200" height="800" fill="#E30A17" />
						<circle cx="425" cy="400" r="200" fill="#fff" />
						<circle cx="475" cy="400" r="160" fill="#E30A17" />
						<polygon points="583.3,400 710.9,441.4 632,332.9 632,467.1 710.9,358.6" fill="#fff" />
					</svg>
				{:else}
					<!-- United Kingdom Flag (EN) -->
					<svg class="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
						<clipPath id="s">
							<path d="M0,0 v30 h60 v-30 z" />
						</clipPath>
						<path d="M0,0 v30 h60 v-30 z" fill="#012169" />
						<path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
						<path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4" clip-path="url(#s)" />
						<path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
						<path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
					</svg>
				{/if}
			</button>
		</div>
	</nav>
</header>

<style>
	.flag-icon {
		width: 40px; /* Adjust size here */
		height: 22px;
		display: inline-block;
		vertical-align: middle;
		border: 1px solid #eee; /* Optional border */
		border-radius: 4px; /* Optional rounded corners */
	}
</style>
