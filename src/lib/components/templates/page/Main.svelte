<script lang="ts">
	import { type Snippet } from 'svelte';

	let { children, class: classes }: { children?: Snippet; class?: string } = $props();
</script>

<!-- position:relative; -->
<main class="{classes} {`bg-surface-100/80`}" style="flex: 1 1 0%;overflow-x:hidden;overflow-y:auto;">
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</main>
