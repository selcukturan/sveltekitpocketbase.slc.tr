<script lang="ts">
	import type { ChildrenPropsType } from './types';
	let { children, class: classes, ...attributes }: ChildrenPropsType = $props();
</script>

<main class="{classes} {'relative flex-1 overflow-hidden'}" {...attributes}>
	{#if children}
		{@render children()}
	{/if}
</main>
