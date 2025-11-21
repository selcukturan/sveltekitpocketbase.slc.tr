<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';

	type Props = HTMLFormAttributes & {
		inputs?: Snippet;
		children?: Snippet;
		buttons?: Snippet;
	};

	let { children, class: classes, inputs, buttons, ...attributes }: Props = $props();

	const internalClasses = 'flex flex-1 flex-col overflow-hidden';
</script>

<form class="{classes} {internalClasses}" {...attributes}>
	<div class="flex-1 overflow-y-auto" tabindex="-1">
		{@render inputs?.()}
	</div>
	<div class="bg-surface-100/80 flex justify-end border-t p-4">
		{@render buttons?.()}
	</div>
	{@render children?.()}
</form>
