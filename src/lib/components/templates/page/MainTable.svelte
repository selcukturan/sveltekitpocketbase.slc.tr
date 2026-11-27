<script lang="ts">
	import { Boundary } from '#lib/components/base/boundary/index.js';
	import { t } from '#lib/app/localization/index.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['div'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();
</script>

<!-- Tablo kartı: sayfa zemininden (surface-100) kenarlık ve yüzey rengiyle ayrılır; DataTable kartın tamamını doldurur -->
<div class="flex h-full min-h-0 flex-col p-3">
	<div class="bg-surface-50 border-surface-200 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border shadow-sm {classes}" {...attributes}>
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
	</div>
</div>
