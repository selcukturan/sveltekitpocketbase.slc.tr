<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['main'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();

	const internalClasses = 'flex flex-1 flex-col overflow-hidden';
</script>

<main class="{classes} {internalClasses} {`bg-surface-100/80`}" {...attributes}>
	{#if boundary}
		<svelte:boundary>
			{#if children}
				{@render children()}
			{:else}
				<span>No content available.</span>
			{/if}
			{#snippet pending()}
				<p class="slc-boundary-drawer-form-content-pending">Loading...</p>
			{/snippet}
		</svelte:boundary>
	{:else if children}
		{@render children()}
	{:else}
		<span>No content available.</span>
	{/if}
</main>
