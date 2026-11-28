<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { t } from '#lib/app/localization/index.js';
	import { resourceTrail } from '#lib/app/acl/access.js';
	import { menuTitle } from '#lib/app/menu/menu.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';

	// Sayfa başlığı (Page.Header içinde): başlık verilmezse menüden gelir (sayfanın kaynağı, seçili dilde; bölümün
	// "Giriş" sayfasında bölümün adı), böylece
	// menü, konum çubuğu ve başlık hep aynı adı gösterir. Sekme başlığını (<title>) da ayarlar: sayfada ayrıca <Head> gerekmez.
	// children: sağa yaslı eylemler (düğmeler vb.).
	type Props = {
		title?: string;
		description?: string;
		children?: Snippet;
	};

	let { title, description, children }: Props = $props();

	const resources = $derived(getMyAccess().current?.resources ?? []);
	const fromMenu = $derived.by(() => {
		// Bölümün "Giriş" sayfasında (anahtarı .intro ile biter) bölümün adı: "Giriş" yerine "Ayarlar"
		const trail = resourceTrail(resources, page.url.pathname);
		const r = trail.at(-1)?.key.endsWith('.intro') && trail.length > 1 ? trail.at(-2) : trail.at(-1);
		return r ? menuTitle({ id: r.key, title: r.label }) : '';
	});
	const text = $derived(title ?? fromMenu);
</script>

<svelte:head>
	<title>{text ? `${text} - ${t('app_name')}` : t('app_name')}</title>
	<meta name="description" content={description ?? t('app_name')} />
</svelte:head>

<div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
	<div class="min-w-0">
		<h1 class="text-surface-950 truncate text-lg font-semibold">{text}</h1>
		{#if description}<p class="text-surface-500 truncate text-sm">{description}</p>{/if}
	</div>
	{#if children}
		<div class="ml-auto flex items-center gap-2">
			{@render children()}
		</div>
	{/if}
</div>
