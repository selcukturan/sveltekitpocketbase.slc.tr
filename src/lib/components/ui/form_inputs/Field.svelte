<script lang="ts">
	import type { RemoteFormIssue } from '$app/server';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		label: string;
		required?: boolean;
		issues?: RemoteFormIssue[];
	};

	let { children, label, required = false, issues }: Props = $props();
</script>

<label class="mt-4 flex w-full flex-col gap-1.5 select-none">
	<div class="text-surface-600 flex items-center gap-0.5 text-xs font-semibold" class:required>
		{label}
	</div>

	{#if children}
		{@render children()}
	{:else}
		<span>No renderable input component provided.</span>
	{/if}

	{#each issues as issue, i (i)}
		<p class="text-error-600 mt-1 text-xs font-medium">{issue.message}</p>
	{/each}
</label>

<style>
	.required::after {
		content: '*';
		color: var(--color-error-600);
	}
</style>
