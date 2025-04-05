<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	const { children, show = false, inline = false }: { children: Snippet; show: boolean; inline?: boolean } = $props();
</script>

{#if show}
	<div
		style:display={inline ? 'inline-block' : 'block'}
		style:margin-top={inline ? undefined : '0.125rem'}
		style:margin-left={inline ? '0.125rem' : undefined}
		transition:fade={{ delay: 0, duration: 200 }}
		class="pointer-events-none fixed z-50 max-w-72 rounded-sm border border-error-300 bg-error-100 p-0.5 text-xs text-error-900 shadow"
	>
		{@render children?.()}
	</div>
{/if}
