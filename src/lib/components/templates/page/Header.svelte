<script lang="ts">
	import { type Snippet } from 'svelte';
	import { getContext } from './context';

	let { children, class: classes }: { children?: Snippet; class?: string } = $props();

	// Get Context
	const ctx = getContext();
	console.log('Header', ctx.pageTitle);
</script>

<header class="{classes} {`bg-surface-100/80`}" style:border-top="0px" style:border-left="0px">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</header>
