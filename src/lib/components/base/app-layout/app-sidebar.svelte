<script lang="ts">
	import { page } from '$app/state';
	import { getGlobalContext } from '$lib/client/app/global.svelte';
	import type { PropsAppSidebarType } from './types';
	import { Icon } from '$lib/components/icons';
	import { Tooltip } from '$lib/components/bits/tooltip';
	/* import { Tooltip as TooltipZag } from '$lib/components/zagjs/tooltip'; */

	let { sidebarData }: PropsAppSidebarType = $props();

	const global = getGlobalContext();
</script>

<section class="flex h-full w-full flex-row overflow-hidden sm:flex-col">
	<header class="flex items-center justify-center px-2 sm:py-2">
		<a href="/" class="flex h-10 w-10 items-center justify-center select-none">
			<img class="h-10 w-10 select-none" src="/images/logo/logo_512.png" alt="SLC Web logo" />
		</a>
	</header>
	<nav
		class="slc-hide-scrollbar
			flex
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
		{#each sidebarData as d, i}
			<Tooltip contentProps={{ side: global.isMobileBreakpoint ? 'bottom' : 'right' }}>
				<!-- <TooltipZag positioning={{ placement: global.isMobileBreakpoint ? 'bottom' : 'right' }} openDelay={0} closeDelay={0}> -->
				{#snippet trigger()}
					<a
						href={`${d.href}`}
						aria-label={d.title}
						aria-current={d.href === '/' && page.url.pathname === '/'
							? 'page'
							: d.href !== '/' && page.url.pathname.startsWith(`${d.href}`)
								? 'page'
								: undefined}
						class="
						hover:bg-surface-200
						active:bg-surface-300
						aria-[current]:border-primary-900
						aria-[current]:bg-primary-50
						aria-[current]:text-primary-900
						relative
						inline-flex
						min-h-[45px]
						min-w-[45px]
						cursor-pointer
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
						select-none"
					>
						<span>
							<Icon name={`${d.icon}`} size={global.isMobileBreakpoint ? `18px` : `22px`} />
						</span>
					</a>
				{/snippet}
				{d.title}
				<!-- {#snippet content()}
					<p>{d.title}</p>
				{/snippet} -->
			</Tooltip>
		{/each}
	</nav>
	<footer class="flex items-center justify-center px-2 sm:py-2">
		<figure class="bg-secondary-300 flex h-10 w-10 items-center justify-center rounded-full select-none">
			<span>x</span>
		</figure>
	</footer>
</section>
