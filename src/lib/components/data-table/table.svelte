<script lang="ts" generics="TData extends Row">
	import type { Row, Footer, Sources } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { onMount, tick } from 'svelte'; // tick eklendi (onMount içinde gerekebilir)
	import { getTable } from './tables.svelte';
	import { debounce /* , throttle  */ } from './utils'; // lodash kullanıldı

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

	// --- OPTIMIZED virtualScrollAction ---
	const virtualScrollAction = (tableNode: HTMLDivElement) => {
		if (table.get.enableVirtualization === false) return;

		// setScrollTop kaldırıldı, doğrudan updateVisibleIndexes çağrılacak
		const setScrollTop = () => {
			table.updateVisibleIndexes();
		};

		/* // Throttled handler şimdi table.updateVisibleIndexes'ı çağırıyor
		const throttledScrollHandler = throttle(() => {
			// console.log('Scroll event throttled - updating indexes'); // Debug
			console.log('virtualScrollAction - updateVisibleIndexes called');
			table.updateVisibleIndexes();
		}, 60); // 60ms gecikme makul olabilir, test edin */

		tableNode.addEventListener('scroll', setScrollTop, { passive: true });

		return {
			destroy() {
				tableNode.removeEventListener('scroll', setScrollTop);
				// throttledScrollHandler.cancel(); // Throttle'ı temizle
			}
		};
	};

	// --- OPTIMIZED ResizeObserver ---
	let resizeObserver: ResizeObserver | null = null;
	// Debounced handler (resize için daha iyi)
	const debouncedResizeHandler = debounce(() => {
		// console.log('Resize event debounced - updating indexes'); // Debug
		console.log('readonly debouncedResizeHandler - updateVisibleIndexes called');
		table.updateVisibleIndexes();
	}, 60); // Resize sonrası 60ms bekle

	onMount(() => {
		// İlk render sonrası boyutlar/scroll pozisyonu belli olunca indexleri hesapla
		const initialUpdate = async () => {
			await tick(); // DOM'un güncellenmesini bekle
			if (table.element) {
				console.log('readonly initialUpdate - updateVisibleIndexes called');
				table.updateVisibleIndexes();
			}
		};

		if (table.get.enableVirtualization === true) {
			resizeObserver = new ResizeObserver((_entries) => {
				// Entries detayına gerek yok, sadece resize olduğunu bilmemiz yeterli
				debouncedResizeHandler();
			});

			if (table.element) {
				resizeObserver.observe(table.element);
				// Başlangıçta indexleri hesapla
				// await kullanmadık. çünkü initialUpdate fonksiyonu bir değer döndürmüyor ve onMount içindeki başka bir kodun çalışması, initialUpdate'in tamamlanmasına bağlı değil.
				initialUpdate();
			}
		}

		return () => {
			if (resizeObserver && table.element) {
				resizeObserver.unobserve(table.element);
			}
			if (resizeObserver) {
				resizeObserver.disconnect(); // Observer'ı tamamen temizle
			}
			debouncedResizeHandler.cancel(); // Debounce'u temizle
		};
	});

	// EnableVirtualization değiştiğinde Observer'ı kur/kaldır ve ilk hesaplamayı yap
	$effect(() => {
		const enabled = table.get.enableVirtualization;
		const element = table.element; // Element state'ini de dinle

		if (enabled && element) {
			if (!resizeObserver) {
				// Zaten varsa tekrar kurma
				resizeObserver = new ResizeObserver((_entries) => {
					debouncedResizeHandler();
				});
				resizeObserver.observe(element);
				// Etkinleştirildiğinde ilk hesaplamayı yap
				tick().then(() => table.updateVisibleIndexes());
			}
		} else {
			if (resizeObserver && element) {
				resizeObserver.unobserve(element);
				resizeObserver.disconnect();
				resizeObserver = null;
				debouncedResizeHandler.cancel();
			}
		}
	});
</script>

<div class:slc-table-main={true} class={containerClass} style:width={table.get.width} style:height={table.get.height}>
	{@render toolbar?.()}
	<div class:slc-table-container={true} class={tableContainerClass}>
		<!-- Bu kısımlar aynı kalır -->
		<div style:display={'none'} class:slc-table-action-content={true}>Veri yok</div>
		<div style:display={table.get.data.length > 0 ? 'none' : 'flex'} class:slc-table-no-data={true}>Gösterilecek veri yok</div>

		<!-- Ana tablo div'i -->
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

			{#if table.get.enableVirtualization === true}
				{#each table.virtualData as row, rowindex (row.oi)}
					{@render tbody?.(row, rowindex)}
				{/each}
			{:else}
				{#each table.get.data as row, rowindex (rowindex)}
					{@render tbody?.(row, rowindex)}
				{/each}
			{/if}

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
	/* Style aynı kalır */
	.slc-table-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.slc-table-container {
		position: relative;
		flex: 1 1 0%;
		overflow: hidden;
	}
	[data-scope='table'] {
		display: grid;
		width: 100%;
		height: 100%;
		contain: strict; /* Daha agresif containment, layout/paint izolasyonu */
		content-visibility: auto;
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
