<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['section'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let {
		children,
		class: classes,
		style,
		boundary = false,
		...attributes
	}: Props = $props();

	const internalStyle =
		'display:flex;width:100%;height:100%;flex-direction:column;overflow:hidden;';
</script>

<section class={classes} style="{internalStyle} {style}" {...attributes}>
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
</section>
