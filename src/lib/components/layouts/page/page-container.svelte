<script lang="ts">
	import type { ChildrenPropsType } from './types';
	let { children }: ChildrenPropsType = $props();
</script>

<main class="relative flex-1 overflow-hidden">
	{#if children}
		{@render children()}
	{/if}
</main>
