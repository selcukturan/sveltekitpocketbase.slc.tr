<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { t } from '#lib/app/localization/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { menuTitle, type AppMenuNode } from '#lib/app/menu/menu.js';

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
						class="text-surface-800 hover:bg-surface-200/70 flex w-full cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[13px] font-semibold select-none"
						class:mt-4={depth === 0}
					>
						<span class="min-w-0 flex-1 truncate">{menuTitle(node)}</span>
						<Icon name="chevron_right" size={16} class="text-surface-500 shrink-0 transition-transform {open ? 'rotate-90' : ''}" />
					</button>
					{#if open}
						{@render branch(node.children, depth + 1)}
					{/if}
				{:else if node.href}
					<a
						href={node.href}
						aria-current={node.id === activeId ? 'page' : undefined}
						class="my-px flex min-h-9 w-full min-w-0 items-center gap-x-2.5 rounded-md px-2.5 py-1 text-sm no-underline select-none {node.id === activeId
							? 'slc-nav-current font-medium'
							: 'text-surface-600 hover:bg-surface-200/70 hover:text-surface-900'}"
					>
						{#if node.icon}<Icon name={node.icon} size={18} class="shrink-0 opacity-80" />{/if}
						<span class="truncate">{menuTitle(node)}</span>
					</a>
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

<nav aria-label={menuTitle(module)} class="flex h-full w-full flex-col overflow-hidden">
	{#if heading}
		<h2 class="text-surface-500 px-5 pt-4 pb-1 text-[11px] font-semibold tracking-wider uppercase">{menuTitle(module)}</h2>
	{/if}
	<div class="flex-1 overflow-x-hidden overflow-y-auto px-3 pb-4">
		{@render branch(module.children, 0)}
	</div>
</nav>

<style>
	/* İkinci seviyeden itibaren girinti ve sol çizgi (hangi gruba ait olduğu görünsün); ilk grubun bağlantıları başlığın altında hizalı */
	.slc-nav-nested {
		margin-left: 0.875rem;
		padding-left: 0.375rem;
		border-left: 1px solid var(--color-surface-300);
	}
</style>
