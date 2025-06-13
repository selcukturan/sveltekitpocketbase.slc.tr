<script lang="ts">
	import { type Snippet } from 'svelte';
	/* import { getContext } from './context'; */

	let { children, class: classes }: { children?: Snippet; class?: string } = $props();

	// Get Context
	/* const ctx = getContext(); */
</script>

<div class={classes} style:display="contents">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</div>
