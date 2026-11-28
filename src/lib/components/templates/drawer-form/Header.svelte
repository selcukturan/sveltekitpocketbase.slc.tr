<script lang="ts">
	import { Boundary } from '#lib/components/base/boundary/index.js';
	import { t } from '#lib/app/localization/index.js';
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		label?: string;
		children?: Snippet;
		boundary?: boolean;
	};

	let { label, children, class: classes, boundary = false, ...attributes }: Props = $props();

	const internalClasses = 'flex items-center justify-between border-b p-4';
</script>

<header class="{classes} {internalClasses} bg-(--slc-system-bg-surface)" {...attributes}>
	<h2 class="text-lg font-semibold">{label || 'Drawer Form Header'}</h2>

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
