<script lang="ts">
	import { page } from '$app/stores';
	import { getGlobalStates } from '$lib/states/global.svelte';
	import tooltip from '$lib/actions/tooltip';
	import type { PropsAppSidebarType } from './types';
	import { Icon } from '$lib/components/icons';

	let { sidebarData }: PropsAppSidebarType = $props();

	const globalStates = getGlobalStates();
</script>

<section class="flex h-full w-full flex-row overflow-hidden sm:flex-col">
	<header class="flex items-center justify-center px-2 sm:py-2">
		<a href="/" class="flex h-10 w-10 select-none items-center justify-center">
			<img class="h-10 w-10 select-none" src="/images/logo/logo_512.png" alt="SLC Web logo" />
		</a>
	</header>
	<nav
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
			slc-hide-scrollbar
			sm:flex-col
			sm:overflow-y-auto
			sm:overflow-x-hidden"
	>
		{#each sidebarData as d, i}
			<a
				href={`${d.href}`}
				aria-label={d.title}
				aria-current={d.href === '/' && $page.url.pathname === '/'
					? 'page'
					: d.href !== '/' && $page.url.pathname.startsWith(`${d.href}`)
						? 'page'
						: undefined}
				use:tooltip={{ text: d.title, position: globalStates.isMobileBreakpoint ? 'bottom' : 'right' }}
				class="
					relative
					inline-flex
					min-h-[45px]
					min-w-[45px]
					cursor-pointer
					select-none
					items-center
					justify-center
					rounded-xl
					border-2
					border-solid
					border-transparent
					p-2
					text-center
					align-middle
					text-2xl
					leading-none
					text-inherit
					no-underline
					outline-0
					transition-colors
					duration-150
					hover:bg-surface-200
					active:bg-surface-300
					aria-[current]:border-primary-900
					aria-[current]:bg-primary-50
					aria-[current]:text-primary-900"
			>
				<span>
					<Icon name={`${d.icon}`} size={globalStates.isMobileBreakpoint ? `18px` : `22px`} />
				</span>
			</a>
		{/each}
	</nav>
	<footer class="flex items-center justify-center px-2 sm:py-2">
		<figure class="flex h-10 w-10 select-none items-center justify-center rounded-full bg-secondary-300">
			<span>x</span>
		</figure>
	</footer>
</section>
