<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['div'] & {
		children?: Snippet; // sol: filtreler, tazele vb.
		actions?: Snippet; // sağa yaslı: oluştur vb.
	};

	let { children, actions, class: classes, ...attributes }: Props = $props();
</script>

<!-- Tablo sayfası araç çubuğu (Page.Header içinde): children solda akar, actions sağa yaslanır -->
<div class="flex min-w-0 flex-1 flex-wrap items-center gap-2 {classes}" {...attributes}>
	{@render children?.()}
	{#if actions}
		<div class="ml-auto flex items-center gap-2">
			{@render actions()}
		</div>
	{/if}
</div>
