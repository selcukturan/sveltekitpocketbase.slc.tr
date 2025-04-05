<script lang="ts" generics="TData extends Row">
	import type { Row, Footers } from './types';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLTableAttributes & {
		data?: TData[];
		toolbar?: Snippet;
		thead?: Snippet;
		tbody?: Snippet<[TData, number]>;
		tfoot?: Snippet<[Footers<TData>, number]>;
		statusbar?: Snippet;
		class?: string;
		tableContainerClass?: string;
		containerClass?: string;
	};
	const {
		data,
		toolbar,
		thead,
		tbody,
		tfoot,
		statusbar,
		class: tableClass = '',
		tableContainerClass = '',
		containerClass = '',
		...attributes
	}: Props = $props();

	const table = getTable<TData>();

	const scrollAction = (tableNode: HTMLTableElement) => {
		let isScrolling: boolean = false;

		const setScrollTop = async () => {
			if (isScrolling) return; // Eğer fonksiyon zaten çalışıyorsa, yeni çağrıyı atlar
			const { scrollLeft, scrollTop, clientHeight, clientWidth, scrollHeight, scrollWidth } = tableNode;
			if (scrollTop === table.lastScrollTop) return; // virtual scroll özelliği sadece dikey scroll'da çalışır

			table.lastScrollTop = scrollTop;
			isScrolling = true;

			const scrollableHeight = scrollHeight - clientHeight;
			const scrollableWidth = scrollWidth - clientWidth;
			const scrollableTop = Math.floor(scrollTop);
			const scrollableLeft = Math.floor(scrollLeft);

			table.scrollTop = scrollTop; // scrollTop değiştiğinde `data` yeniden hesaplanır
			await tick(); // table.scrollTop state'i değiştiğinde, dom'da yapılacak tüm değişiklikleri bekler.

			// iOS cihazlardaki bounce effect kontrolü.
			// Scroll yapılabilir alanın dışına çıkıldığında `tableNode.scrollTo` manuel çalıştırılmaz.
			if (scrollableTop >= 0 && scrollableTop <= scrollableHeight && scrollableLeft >= 0 && scrollableLeft <= scrollableWidth) {
				tableNode.scrollTo({ top: table.scrollTop });
			}

			isScrolling = false;
		};

		tableNode.addEventListener('scroll', setScrollTop, { passive: true });

		return {
			destroy() {
				tableNode.removeEventListener('scroll', setScrollTop);
			}
		};
	};
</script>

<div class={`slc-table-main ${containerClass}`}>
	{@render toolbar?.()}
	<div class={`slc-table-container ${tableContainerClass}`}>
		<table
			class={`slc-table ${tableClass}`}
			bind:this={table.element}
			use:scrollAction
			bind:clientHeight={table.clientHeight}
			style:grid-template-rows={table.gridTemplateRows}
			style:grid-template-columns={table.gridTemplateColumns}
			{...attributes}
		>
			{#if thead}
				<thead class="contents">
					{@render thead?.()}
				</thead>
			{/if}
			{#if tbody}
				<tbody class="contents">
					{#each table.data as row, rowindex (row.id)}
						{@render tbody?.(row, rowindex)}
					{/each}
				</tbody>
			{/if}
			{#if tfoot}
				<tfoot class="contents">
					{#each table.footers as foot, footerindex}
						{@render tfoot?.(foot, footerindex)}
					{/each}
				</tfoot>
			{/if}
		</table>
	</div>
	{@render statusbar?.()}
</div>

<style lang="postcss">
	.slc-table-main {
		@apply flex h-full w-full flex-col overflow-hidden;
	}
	.slc-table-container {
		@apply relative flex-1 overflow-hidden;
	}
	.slc-table {
		@apply grid h-full w-full overflow-auto bg-surface-50;
	}
</style>
