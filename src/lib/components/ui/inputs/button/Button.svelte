<script lang="ts">
	import type { Props } from './types';

	let { children, class: classes, variant = undefined, size = undefined, ...attributes }: Props = $props();
</script>

<button type="button" class={classes} {...attributes}>
	{#if children}
		{@render children()}
	{:else}
		No Content
	{/if}
</button>
