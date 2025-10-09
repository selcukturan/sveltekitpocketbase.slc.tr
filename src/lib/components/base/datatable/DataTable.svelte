<script lang="ts" module>
	/**
	 * Bu blok içindeki kod, tarayıcı veya sunucu Debug.svelte dosyasını ilk kez yüklediğinde sadece bir kez çalışır.
	 * Bu blokta tanımlanan şeyler, o bileşenin tüm örnekleri arasında paylaşılır.
	 */
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, Column, Footer, VisibleColumn } from './types';
	import { ScrollState, AnimationFrames, ElementSize } from 'runed';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		items?: TData[];
		columns: Column<TData>[];
		footers?: Footer<TData>[];
		toolbar?: Snippet;
		header: Snippet<[{ columns: VisibleColumn<TData>[] }]>;
		data: Snippet<
			[
				{
					row: TData;
					columns: VisibleColumn<TData>[];
					rowVirtualIndex: number;
					rowOriginalIndex: number;
					dataLength: number;
					dataHeight: number;
					headersCount: number;
				}
			]
		>;
		footer?: Snippet<
			[
				{
					footerRow: Footer<TData>;
					columns: VisibleColumn<TData>[];
					footerIndex: number;
					dataLength: number;
					footerLength: number;
					footerHeight: number;
					headersCount: number;
				}
			]
		>;
		statusbar?: Snippet;
		class?: string;
		tableContainerClass?: string;
		containerClass?: string;
	};

	const {
		items = [],
		columns,
		footers,
		toolbar,
		header,
		data,
		footer,
		statusbar,
		class: tableClass,
		tableContainerClass,
		containerClass,
		...attributes
	}: Props = $props();

	let el = $state<HTMLElement>();

	const size = new ElementSize(() => el);
	const scroll = new ScrollState({ element: () => el });

	let throttledY = $state(0); // trigger
	let fpsLimit = $state(60);
	let frames = $state(0);
	let delta = $state(0);
	const animation = new AnimationFrames(
		(args) => {
			frames++;
			delta = args.delta;
			throttledY = scroll.y;
		},
		{ fpsLimit: () => fpsLimit }
	);

	let virtualData = $derived.by(() => {
		const y = throttledY; // trigger
		const overscan = 10;
		const rawData = items; // trigger
		const totalRows = rawData.length; // trigger
		const rowHeight = 35;
		const clientHeight = size.height; // trigger
		const startIndex = Math.max(0, Math.floor(y / rowHeight) - overscan);
		const endIndex = Math.min(totalRows - 1, Math.floor((y + clientHeight) / rowHeight) + overscan);

		const processedData: { data: TData; originalIndex: number }[] = [];

		for (let i = startIndex; i <= endIndex; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row, originalIndex: i });
			}
		}

		return processedData;
	});

	let visibleColumns = $derived.by(() => {
		const processedColumns: { data: Column<TData>; originalIndex: number }[] = [];

		for (let i = 0; i <= columns.length; i++) {
			const col = columns[i];
			if (col && col.hidden !== true) {
				processedColumns.push({ data: col, originalIndex: i });
			}
		}

		return processedColumns;
	});

	const gridTemplateRows = $derived.by(() => {
		const headerRowsCountState = 1;
		const srcTheadRowHeight = 35;
		const srcTbodyRowHeight = 35;
		const srcTfootRowHeight = 35;
		const repeatThead = headerRowsCountState >= 1 ? `repeat(${headerRowsCountState}, ${srcTheadRowHeight}px)` : ``;
		const repeatTbody = items.length > 0 ? `repeat(${items.length}, ${srcTbodyRowHeight}px)` : ``;
		const repeatTfoot = footers && footers.length > 0 ? `repeat(${footers.length}, ${srcTfootRowHeight}px)` : ``;
		return `${repeatThead} ${repeatTbody} ${repeatTfoot}`;
	});
</script>

<div
	data-slc-table-main
	class={containerClass}
	style:display={`flex`}
	style:flex-direction={`column`}
	style:overflow={`hidden`}
	style:width={`100%`}
	style:height={`100%`}
>
	{@render toolbar?.()}
	<div style="display: flex; gap: 1rem; padding: 0.5rem; font-size: 0.75rem; color: var(--color-text-500);">
		<div>
			fps: {fpsLimit} / {animation.fps.toFixed(0)}
		</div>
		<div>
			delta: 16.67 / {delta.toFixed(2)}
		</div>
		<div>frames: {frames}</div>
	</div>

	<div data-slc-table-container style:flex={`1 1 0%;`} style:overflow={`hidden`}>
		<div data-slc-table-no-data style:display={items.length > 0 ? 'none' : 'flex'}>Gösterilecek veri yok</div>
		<div
			data-slc-table
			role="grid"
			bind:this={el}
			{...attributes}
			style:overflow={`auto`}
			style:grid-template-rows={gridTemplateRows}
			style:grid-template-columns={`minmax(75px, 1fr) minmax(75px, 1fr) minmax(75px, 1fr) minmax(75px, 1fr)`}
			style:display={`grid`}
			style:block-size={`100%`}
			style:contain={`content`}
			style:content-visibility={`auto`}
			style:box-sizing={`border-box`}
			style:background-color={`var(--color-surface-50)`}
		>
			{@render header?.({ columns: visibleColumns })}

			{#each virtualData as row, virtualIndex (row.data.id)}
				{@render data?.({
					row: row.data,
					rowVirtualIndex: virtualIndex,
					rowOriginalIndex: row.originalIndex,
					columns: visibleColumns,
					dataLength: items.length,
					dataHeight: 35,
					headersCount: 1
				})}
			{/each}

			{#if items.length > 0 && footers && footers.length > 0}
				{#each footers as footerRow, footerIndex (footerIndex)}
					{@render footer?.({
						footerRow,
						columns: visibleColumns,
						footerIndex,
						dataLength: items.length,
						footerLength: footers.length,
						footerHeight: 35,
						headersCount: 1
					})}
				{/each}
			{/if}
		</div>
	</div>
	{@render statusbar?.()}
</div>

<style>
	[data-slc-table-no-data] {
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
