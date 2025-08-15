<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['main'] & {
		children?: Snippet;
	};

	let { children, class: classes, style, ...attributes }: Props = $props();

	const internalStyles = 'flex: 1 1 0%;overflow-x:hidden;overflow-y:auto;';
</script>

<!-- position:relative; -->
<main
	class="{classes} {`bg-surface-100/80`}"
	style="{internalStyles} {style} "
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</main>
