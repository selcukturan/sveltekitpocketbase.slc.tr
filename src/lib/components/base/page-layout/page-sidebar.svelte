<script lang="ts">
	import { page } from '$app/stores';
	import type { PageSidebarPropsType } from './types';
	import { Icon } from '$lib/components/icons';

	let { pageSidebardata }: PageSidebarPropsType = $props();
</script>

<aside class="flex h-full w-full flex-col overflow-hidden">
	<header class="p-2"></header>

	<main class="relative flex-1 overflow-y-auto overflow-x-hidden px-4 py-0">
		{#each pageSidebardata as d, i}
			<div
				class="mx-1
				mb-3
				mt-7
				flex
				w-full
				items-center
				gap-1
				text-sm
				font-semibold
				leading-4
				[&:nth-child(1)]:mt-0"
			>
				{d.title}
			</div>
			{#each d.child as c, j}
				<a
					href={c.href}
					aria-label={c.title}
					aria-current={c.root && $page.url.pathname == c.href ? 'page' : !c.root && $page.url.pathname == c.href ? 'page' : undefined}
					class="relative
					mx-0
					my-1
					flex
					min-h-[40px]
					w-full
					min-w-0
					cursor-pointer
					select-none
					items-center
					gap-x-2
					rounded
					px-3
					py-1
					text-base
					text-surface-500
					no-underline
					outline-0
					transition-colors
					duration-150
					hover:bg-surface-200
					hover:text-surface-900
					active:bg-surface-300
					aria-[current]:bg-surface-200
					aria-[current]:text-surface-900"
				>
					<span>
						<Icon name={`${c.icon}`} />
					</span>
					<span class="inline-block overflow-hidden text-ellipsis whitespace-nowrap align-top">
						{c.title}
					</span>
				</a>
			{/each}
		{/each}
	</main>
	<footer class="p-0"></footer>
</aside>
