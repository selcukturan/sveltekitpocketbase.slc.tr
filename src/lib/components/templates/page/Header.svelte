<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();
</script>

<!-- Sayfa araç çubuğu: zemin (Main) surface-100, araç çubuğu ve içerik kartları surface-50 -->
<header
	class="bg-surface-50 border-surface-200 flex min-h-14 flex-wrap items-center gap-2 border-b px-4 py-2 {classes}"
	style:border-top="0px"
	style:border-left="0px"
	{...attributes}
>
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
</header>
