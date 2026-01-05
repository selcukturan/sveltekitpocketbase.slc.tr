<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition';

	import type { RemoteFormIssue } from '@sveltejs/kit';

	let { inline = false, issues }: { inline?: boolean; issues?: RemoteFormIssue[] } = $props();
</script>

{#if Boolean(issues?.length)}
	<div
		style:display={inline ? 'inline-block' : 'block'}
		style:margin-top={inline ? undefined : '0.125rem'}
		style:margin-left={inline ? '0.125rem' : undefined}
		style:pointer-events="auto"
		transition:fly={{ y: 2, duration: 200 }}
		class="border-error-300 bg-error-100 text-error-900 absolute bottom-full z-50 rounded-sm border p-0.5 text-xs shadow"
	>
		{#each issues ?? [] as issue}
			{issue.message}
		{/each}
	</div>
{/if}
