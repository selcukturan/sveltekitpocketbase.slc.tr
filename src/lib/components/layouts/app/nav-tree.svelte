<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { t } from '#lib/app/localization/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import type { AppMenuNode } from '#lib/app/menu/menu.js';

	// Aktif modülün menü ağacı (sidebar). Gruplar açılır/kapanır düğmedir (aria-expanded), yapraklar bağlantıdır.
	// Site gezinmesi için WAI'nin önerdiği "disclosure" kalıbı: iç içe <ul>, role="tree" yok.
	type Props = {
		module: AppMenuNode;
		activeIds: ReadonlySet<string>; // kökten aktif sayfaya kadar olan düğümler
		activeId: string | undefined; // aktif sayfanın düğümü (aria-current)
		expanded: ReadonlyMap<string, boolean>; // kullanıcının açıp kapattığı gruplar (seçmediyse varsayılan)
		onToggle: (id: string, open: boolean) => void; // grup açıldı/kapandı (tercih kaydedilir: global.setExpanded)
		heading?: boolean; // modül adını başlık olarak göster (mobil drawer kendi başlığını çizer)
	};
	let { module, activeIds, activeId, expanded, onToggle, heading = true }: Props = $props();

	// Kullanıcı seçmediyse: ilk seviye gruplar ve aktif sayfanın bulunduğu gruplar açık
	const isOpen = (node: AppMenuNode, depth: number) => expanded.get(node.id) ?? (depth === 0 || activeIds.has(node.id));
	const toggle = (node: AppMenuNode, depth: number) => onToggle(node.id, !isOpen(node, depth));
</script>

{#snippet branch(nodes: AppMenuNode[], depth: number)}
	<ul class="flex flex-col" class:slc-nav-nested={depth > 1}>
		{#each nodes as node (node.id)}
			<li>
				{#if node.children.length > 0}
					{@const open = isOpen(node, depth)}
					<button
						type="button"
						aria-expanded={open}
						onclick={() => toggle(node, depth)}
						class="text-surface-700 hover:bg-surface-200 flex w-full cursor-pointer items-center gap-1 rounded px-1 py-1.5 text-left text-sm font-semibold select-none"
						class:mt-5={depth === 0}
					>
						<Icon name={open ? 'chevron_down' : 'chevron_right'} size={16} />
						<span class="truncate">{t(node.title)}</span>
					</button>
					{#if open}
						{@render branch(node.children, depth + 1)}
					{/if}
				{:else if node.href}
					<a
						href={node.href}
						aria-current={node.id === activeId ? 'page' : undefined}
						class="text-surface-500 hover:bg-surface-200 hover:text-surface-900 active:bg-surface-300 aria-[current]:bg-surface-200 aria-[current]:text-surface-900 my-0.5 flex min-h-10 w-full min-w-0 items-center gap-x-2 rounded px-3 py-1 text-base no-underline select-none"
					>
						{#if node.icon}<Icon name={node.icon} size={20} />{/if}
						<span class="truncate">{t(node.title)}</span>
					</a>
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

<nav aria-label={t(module.title)} class="flex h-full w-full flex-col overflow-hidden">
	{#if heading}
		<h2 class="text-surface-500 px-5 pt-4 pb-1 text-xs font-semibold tracking-wide uppercase">{t(module.title)}</h2>
	{/if}
	<div class="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4">
		{@render branch(module.children, 0)}
	</div>
</nav>

<style>
	/* İkinci seviyeden itibaren girinti ve sol çizgi (hangi gruba ait olduğu görünsün); ilk grubun bağlantıları başlığın altında hizalı */
	.slc-nav-nested {
		margin-left: 0.75rem;
		padding-left: 0.5rem;
		border-left: 1px solid var(--color-surface-200);
	}
</style>
