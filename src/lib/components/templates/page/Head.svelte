<script lang="ts">
	import { type Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<svelte:head>
	{#if children}
		{@render children()}
	{:else}
		<title>Page - SLC Web Applications</title>
		<meta name="description" content="SLC Web Applications" />
	{/if}
</svelte:head>
