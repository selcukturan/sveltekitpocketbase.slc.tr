<script lang="ts">
	import { isHttpError } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
	isHttpError;
</script>

<svelte:boundary>
	{@render children?.()}

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}

	{#snippet failed(error, reset)}
		<button onclick={reset}>Boundary Reset</button>
		{#if isHttpError(error)}
			<p>Boundary HTTP Status: {error.status}</p>
			<p>Boundary Error Type: {error.body.type}</p>
			<p>Boundary Error ID: {error.body.errorId}</p>
			<p>Boundary Error Message: {error.body.message}</p>
		{/if}
	{/snippet}
</svelte:boundary>
