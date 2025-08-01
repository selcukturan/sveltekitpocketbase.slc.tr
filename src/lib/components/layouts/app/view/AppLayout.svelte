<script lang="ts">
	import { AppSidebar, AppHeader } from '../';
	import type { AppLayoutPropsType } from '../types';
	import { getGlobalContext } from '$lib/client/app/global.svelte';

	let { sidebarData, children }: AppLayoutPropsType = $props();

	let global = getGlobalContext();
</script>

<section class="flex h-full w-full flex-col">
	<AppHeader />
	<main class="flex-1 overflow-hidden">
		<section class="flex h-full w-full flex-col sm:flex-row">
			<div class={`${global.hideSidebar ? 'hidden' : 'block'} bg-surface-50 overflow-hidden border-r-0 border-b sm:border-r sm:border-b-0`}>
				<AppSidebar {sidebarData} />
			</div>
			<div class="flex-1 overflow-hidden">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</section>
	</main>
	<!-- <AppFooter /> -->
</section>
