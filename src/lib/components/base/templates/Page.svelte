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

<section class={classes} style="display:flex;width:100%;height:100%;flex-direction:column;overflow:hidden;">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</section>
