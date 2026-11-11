<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { AppSidebar, AppHeader } from '..';
	import type { AppLayoutPropsType, SidebarDataType } from '../types';
	import { getGlobalContext } from '#lib/app/global.svelte.js';

	let { children, class: classes, ...attributes }: AppLayoutPropsType = $props();

	let global = getGlobalContext();

	// Başlıklar seçili dile göre çevrilir
	let sidebarData: SidebarDataType[] = $derived([
		{
			title: t('menu_home'),
			href: '/app',
			icon: 'home'
		},
		{
			title: t('menu_grapes'),
			href: '/app/grapes',
			icon: 'grape'
		},
		{
			title: t('menu_data_table'),
			href: '/app/data-table',
			icon: 'data_table'
		},
		{
			title: t('menu_logs'),
			href: '/app/logs',
			icon: 'chart_spline'
		},
		{
			title: t('menu_developments'),
			href: '/app/developments',
			icon: 'square_code'
		},
		{
			title: t('menu_settings'),
			href: '/app/settings',
			icon: 'settings'
		}
	]);
</script>

<section class="{classes} flex h-full w-full flex-col" {...attributes}>
	<AppHeader />
	<main class="flex-1 overflow-hidden">
		<section class="flex h-full w-full flex-col sm:flex-row">
			<div class={`${global.hideSidebar ? 'hidden' : 'block'} bg-surface-50 overflow-hidden border-r-0 border-b sm:border-r sm:border-b-0`}>
				<AppSidebar {sidebarData} />
			</div>
			<div class="flex-1 overflow-hidden">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</section>
	</main>
	<!-- <AppFooter /> -->
</section>
