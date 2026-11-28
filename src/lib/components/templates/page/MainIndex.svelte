<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { page } from '$app/state';
	import { t } from '#lib/app/localization/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { buildAppMenu, menuTitle, type AppMenuNode } from '#lib/app/menu/menu.js';
	import { findActivePath } from '#lib/app/menu/tree.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';

	// Bölüm dizini (Page.Main içinde): bir bölümün "Giriş" sayfası, bölümdeki diğer sayfaları kart olarak listeler.
	// Liste kullanıcının menüsünden gelir (yalnızca erişebildiği sayfalar); alt gruplar kendi başlığıyla ayrı listelenir.
	type Section = { id: string; title?: string; href?: string; pages: AppMenuNode[] };

	const acl = $derived(getMyAccess().current ?? { resources: [], access: {} });
	const menu = $derived(buildAppMenu(acl.resources, acl.access));

	// Grubun "Giriş" sayfası (anahtarı .intro ile biter) kart olmaz: grubun başlığı ona bağlanır
	const isIntro = (node: AppMenuNode) => node.id.endsWith('.intro');
	const pagesIn = (node: AppMenuNode): AppMenuNode[] => (node.children.length ? node.children.flatMap(pagesIn) : node.href && !isIntro(node) ? [node] : []);

	const sections = $derived.by((): Section[] => {
		const path = findActivePath(menu, page.url.pathname);
		const current = path.at(-1);
		const parent = path.at(-2);
		if (!parent) return [];
		const direct = parent.children.filter((n) => !n.children.length && n.href && n !== current);
		const groups = parent.children.filter((n) => n.children.length);
		return [
			...(direct.length ? [{ id: parent.id, pages: direct }] : []),
			...groups.map((g) => ({ id: g.id, title: menuTitle(g), href: g.children.find(isIntro)?.href, pages: pagesIn(g) })).filter((s) => s.pages.length || s.href)
		];
	});
</script>

<div class="mx-auto flex w-5xl max-w-full flex-col gap-8 p-4 sm:p-6">
	{#each sections as section (section.id)}
		<section aria-label={section.title}>
			{#if section.title}
				<h2 class="text-surface-500 mb-3 text-xs font-semibold tracking-wide uppercase">
					{#if section.href}<a href={section.href} class="hover:text-primary-600 inline-flex items-center gap-1">
							{section.title}<Icon name="chevron_right" size={14} />
						</a>
					{:else}{section.title}{/if}
				</h2>
			{/if}
			<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each section.pages as node (node.id)}
					<li>
						<a href={node.href} class="slc-card group hover:border-primary-400 flex h-full items-center gap-3 p-4 transition-colors">
							<span
								class="bg-surface-100 text-surface-600 group-hover:text-primary-600 inline-flex size-10 shrink-0 items-center justify-center rounded-lg"
								aria-hidden="true"
							>
								<Icon name={node.icon || 'file'} size={20} />
							</span>
							<span class="text-surface-900 min-w-0 flex-1 truncate font-medium">{menuTitle(node)}</span>
							<Icon name="chevron_right" size={16} class="text-surface-400 group-hover:text-primary-600 shrink-0" />
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<p class="text-surface-500 text-sm">{t('no_content')}</p>
	{/each}
</div>
