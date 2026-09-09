<script lang="ts">
	import { AppLayout } from '#lib/components/layouts/app/index.js';
	import { initGlobalContext } from '#lib/app/global.svelte.js';
	import { navigating } from '$app/state';
	import { ProgressBar } from '#lib/components/base/app-progress-bar/index.js';

	let { children } = $props();

	const global = initGlobalContext();
</script>

<svelte:window bind:innerWidth={global.windowWidth} />

<ProgressBar navigate={navigating}>
	<AppLayout>
		{@render children?.()}
	</AppLayout>
</ProgressBar>
