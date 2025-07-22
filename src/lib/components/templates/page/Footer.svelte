<script lang="ts">
	import { type Snippet } from 'svelte';

	let { children, class: classes }: { children?: Snippet; class?: string } = $props();
</script>

<footer class="{classes} {`bg-surface-100/80`}" style:border-bottom="0px" style:border-left="0px">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</footer>
