<script lang="ts">
	import { type Snippet } from 'svelte';

	let {
		children,
		class: classes
	}: {
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<header class={classes} style:border-top="0px" style:border-left="0px">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</header>
