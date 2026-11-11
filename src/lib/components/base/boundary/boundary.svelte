<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { isHttpError } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();
</script>

<svelte:boundary>
	{@render children?.()}

	{#snippet pending()}
		<p>{t('loading')}</p>
	{/snippet}

	{#snippet failed(error, reset)}
		<button onclick={reset}>{t('retry')}</button>
		{#if isHttpError(error)}
			<p>Boundary HTTP Status: {error.status}</p>
			<p>Boundary Error Type: {error.body.type}</p>
			<p>Boundary Error ID: {error.body.errorId}</p>
			<p>Boundary Error Message: {t(error.body.message, undefined, error.body.message)}</p>
		{/if}
	{/snippet}
</svelte:boundary>
