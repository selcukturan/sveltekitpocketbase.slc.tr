<script lang="ts">
	import { Boundary } from '#lib/components/base/boundary/index.js';
	import { t } from '#lib/app/localization/index.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();
</script>

<!-- Sayfa başlığı / araç çubuğu: içerik yüzeyinde (surface-100, app-layout), altta ince çizgi; kartlar surface-50 -->
<header class="border-surface-200 flex min-h-14 flex-wrap items-center gap-2 border-b px-4 py-2 {classes}" style:border-top="0px" style:border-left="0px" {...attributes}>
	{#if boundary}
		<Boundary>
			{#if children}
				{@render children()}
			{:else}
				<span>{t('no_content')}</span>
			{/if}
		</Boundary>
	{:else if children}
		{@render children()}
	{:else}
		<span>{t('no_content')}</span>
	{/if}
</header>
