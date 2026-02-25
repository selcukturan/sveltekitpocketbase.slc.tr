<script lang="ts">
	import { fly } from 'svelte/transition';

	import type { RemoteFormIssue } from '@sveltejs/kit';
	let { inline = false, issues }: { inline?: boolean; issues?: RemoteFormIssue[] } = $props();

	// animasyondan dolayı bir önceki issues verilerini göstermesini engellemek için duration değerini 0 yapıyoruz.
	let duration = $derived(Boolean(issues?.length) ? 200 : 0);
</script>

{#if Boolean(issues?.length)}
	<div
		style:display={inline ? 'inline-block' : 'block'}
		style:margin-top={inline ? undefined : '0.125rem'}
		style:margin-left={inline ? '0.125rem' : undefined}
		style:pointer-events="auto"
		transition:fly={{ y: 2, duration }}
		class="border-error-300 bg-error-100 text-error-900 absolute bottom-full z-50 rounded-sm border p-0.5 text-xs shadow"
	>
		{#each issues ?? [] as issue}
			{issue.message}
		{/each}
	</div>
{/if}
