<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['div'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();
</script>

<!-- wrapper -->
<div class="{classes} {`relative mx-auto w-4xl max-w-full p-6`}" {...attributes}>
	<!-- panel -->
	<div class="bg-surface-50 shadow-surface-400/40 rounded-xl p-6 shadow-xl/30">
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
</div>
