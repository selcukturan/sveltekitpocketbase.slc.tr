<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['div'] & {
		children?: Snippet;
	};

	let { children, class: classes, ...attributes }: Props = $props();
</script>

<div
	class="{classes} {`wrapper relative mx-auto w-4xl max-w-full p-6`}"
	{...attributes}
>
	<div
		class="panel bg-surface-50 shadow-surface-400 rounded-xl p-6 shadow-sm/40"
	>
		{#if children}
			{@render children()}
		{:else}
			<span>İçerik yok.</span>
		{/if}
	</div>
</div>
