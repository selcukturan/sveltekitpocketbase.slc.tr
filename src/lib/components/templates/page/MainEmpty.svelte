<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '#lib/app/localization/index.js';
	import { Icon, type IconKey } from '#lib/components/icons/index.js';

	// Boş durum (Page.Main içinde): henüz hazır olmayan ya da içeriği olmayan sayfalar. Varsayılan metin "Yakında".
	type Props = {
		icon?: IconKey;
		title?: string;
		description?: string;
		children?: Snippet; // eylemler (ör. bir bağlantı)
	};

	let { icon = 'circle_alert', title, description, children }: Props = $props();
</script>

<div class="flex h-full min-h-64 items-center justify-center p-6">
	<div class="flex max-w-sm flex-col items-center text-center">
		<span class="bg-surface-200 text-surface-500 inline-flex size-12 items-center justify-center rounded-full" aria-hidden="true">
			<Icon name={icon} size={24} />
		</span>
		<h2 class="text-surface-900 mt-4 font-semibold">{title ?? t('coming_soon')}</h2>
		<p class="text-surface-500 mt-1 text-sm">{description ?? t('coming_soon_description')}</p>
		{#if children}<div class="mt-4">{@render children()}</div>{/if}
	</div>
</div>
