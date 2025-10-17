<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<svelte:boundary>
	{@render children?.()}

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>
