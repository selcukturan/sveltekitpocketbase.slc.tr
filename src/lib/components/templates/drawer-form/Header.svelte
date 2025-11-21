<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		label?: string;
		children?: Snippet;
		boundary?: boolean;
	};

	let { label, children, class: classes, boundary = false, ...attributes }: Props = $props();

	const internalClasses = 'flex items-center justify-between border-b p-4';
</script>

<header class="{classes} {internalClasses} {`bg-surface-100/80`}" {...attributes}>
	<h2 class="text-lg font-semibold">{label || 'Drawer Form Header'}</h2>

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
</header>
