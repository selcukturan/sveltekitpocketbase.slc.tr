<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['main'] & {
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

	const internalStyles = 'flex: 1 1 0%;overflow-x:hidden;overflow-y:auto;';
</script>

<!-- position:relative; -->
<main
	class="{classes} {`bg-surface-100/80`}"
	style="{internalStyles} {style} "
	{...attributes}
>
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
</main>
