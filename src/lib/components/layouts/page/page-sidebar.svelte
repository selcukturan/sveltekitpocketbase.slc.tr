<script lang="ts">
	import { page } from '$app/state';
	import type { PageSidebarPropsType } from './types';

	let { pageSidebardata }: PageSidebarPropsType = $props();
</script>

<aside class="flex h-full w-full flex-col overflow-hidden">
	<header class="p-2"></header>

	<main class="relative flex-1 overflow-x-hidden overflow-y-auto px-4 py-0">
		{#each pageSidebardata as d, i}
			<div
				class="mx-1
				mt-7
				mb-3
				flex
				w-full
				items-center
				gap-1
				text-sm
				leading-4
				font-semibold
				[&:nth-child(1)]:mt-0"
			>
				{d.title}
			</div>
			{#each d.child as c, j}
				<a
					href={c.href}
					aria-label={c.title}
					aria-current={c.root && page.url.pathname == c.href ? 'page' : !c.root && page.url.pathname == c.href ? 'page' : undefined}
					class="text-surface-500
					hover:bg-surface-200
					hover:text-surface-900
					active:bg-surface-300
					aria-[current]:bg-surface-200
					aria-[current]:text-surface-900
					relative
					mx-0
					my-1
					flex
					min-h-[40px]
					w-full
					min-w-0
					cursor-pointer
					items-center
					gap-x-2
					rounded
					px-3
					py-1
					text-base
					no-underline
					select-none"
				>
					<span>
						<i class={`${c.icon} !text-xl`}></i>
					</span>
					<span class="inline-block overflow-hidden align-top text-ellipsis whitespace-nowrap">
						{c.title}
					</span>
				</a>
			{/each}
		{/each}
	</main>
	<footer class="p-0"></footer>
</aside>
