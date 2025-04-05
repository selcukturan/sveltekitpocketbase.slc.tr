<script lang="ts">
	import { AppSidebar, AppHeader } from '../';
	import type { AppLayoutPropsType } from '../types';
	import { getGlobalStates } from '$lib/states/global.svelte';

	let { sidebarData, children }: AppLayoutPropsType = $props();

	let globalStates = getGlobalStates();
</script>

<section class="flex h-full w-full flex-col">
	<AppHeader />
	<main class="flex-1 overflow-hidden">
		<section class="flex h-full w-full flex-col sm:flex-row">
			<div class={`${globalStates.hideSidebar ? 'hidden' : 'block'} overflow-hidden border-b border-r-0 bg-surface-50 sm:border-b-0 sm:border-r`}>
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
