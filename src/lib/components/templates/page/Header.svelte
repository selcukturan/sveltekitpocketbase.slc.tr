<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		children?: Snippet;
	};

	let { children, class: classes, ...attributes }: Props = $props();
</script>

<header
	class="{classes} {`bg-surface-100/80`}"
	style:border-top="0px"
	style:border-left="0px"
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</header>
