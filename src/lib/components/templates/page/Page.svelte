<script lang="ts">
	import { type Snippet } from 'svelte';
	import { setContext } from './context';

	let { children, class: classes }: { children?: Snippet; class?: string } = $props();

	// Set Context
	const ctx = setContext({
		pageTitle: 'SLC Web Applications'
	});
	console.log('Page', ctx.pageTitle);
</script>

<section class={classes} style="display:flex;width:100%;height:100%;flex-direction:column;overflow:hidden;">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</section>
