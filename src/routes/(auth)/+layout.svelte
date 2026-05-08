<script lang="ts">
	import { getUser } from '$lib/remotes/guarded.remote';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { children } = $props();

	onMount(() => {
		if (page.url.searchParams.has('unauthorized')) {
			getUser().refresh();
			goto(resolve('/login'), { replaceState: true });
		}
	});
</script>

<svelte:boundary>
	{#if (await getUser()) === null}
		{@render children()}
	{:else}
		<div class="flex h-screen w-screen flex-col items-center justify-center gap-3">
			<p class="slc-animate-color-change text-lg font-medium">Already Authenticated</p>
			<a href={resolve('/')} class="slc-animate-color-change underline underline-offset-4 hover:opacity-80"> Go To Home Page </a>
		</div>
	{/if}

	{#snippet pending()}
		<p>Login Page Initializing...</p>
	{/snippet}
</svelte:boundary>
