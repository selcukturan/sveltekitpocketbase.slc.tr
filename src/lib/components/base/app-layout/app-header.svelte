<script lang="ts">
	import { enhance } from '$app/forms';
	import { getGlobalStates } from '$lib/states/global.svelte';
	import { ThemeToggle } from '$lib/components/base/theme-toggle';
	import { Icon } from '$lib/components/icons';
	import { PUBLIC_ENV_TEST } from '$env/static/public';

	const globalStates = getGlobalStates();

	const handleClick = () => {
		globalStates.hidePageSidebar = !globalStates.hideSidebar;
		globalStates.hideSidebar = !globalStates.hideSidebar;
	};
</script>

<header class="border-b">
	<nav class="flex h-full w-full items-stretch">
		<div class="flex items-stretch gap-3">
			<button
				onclick={handleClick}
				class={`${globalStates.hideSidebar ? `bg-surface-200 ` : ``} text-surface-500 hover:bg-surface-200 active:bg-surface-300 m-1 items-center justify-center rounded-md p-0.5 text-center no-underline outline-0 transition-colors duration-150 select-none sm:rounded-lg sm:p-1`}
				aria-label={globalStates.hidePageSidebar ? 'Show sidebar' : 'Hide sidebar'}
			>
				<Icon name={globalStates.hideSidebar ? `panel-right-close` : `panel-right-open`} />
			</button>
		</div>
		<div class="flex flex-1 items-center justify-center gap-4">
			{#if PUBLIC_ENV_TEST === 'public.env.development'}
				<a href="http://localhost:8099/_" target="_blank">Local Database</a>
			{/if}
		</div>
		<div class="flex items-center gap-4">
			<form action="/logout" method="POST" use:enhance>
				<button type="submit" class="btn slc-will-close w-full justify-start text-nowrap"> Çıkış Yap </button>
			</form>
			<ThemeToggle />
		</div>
	</nav>
</header>
