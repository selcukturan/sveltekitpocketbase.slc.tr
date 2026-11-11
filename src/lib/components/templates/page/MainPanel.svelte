<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['div'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();
</script>

<!-- wrapper -->
<div class="{classes} relative mx-auto w-4xl max-w-full p-6" {...attributes}>
	<!-- panel -->
	<div class="bg-surface-50 shadow-surface-400/40 rounded-xl p-6 shadow-xl/30">
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
</div>
