<script lang="ts">
	import type { Snippet } from 'svelte';
	import { AppLayout } from '#lib/components/layouts/app/index.js';
	import { LoginLayout } from '#lib/components/layouts/login';
	import { navigating } from '$app/state';
	import { ProgressBar } from '#lib/components/base/app-progress-bar/index.js';
	import { getUser } from '#lib/remotes/guarded.remote.js';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:boundary>
	{#if (await getUser()) !== null}
		<ProgressBar navigate={navigating}>
			<AppLayout>
				{@render children?.()}
			</AppLayout>
		</ProgressBar>
	{:else}
		<LoginLayout />
	{/if}

	{#snippet pending()}
		<p>App Initializing...</p>
	{/snippet}
</svelte:boundary>
