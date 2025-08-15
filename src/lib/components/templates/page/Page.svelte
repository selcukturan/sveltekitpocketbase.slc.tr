<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['section'] & {
		children?: Snippet;
	};

	let { children, class: classes, style, ...attributes }: Props = $props();

	const internalStyle =
		'display:flex;width:100%;height:100%;flex-direction:column;overflow:hidden;';
</script>

<section class={classes} style="{internalStyle} {style}" {...attributes}>
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</section>
