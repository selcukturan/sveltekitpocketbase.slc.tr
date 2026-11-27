<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { t } from '#lib/app/localization/index.js';
	import { getGlobalContext } from '#lib/app/global.svelte.js';
	import type { PropsAppSidebarType } from './types';
	import { tooltip } from '#lib/attachments/index.js';
	import { resolve } from '$app/paths';
	import { Icon } from '#lib/components/icons/index.js';
	import { menuTitle } from '#lib/app/menu/menu.js';
	import { firstHref } from '#lib/app/menu/tree.js';

	// Modül rayı: menü ağacının kökleri. Aktif modül adresten bulunur (app-layout → findActivePath).
	let { modules, activeId, class: classes, ...attributes }: PropsAppSidebarType = $props();

	const global = getGlobalContext();
</script>

<section class="{classes} flex h-full w-full flex-row overflow-hidden sm:flex-col" {...attributes}>
	<header class="flex items-center justify-center px-2 sm:py-2">
		<a href={resolve('app')} class="flex h-10 w-10 items-center justify-center select-none">
			<img class="h-10 w-10 select-none" src="/images/logo/logo_512.png" alt="SLC Web logo" />
		</a>
	</header>
	<nav
		aria-label={t('menu_modules')}
		class="flex
			flex-1
			flex-row
			items-center
			justify-start
			gap-5
			overflow-x-auto
			overflow-y-hidden
			p-1
			text-base
			sm:flex-col
			sm:overflow-x-hidden
			sm:overflow-y-auto"
	>
		{#each modules as d (d.id)}
			<a
				href={firstHref(d)}
				aria-label={menuTitle(d)}
				{@attach tooltip({
					text: menuTitle(d),
					position: global.isMobileBreakpoint ? 'bottom' : 'right'
				})}
				aria-current={d.id === activeId ? 'page' : undefined}
				class="hover:bg-surface-200
					active:bg-surface-300
					aria-[current]:border-primary-900
					aria-[current]:bg-primary-50
					aria-[current]:text-primary-900
					relative
					inline-flex
					min-h-11.25
					min-w-11.25
					cursor-pointer
					items-center
					justify-center
					rounded-xl
					border-2
					border-solid
					border-transparent
					text-center select-none"
			>
				{#if d.icon}<Icon name={d.icon} />{/if}
			</a>
		{/each}
	</nav>
	<footer class="flex items-center justify-center px-2 sm:py-2">
		<!-- <figure class="bg-secondary-300 flex h-10 w-10 items-center justify-center rounded-full select-none">
			<span>x</span>
		</figure> -->
	</footer>
</section>
