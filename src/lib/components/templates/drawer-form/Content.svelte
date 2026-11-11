<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['main'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();

	const internalClasses = 'flex flex-1 flex-col overflow-hidden';
</script>

<main class="{classes} {internalClasses} bg-surface-50" {...attributes}>
	{#if boundary}
		<svelte:boundary>
			{#if children}
				{@render children()}
			{:else}
				<span>{t('no_content')}</span>
			{/if}
			{#snippet pending()}
				<p>{t('loading')}</p>
			{/snippet}
		</svelte:boundary>
	{:else if children}
		{@render children()}
	{:else}
		<span>{t('no_content')}</span>
	{/if}
</main>
