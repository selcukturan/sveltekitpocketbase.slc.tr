<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { RemoteFormIssue } from '@sveltejs/kit';

	type Props = {
		children: Snippet;
		label: string;
		required?: boolean;
		issues?: RemoteFormIssue[];
	};

	let { children, label, required = false, issues }: Props = $props();
</script>

<label class="select-none flex flex-col gap-1.5 w-full mt-4">
	<div class="flex items-center gap-0.5 text-xs font-semibold text-surface-600" class:required>
		{label}
	</div>

	{#if children}
		{@render children()}
	{:else}
		<span>No renderable input component provided.</span>
	{/if}

	{#each issues as issue, i (i)}
		<p class="text-xs text-error-600 mt-1 font-medium">{issue.message}</p>
	{/each}
</label>

<style>
	.required::after {
		content: '*';
		color: var(--color-error-600);
	}
</style>
