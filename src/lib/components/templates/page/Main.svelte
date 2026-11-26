<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['div'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, style, boundary = false, ...attributes }: Props = $props();

	const internalStyles = 'flex: 1 1 0%;overflow-x:hidden;overflow-y:auto;';
</script>

<!-- Sayfanın kaydırılan içerik alanı. <main> değil: sayfadaki tek <main> uygulama iskeletinde (app-layout) -->
<div class="{classes} bg-surface-100" style="{internalStyles} {style} " {...attributes}>
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
</div>
