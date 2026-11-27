<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { afterNavigate } from '$app/navigation';
	import { t } from '#lib/app/localization/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { getGlobalContext } from '#lib/app/global.svelte.js';
	import { menuTitle, type AppMenuNode } from '#lib/app/menu/menu.js';
	import NavTree from './nav-tree.svelte';

	// Mobil menü (< 640 px): soldan açılan drawer. Üstte modüller, altında seçili modülün ağacı.
	// - Alt menüsü olan modüle dokunmak sayfaya gitmez, yalnızca ağacını gösterir (sonra sayfa seçilir);
	//   alt menüsü olmayan modül (ör. ana sayfa) doğrudan açılır.
	// - Sayfaya gidince, Esc'ye basınca ya da dışarı dokununca kapanır. Native <dialog> (showModal): odak içeride kalır,
	//   kapanınca açan düğmeye döner.
	type Props = { modules: AppMenuNode[]; activePath: AppMenuNode[] };
	let { modules, activePath }: Props = $props();

	const global = getGlobalContext();
	let dialog = $state<HTMLDialogElement>();
	let shownId = $state<string>(); // drawer'da ağacı gösterilen modül (açılışta aktif modül)

	const activeIds = $derived(new Set(activePath.map((node) => node.id)));
	const shown = $derived(modules.find((m) => m.id === shownId) ?? activePath[0]);

	export const open = () => {
		shownId = activePath[0]?.id;
		dialog?.showModal();
	};
	const close = () => dialog?.close();

	afterNavigate(close);

	// Dışarı (backdrop'a) dokunma: tıklanan hedef dialog'un kendisiyse içerik dışıdır
	const onclick = (e: MouseEvent) => {
		if (e.target === dialog) close();
	};
</script>

<dialog bind:this={dialog} class="slc-mobile-nav" aria-label={t('menu')} {onclick}>
	<div class="bg-surface-50 flex h-full w-full flex-col overflow-hidden">
		<div class="border-surface-200 flex items-center justify-between border-b px-3 py-2">
			<span class="text-surface-700 font-semibold">{t('menu')}</span>
			<button
				type="button"
				class="text-surface-600 hover:bg-surface-200 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full"
				aria-label={t('close')}
				onclick={close}
			>
				<Icon name="close" size={20} />
			</button>
		</div>

		<nav aria-label={t('menu_modules')} class="border-surface-200 border-b px-2 py-2">
			<ul class="flex flex-col gap-0.5">
				{#each modules as m (m.id)}
					<li>
						{#if m.children.length > 0}
							<button
								type="button"
								aria-pressed={m.id === shown?.id}
								onclick={() => (shownId = m.id)}
								class="slc-mobile-nav-item"
								class:slc-mobile-nav-current={m.id === activePath[0]?.id}
							>
								{#if m.icon}<Icon name={m.icon} size={20} />{/if}
								<span class="flex-1 truncate text-left">{menuTitle(m)}</span>
								<Icon name="chevron_right" size={16} />
							</button>
						{:else if m.href}
							<a href={m.href} aria-current={m.id === activePath[0]?.id ? 'page' : undefined} class="slc-mobile-nav-item">
								{#if m.icon}<Icon name={m.icon} size={20} />{/if}
								<span class="flex-1 truncate">{menuTitle(m)}</span>
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>

		{#if shown && shown.children.length > 0}
			<div class="min-h-0 flex-1">
				<NavTree module={shown} {activeIds} activeId={activePath.at(-1)?.id} expanded={global.menuExpanded} onToggle={global.setExpanded} />
			</div>
		{/if}
	</div>
</dialog>

<style>
	.slc-mobile-nav {
		margin: 0;
		padding: 0;
		border: 0;
		width: min(20rem, 85vw);
		max-width: none;
		height: 100dvh;
		max-height: none;
		background: transparent;
		box-shadow: 0 0 24px -4px rgb(0 0 0 / 0.35);
		translate: -100% 0;
		transition:
			translate 160ms ease,
			display 160ms allow-discrete,
			overlay 160ms allow-discrete;
	}
	.slc-mobile-nav[open] {
		translate: 0 0;
	}
	@starting-style {
		.slc-mobile-nav[open] {
			translate: -100% 0;
		}
	}
	.slc-mobile-nav::backdrop {
		background-color: rgb(0 0 0 / 0.35);
	}
	.slc-mobile-nav-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		min-height: 2.75rem;
		padding: 0.25rem 0.75rem;
		border-radius: 0.375rem;
		color: var(--color-surface-600);
		cursor: pointer;
	}
	.slc-mobile-nav-item:hover {
		background-color: var(--color-surface-200);
	}
	/* Ağacı gösterilen modül */
	.slc-mobile-nav-item[aria-pressed='true'] {
		background-color: var(--color-surface-200);
		color: var(--color-surface-900);
	}
	/* Bulunulan sayfanın modülü */
	.slc-mobile-nav-current,
	.slc-mobile-nav-item[aria-current='page'] {
		font-weight: 600;
		color: var(--color-primary-700);
	}
</style>
