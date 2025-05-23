<script lang="ts" generics="TData extends Row">
	import type { Row, Footer, Sources } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { getTable } from './tables.svelte';
	import { debounce, throttle } from './utils';

	type Props = HTMLAttributes<HTMLDivElement> & {
		src: Sources<TData>;
		toolbar?: Snippet;
		thead: Snippet;
		tbody: Snippet<[TData, number]>;
		tfoot?: Snippet<[Footer<TData>, number]>;
		statusbar?: Snippet;
		class?: string;
		tableContainerClass?: string;
		containerClass?: string;
	};
	const { src, toolbar, thead, tbody, tfoot, statusbar, class: tableClass, tableContainerClass, containerClass, ...attributes }: Props = $props();

	const table = getTable<TData>(src.id);

	const virtualScrollAction = (tableNode: HTMLDivElement) => {
		let ticking = false;

		table.cachedClientHeight = Math.round(tableNode.clientHeight);
		table.cachedScrollTop = Math.round(tableNode.scrollTop);

		const handleScroll = () => {
			if (!ticking) {
				const newScrollTop = Math.round(tableNode.scrollTop);
				const cachedScrollTop = table.cachedScrollTop ?? 0;
				const scrollDelta = Math.abs(newScrollTop - cachedScrollTop);
				const overscan = Math.max(1, table.defaultOverscanThreshold - 1);
				const scrollThreshold = table.get.tbodyRowHeight * overscan;

				if (scrollDelta > scrollThreshold) {
					ticking = true;
					/* requestAnimationFrame(() => { */
					table.cachedScrollTop = newScrollTop;
					table.updateVisibleIndexes();
					tick().then(() => {
						ticking = false;
					});
					/* }); */
				}
			}
		};

		tableNode.addEventListener('scroll', handleScroll, { passive: true });

		return {
			destroy() {
				tableNode.removeEventListener('scroll', handleScroll);
			}
		};
	};

	let resizeObserver: ResizeObserver | null = null;

	// Debounced handler (resize için daha iyi)
	const debouncedResizeHandler = debounce((height: number) => {
		// await kaldırıldı
		table.cachedClientHeight = height;
		// table.setVirtualDataDerivedTrigger(`height_${height}`);
	}, 30);

	$effect(() => {
		const enabled = table.get.enableVirtualization;
		const element = table.element; // Element state'ini de dinle

		if (enabled && element) {
			if (!resizeObserver) {
				// Zaten varsa tekrar kurma
				resizeObserver = new ResizeObserver(async (entries) => {
					for (let entry of entries) {
						const clientHeight = entry.contentRect.height;
						if (clientHeight === 0) return;
						debouncedResizeHandler(clientHeight);
					}
				});
				resizeObserver.observe(element);
			}
		} else {
			if (resizeObserver && element) {
				resizeObserver.unobserve(element);
				resizeObserver.disconnect();
				resizeObserver = null;
			}
		}

		return () => {
			if (resizeObserver && element) {
				resizeObserver.unobserve(element);
				resizeObserver.disconnect();
				resizeObserver = null;
			}
		};
	});
</script>

<div class:slc-table-main={true} class={containerClass} style:width={table.get.width} style:height={table.get.height}>
	{@render toolbar?.()}
	<div class:slc-table-container={true} class={tableContainerClass}>
		<div style:display={'none'} class:slc-table-action-content={true}>Gösterilecek veri yok</div>
		<div style:display={table.get.data.length > 0 ? 'none' : 'flex'} class:slc-table-no-data={true}>Gösterilecek veri yok</div>
		<div
			role="grid"
			bind:this={table.element}
			use:virtualScrollAction
			data-id={src.id}
			class={tableClass}
			data-scope="table"
			style:grid-template-rows={table.gridTemplateRows}
			style:grid-template-columns={table.gridTemplateColumns}
			style:scroll-padding-block-start={table.headerRowsCount > 0 ? table.headerRowsCount * table.get.theadRowHeight + 'px' : undefined}
			style:scroll-padding-block-end={table.get.footers.length > 0 ? table.get.footers.length * table.get.tfootRowHeight + 'px' : undefined}
			style:scroll-padding-inline-start={table.getFocusedCell?.colIndex === -1 || table.get.rowSelection === 'none' ? undefined : table.get.rowSelectionColumnWidth + 'px'}
			style:scroll-padding-inline-end={table.getFocusedCell?.colIndex === table.visibleColumns.length || table.get.rowAction === false ? undefined : table.get.rowActionColumnWidth + 'px'}
			aria-colcount={table.visibleColumns.length}
			aria-rowcount={table.get.data.length + table.get.footers.length + table.headerRowsCount}
			{...attributes}
		>
			{@render thead?.()}

			{#each table.virtualData as rowWrapper, rowindex (rowWrapper.roi)}
				{@render tbody?.(rowWrapper.data, rowWrapper.roi)}
			{/each}

			{#if table.get.data.length > 0}
				{#each table.get.footers as foot, footerindex (footerindex)}
					{@render tfoot?.(foot, footerindex)}
				{/each}
			{/if}
		</div>
	</div>
	{@render statusbar?.()}
</div>

<style>
	.slc-table-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		contain: inline-size;
	}
	.slc-table-container {
		position: relative;
		flex: 1 1 0%;
		overflow: hidden;
		contain: inline-size;
	}
	[data-scope='table'] {
		display: grid;
		width: 100%;
		height: 100%;
		contain: strict; /* contain özelliği, bir elementin içeriksel sınırlarını belirler ve tarayıcıların bu sınırlar içinde optimizasyon yapmasına olanak tanır. content: Elementin içeriği, boyut, düzen ve stil açısından izole edilir. */
		content-visibility: auto; /* auto: Tarayıcı, elementin içeriğini yalnızca görünür olduğunda render eder. Bu, performans optimizasyonları yapmasına olanak tanır. */
		will-change: transform; /* Bunu ekleyin */
		box-sizing: border-box;
		overflow: auto;
		overscroll-behavior: none;
	}
	.slc-table-no-data {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		height: 100%;
		width: 100%;
		pointer-events: none;
		position: absolute;
		z-index: 50;
	}
</style>
