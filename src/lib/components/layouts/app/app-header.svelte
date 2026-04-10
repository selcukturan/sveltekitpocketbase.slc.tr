<script lang="ts">
	import { getGlobalContext } from '$lib/app/global.svelte';
	import { t } from '$lib/app/localization.svelte';
	import { ThemeToggle } from '$lib/components/ui/theme-toggle';
	import { LangToggle } from '$lib/components/ui/lang-toggle';
	import { PUBLIC_ENV_TEST } from '$env/static/public';
	import { config } from '$lib/app/config';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { tooltip } from '$lib/attachments';
	import { getUser, logout } from '$lib/remotes/guarded.remote';

	type Props = SvelteHTMLElements['header'];
	let { class: classes, style, ...attributes }: Props = $props();

	const global = getGlobalContext();

	const handleClick = () => {
		global.hidePageSidebar = !global.hideSidebar;
		global.hideSidebar = !global.hideSidebar;
	};
</script>

<header class="{classes} border-b" {...attributes}>
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

			<LangToggle />
		</div>
	</nav>
</header>
