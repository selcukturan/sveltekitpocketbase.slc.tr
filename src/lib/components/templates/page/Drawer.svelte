<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();
</script>

<div class={classes} {...attributes} style:display="contents">
	{#if boundary}
		<svelte:boundary>
			{#if children}
				{@render children()}
			{:else}
				<span>No content available.</span>
			{/if}
			{#snippet pending()}
				<p>Loading...</p>
			{/snippet}
		</svelte:boundary>
	{:else if children}
		{@render children()}
	{:else}
		<span>No content available.</span>
	{/if}
</div>
