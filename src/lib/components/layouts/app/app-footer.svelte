<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		children?: Snippet;
	};

	let { children, class: classes, style, ...attributes }: Props = $props();
</script>

<footer class="{classes} {'border-t'}" {...attributes}>
	{#if children}
		{@render children()}
	{:else}
		<p>App Footer</p>
	{/if}
</footer>
