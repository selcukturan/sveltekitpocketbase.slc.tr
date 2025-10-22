<script lang="ts" module>
	/**
	 * Bu blok içindeki kod, tarayıcı veya sunucu dosyayı ilk kez yüklediğinde sadece bir kez çalışır.
	 * Bu blokta tanımlanan şeyler, o bileşenin tüm örnekleri arasında paylaşılır.
	 */
	import type { HTMLAttributes } from 'svelte/elements';
	import { untrack, type Snippet } from 'svelte';
	import type { Row, Column, Footer, FooterRowType, DataRowType, HeaderRowType } from './types';
	import { ScrollState, AnimationFrames, watch, useResizeObserver } from 'runed';
	import { setContext } from './context.svelte';
	import { tick, onMount } from 'svelte';
	import type { Action } from 'svelte/action';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		items?: TData[];
		columns: Column<TData>[];
		footers?: Footer<TData>[];
		toolbar?: Snippet;
		headerRow: Snippet<[hr: HeaderRowType<TData>]>;
		dataRow: Snippet<[dr: DataRowType<TData>]>;
		footerRow?: Snippet<[fr: FooterRowType<TData>]>;
		statusbar?: Snippet;
		class?: string;
		containerClass?: string;
		mainClass?: string;
		loading?: boolean;
	};

	let {
		items = [],
		columns,
		footers,
		toolbar,
		headerRow,
		dataRow,
		footerRow,
		statusbar,
		class: tableClass,
		containerClass,
		mainClass,
		loading = false,
		...attributes
	}: Props = $props();

	const context = setContext<TData>();

	let el = $state<HTMLElement>();
	/* const scroll = new ScrollState({ element: () => el }); */

	let proxy = {
		get items() {
			return items;
		},
		set items(newItems) {
			items = newItems;
			updateVisibleIndexes(true);
		}
	};

	watch(
		() => items,
		(items) => {
			proxy.items = items;
		},
		{
			lazy: true
		}
	);
	let scrollY = 0;
	let clientHeight = $state(0);
	let throttledY = 0;

	let resizeObserver: ResizeObserver | null = null;
	const mount: Action = (tableNode: HTMLElement) => {
		// Tablo DOM'a monte edildi
		let ticking = false;

		// Tablo virtual scroll kurulumu
		/* this.cachedClientHeight = Math.round(el.clientHeight);
		this.cachedScrollTop = Math.round(el.scrollTop);
		this.updateVisibleIndexes(); */

		if (resizeObserver == null) {
			// Debounced Resize Handler
			resizeObserver = new ResizeObserver((entries) => {
				const entry = entries[0];
				if (!entry) return;
				clientHeight = entry.contentRect.height;
			});
			resizeObserver.observe(tableNode);
		}

		const scroll = () => {
			if (!ticking) {
				/* const defaultOverscan = 10;
				const rowHeight = 35;
				const newScrollTop = Math.round(tableNode.scrollTop);
				const cachedScrollTop = throttledY ?? 0;
				const scrollDelta = Math.abs(newScrollTop - cachedScrollTop);
				const overscan = Math.max(0, defaultOverscan - 1);
				const scrollThreshold = rowHeight * overscan; */

				/* if (scrollDelta > scrollThreshold) {
					ticking = true;
					throttledY = newScrollTop;
					updateVisibleIndexes(); */
				throttledY = Math.round(tableNode.scrollTop);
				tick().then(() => {
					ticking = false;
				});
				/* } */
			}
		};

		// mouse ile sürükleyerek scroll yapıldığında veya scrollbara bir şekilde tıklandığında, hücre focus'unun kaybolmaması için. Bu tablonun focus olmasını engeller.
		const mousedown = (e: Event) => {
			e.preventDefault();
		};

		tableNode.addEventListener('scroll', scroll, { passive: true });
		tableNode.addEventListener('mousedown', mousedown);

		$effect(() => {
			return () => {
				console.log("Tablo DOM'dan kaldırıldı");
				tableNode.removeEventListener('scroll', scroll);
				tableNode.removeEventListener('mousedown', mousedown);
				resizeObserver?.disconnect();
				resizeObserver = null;
			};
		});
	};

	let frames = 0;
	let fpsLimit = $state(60);
	let delta = $state(0);
	let fps = 0;
	$effect(() => {
		let animationFrameId: number;

		// Döngü içinde durumu korumak için gerekli değişkenler
		let lastFrameTime = performance.now();
		let frameCountForFps = 0;
		let lastFpsUpdateTime = performance.now();

		function loop(currentTime: number) {
			// Bir sonraki kare için tekrar istekte bulunuyoruz.
			animationFrameId = requestAnimationFrame(loop);

			// FPS limitlemesi için gereken süre (milisaniye cinsinden)
			const msPerFrame = 1000 / fpsLimit;
			const elapsed = currentTime - lastFrameTime;

			// Eğer bir sonraki kare için gereken süre geçmediyse, bu kareyi atla.
			if (elapsed < msPerFrame) {
				return;
			}

			// Zamanlama hatalarını önlemek için "kalan" süreyi hesaptan düşüyoruz.
			// Bu, animasyonun zamanla kaymasını engeller.
			lastFrameTime = currentTime - (elapsed % msPerFrame);

			// --- BU KARE İŞLENECEK ---

			// İstatistikleri güncelle
			frames++;
			delta = elapsed;
			frameCountForFps++;

			updateVisibleIndexes();

			// Anlık FPS'i her saniye güncelle
			if (currentTime >= lastFpsUpdateTime + 1000) {
				fps = frameCountForFps;
				frameCountForFps = 0;
				lastFpsUpdateTime = currentTime;
			}
		}

		// Animasyon döngüsünü başlat
		animationFrameId = requestAnimationFrame(loop);

		// Temizleme fonksiyonu: Bileşen DOM'dan kaldırıldığında çalışır.
		// Bu, bellek sızıntılarını ve gereksiz çalışmayı önler.
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	});

	// virtualData trigger
	let rowIndices = $state.raw({
		start: 0,
		end: 0
	});

	const updateVisibleIndexes = (force: boolean = false) => {
		const overscan = 10;
		const rowHeight = 35;

		let start = Math.max(0, Math.floor(throttledY / rowHeight) - overscan);
		let end = Math.min(proxy.items.length - 1, Math.floor((throttledY + clientHeight) / rowHeight) + overscan);

		const indicesChanged = start !== rowIndices.start || end !== rowIndices.end;

		if (force || indicesChanged) {
			rowIndices = {
				start: start >= end ? 0 : start,
				end: end
			};
		}
	};

	const virtualData = $derived.by(() => {
		const rawData = untrack(() => proxy.items);

		const processedData: { data: TData; originalIndex: number }[] = [];

		for (let i = rowIndices.start; i <= rowIndices.end; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row, originalIndex: i });
			}
		}

		return processedData;
	});

	const visibleColumns = $derived.by(() => {
		const processedColumns: { data: Column<TData>; originalIndex: number }[] = [];

		for (let i = 0; i <= columns.length; i++) {
			const col = columns[i];
			if (col && col.hidden !== true) {
				processedColumns.push({ data: col, originalIndex: i });
			}
		}

		return processedColumns;
	});

	// $inspect('throttledY', throttledY);
	// $inspect('rowIndices', rowIndices);
	$inspect('virtualData', virtualData);

	const gridTemplateRows = $derived.by(() => {
		const headerCount = 1;
		const headerRowHeight = 35;
		const dataRowHeight = 35;
		const footerRowHeight = 35;
		const footerLength = footers?.length || 0;
		const itemLength = proxy.items.length || 0;

		const headerRowRepeat: string = headerCount >= 1 ? `repeat(${headerCount}, ${headerRowHeight}px)` : ``;
		const dataRowRepeat: string = itemLength > 0 ? `repeat(${itemLength}, ${dataRowHeight}px)` : ``;
		const footerRowRepeat: string = footerLength > 0 ? `repeat(${footerLength}, ${footerRowHeight}px)` : ``;

		return [headerRowRepeat, dataRowRepeat, footerRowRepeat].join(' ');
	});

	const gridTemplateColumns = $derived.by(() => {
		const columnsWidth = visibleColumns.map((col) => col.data.width ?? `150px`);
		return columnsWidth.join(' ');
	});

	export const test = () => {
		console.log('test object');
	};
