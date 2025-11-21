<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type Props = HTMLFormAttributes & {
		children?: Snippet;
	};

	let { children, ...attributes }: Props = $props();
</script>

<form {...attributes}>
	{#if children}
		{@render children()}
	{:else}
		<span>No content available.</span>
	{/if}
</form>
