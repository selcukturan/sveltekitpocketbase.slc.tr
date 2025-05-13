<script lang="ts">
	import { type Snippet } from 'svelte';
	import { getContext } from './context';

	let { children, class: classes }: { children?: Snippet; class?: string } = $props();

	// Get Context
	const ctx = getContext();
	console.log('Footer', ctx.pageTitle);
</script>

<footer class={classes} style:border-bottom="0px" style:border-left="0px">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</footer>
