<script lang="ts">
	import { Boundary } from '#lib/components/base/boundary/index.js';
	import { t } from '#lib/app/localization/index.js';
	import { type Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = SvelteHTMLElements['footer'] & {
		children?: Snippet;
		boundary?: boolean;
	};

	let { children, class: classes, boundary = false, ...attributes }: Props = $props();
</script>

<div class={classes} {...attributes} style:display="contents">
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
