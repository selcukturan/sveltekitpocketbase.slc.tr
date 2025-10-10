<script lang="ts" module>
	/**
	 * Bu blok içindeki kod, tarayıcı veya sunucu Debug.svelte dosyasını ilk kez yüklediğinde sadece bir kez çalışır.
	 * Bu blokta tanımlanan şeyler, o bileşenin tüm örnekleri arasında paylaşılır.
	 */
	import type { HTMLAttributes } from 'svelte/elements';
	import { untrack, type Snippet } from 'svelte';
	import type {
		Row,
		Column,
		Footer,
		FooterRowType,
		DataRowType,
		HeaderRowType
	} from './types';
	import { ScrollState, AnimationFrames, ElementSize, watch } from 'runed';
	import { setContext } from './context.svelte';
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

	const {
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

	const context = setContext();

	let el = $state<HTMLElement>();

	const size = new ElementSize(() => el);
	const scroll = new ScrollState({ element: () => el });

	let throttledY = $state(0);
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

	// virtualData trigger
	let rowIndices = $state.raw({
		start: 0,
		end: 0
	});

	watch(
		[() => throttledY, () => items, () => size.height],
		([y, items, clientHeight]) => {
			const overscan = 10;
			const rowHeight = 35;

			const start = Math.max(0, Math.floor(y / rowHeight) - overscan);
			const end = Math.min(
				items.length - 1,
				Math.floor((y + clientHeight) / rowHeight) + overscan
			);

			const indicesChanged =
				start !== rowIndices.start || end !== rowIndices.end;

			if (indicesChanged) {
				rowIndices = {
					start: start,
					end: end
				};
			}
		}
	);

	const virtualData = $derived.by(() => {
		const rawData = untrack(() => items);

		const processedData: { data: TData; originalIndex: number }[] = [];

		for (let i = rowIndices.start; i <= rowIndices.end; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row, originalIndex: i });
			}
		}

		return processedData;
	});

	$inspect('virtualData', virtualData);

	const visibleColumns = $derived.by(() => {
		const processedColumns: { data: Column<TData>; originalIndex: number }[] =
			[];

		for (let i = 0; i <= columns.length; i++) {
			const col = columns[i];
			if (col && col.hidden !== true) {
				processedColumns.push({ data: col, originalIndex: i });
			}
		}

		return processedColumns;
	});

	const gridTemplateRows = $derived.by(() => {
		const headerCount = 1;
		const headerRowHeight = 35;
		const dataRowHeight = 35;
		const footerRowHeight = 35;
		const footerLength = footers?.length || 0;
		const itemLength = items.length || 0;

		const headerRowRepeat: string =
			headerCount >= 1 ? `repeat(${headerCount}, ${headerRowHeight}px)` : ``;
		const dataRowRepeat: string =
			itemLength > 0 ? `repeat(${itemLength}, ${dataRowHeight}px)` : ``;
		const footerRowRepeat: string =
			footerLength > 0 ? `repeat(${footerLength}, ${footerRowHeight}px)` : ``;

		return [headerRowRepeat, dataRowRepeat, footerRowRepeat].join(' ');
	});

	const gridTemplateColumns = $derived.by(() => {
		const columnsWidth = visibleColumns.map((col) => col.data.width ?? `150px`);
		return columnsWidth.join(' ');
	});
</script>

<div
	class:slc-table-main={true}
	class={mainClass}
	style:width={`100%`}
	style:height={`100%`}
>
	{@render toolbar?.()}
	<div
		style="display: flex; gap: 1rem; padding: 0.5rem; font-size: 0.75rem; color: var(--color-text-500);"
	>
		<div>
			fps: {fpsLimit} / {animation.fps.toFixed(0)}
		</div>
		<div>
			delta: 16.67 / {delta.toFixed(2)}
		</div>
		<div>frames: {frames}</div>
	</div>

	<div class:slc-table-container={true} class={containerClass}>
		{#if items.length === 0}
			<div class="slc-table-nodata">No data to display</div>
		{/if}
		{#if loading}
			<div class="slc-table-nodata">Loading...</div>
		{/if}
		<div
			class:slc-table={true}
			class={tableClass}
			role="grid"
			bind:this={el}
			{...attributes}
			style:grid-template-rows={gridTemplateRows}
			style:grid-template-columns={gridTemplateColumns}
		>
			{@render headerRow?.({
				columns: visibleColumns,
				dataLength: items.length,
				headerHeight: 35,
				headerCount: 1
			})}

			{#each virtualData as row, virtualIndex (row.data.id)}
				{@render dataRow?.({
					row: row.data,
					rowVirtualIndex: virtualIndex,
					rowOriginalIndex: row.originalIndex,
					columns: visibleColumns,
					dataLength: items.length,
					dataHeight: 35,
					headerCount: 1
				})}
			{/each}

			{#if items.length > 0 && footers && footers.length > 0}
				{#each footers as row, footerIndex (footerIndex)}
					{@render footerRow?.({
						footerRow: row,
						columns: visibleColumns,
						footerIndex,
						dataLength: items.length,
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
