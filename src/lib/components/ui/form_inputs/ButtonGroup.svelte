<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['div'] & { children?: Snippet };

	let { children, class: classes, ...attributes }: Props = $props();
</script>

<!-- Form düğmelerini yan yana gruplar (ör. buttons snippet'inde reset + submit) -->
<div class="flex items-center gap-2 {classes}" {...attributes}>
	{@render children?.()}
</div>
