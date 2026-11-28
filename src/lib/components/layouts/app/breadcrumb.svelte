<script lang="ts" module>
	export type Crumb = { key: string; title: string; href?: string };
</script>

<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { t } from '#lib/app/localization/index.js';
	import { Icon } from '#lib/components/icons/index.js';

	// Konum çubuğu (breadcrumb): içerik alanının üstünde, her sayfada aynı yerde. Yol sayfanın kaynağından köke
	// (resourceTrail): Modül › Grup › Sayfa. Modül bağlantısı raydaki gibi ilk erişilebilir sayfaya gider, grubun sayfası
	// yoktur (düz metin), son öğe bulunulan sayfadır (aria-current). Dar ekranda yalnızca son iki öğe.
	// WAI breadcrumb kalıbı: <nav aria-label> içinde sıralı liste.
	let { items }: { items: Crumb[] } = $props();
</script>

{#if items.length > 0}
	<nav aria-label={t('breadcrumb')} class="slc-breadcrumb text-surface-600 flex h-9 shrink-0 items-end px-4 text-sm">
		<ol class="flex min-w-0 items-center gap-1">
			{#if items.length > 2}
				<li class="flex items-center gap-1 sm:hidden" aria-hidden="true">
					<span>…</span>
					<Icon name="chevron_right" size={14} />
				</li>
			{/if}
			{#each items as item, i (item.key)}
				{@const last = i === items.length - 1}
				<li class="flex min-w-0 items-center gap-1" class:max-sm:hidden={i < items.length - 2}>
					{#if last}
						<span aria-current="page" class="text-surface-900 truncate font-medium">{item.title}</span>
					{:else if item.href}
						<a href={item.href} class="hover:text-surface-900 truncate hover:underline">{item.title}</a>
					{:else}
						<span class="truncate">{item.title}</span>
					{/if}
					{#if !last}<Icon name="chevron_right" size={14} class="text-surface-400 shrink-0" />{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}
