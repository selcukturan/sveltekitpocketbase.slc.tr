<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { t } from '#lib/app/localization/index.js';
	import type { PropsAppSidebarType } from './types';
	import { tooltip } from '#lib/attachments/index.js';
	import { resolve } from '$app/paths';
	import { Icon } from '#lib/components/icons/index.js';
	import { menuTitle } from '#lib/app/menu/menu.js';
	import { firstHref } from '#lib/app/menu/tree.js';

	// Modül rayı: menü ağacının kökleri. Aktif modül adresten bulunur (app-layout → findActivePath).
	let { modules, activeId, class: classes, ...attributes }: PropsAppSidebarType = $props();
</script>

<!-- Modül rayı: logo, modüller (ikon + kısa ad). Bulunulan modül marka tonunda, solda şeritle işaretli. -->
<section class="{classes} flex h-full w-[4.5rem] flex-col overflow-hidden" {...attributes}>
	<header class="flex items-center justify-center py-3">
		<a href={resolve('app')} class="flex size-10 items-center justify-center select-none" aria-label={t('menu.home')}>
			<img class="size-9 select-none" src="/images/logo/logo_512.png" alt="" />
		</a>
	</header>
	<nav aria-label={t('menu_modules')} class="flex flex-1 flex-col items-center gap-1 overflow-x-hidden overflow-y-auto px-1.5 pb-3">
		{#each modules as d (d.id)}
			{@const current = d.id === activeId}
			<a
				href={firstHref(d)}
				aria-label={menuTitle(d)}
				{@attach tooltip({ text: menuTitle(d), position: 'right' })}
				aria-current={current ? 'page' : undefined}
				class="group relative flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 select-none {current
					? 'slc-nav-current'
					: 'text-surface-600 hover:bg-surface-200 hover:text-surface-900'}"
			>
				<!-- bulunulan modül: rayın sol kenarında şerit -->
				<span
					class="bg-primary-500 absolute top-1/2 -left-1.5 h-6 w-1 -translate-y-1/2 rounded-r transition-opacity {current ? 'opacity-100' : 'opacity-0'}"
					aria-hidden="true"
				></span>
				{#if d.icon}<Icon name={d.icon} size={22} />{/if}
				<span class="w-full truncate text-center text-[10px] leading-tight font-medium" aria-hidden="true">{menuTitle(d)}</span>
			</a>
		{/each}
	</nav>
</section>