</script>

<div class:slc-table-main={true} class={mainClass} style:width={`100%`} style:height={`100%`}>
	{@render toolbar?.()}
	<div style="display: flex; gap: 1rem; padding: 0.5rem; font-size: 0.75rem; color: var(--color-text-500);">
		<div>
			fps: {fpsLimit}
		</div>
		<div>
			delta: 16.67 / {delta.toFixed(2)}
		</div>
		<div>frames:</div>
	</div>

	<div class:slc-table-container={true} class={containerClass}>
		{#if proxy.items.length === 0}
			<div class="slc-table-nodata">No data to display</div>
		{/if}
		{#if loading}
			<div class="slc-table-nodata">Loading...</div>
		{/if}
		<div
			class:slc-table={true}
			use:mount
			class={tableClass}
			role="grid"
			bind:this={el}
			{...attributes}
			style:grid-template-rows={gridTemplateRows}
			style:grid-template-columns={gridTemplateColumns}
		>
			{@render headerRow?.({
				columns: visibleColumns,
				dataLength: proxy.items.length,
				headerHeight: 35,
				headerCount: 1
			})}

			{#each virtualData as row, virtualIndex (row.data.id)}
				{@render dataRow?.({
					row: row.data,
					rowVirtualIndex: virtualIndex,
					rowOriginalIndex: row.originalIndex,
					columns: visibleColumns,
					dataLength: proxy.items.length,
					dataHeight: 35,
					headerCount: 1
				})}
			{/each}

			{#if proxy.items.length > 0 && footers && footers.length > 0}
				{#each footers as row, footerIndex (footerIndex)}
					{@render footerRow?.({
						footerRow: row,
						columns: visibleColumns,
						footerIndex,
						dataLength: proxy.items.length,
						footerLength: footers.length,
						footerHeight: 35,
						headerCount: 1
					})}
				{/each}
			{/if}
		</div>
	</div>
	{@render statusbar?.()}
</div>

<style>
	/******************************************************/
	.slc-table-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		contain: inline-size;
	}
	.slc-table-container {
		flex: 1 1 0%;
		overflow: hidden;
		contain: inline-size;
		block-size: 100%;
		position: relative;
	}
	/******************************************************/
	.slc-table {
		display: grid;
		block-size: 100%;
		contain: content;
		content-visibility: auto;
		box-sizing: border-box;
		overflow: auto;
		overscroll-behavior: none;
		background-color: var(--color-surface-50);
	}
	.slc-table:before {
		content: '';
		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}
	/******************************************************/
	.slc-table-nodata {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		pointer-events: none;
		z-index: 5;
	}
	/******************************************************/
</style>
