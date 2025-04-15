<script lang="ts" generics="TData extends Row">
	import { getTable, type Sources, type Row } from '$lib/components/data-table/tables.svelte';
	import { debounce } from '$lib/components/data-table/utils';

	const { sources: src }: { sources: Sources<TData> } = $props();
	const table = getTable<TData>(src.id);

	let cachedScrollTop = $state(0);
	let cachedClientHeight = $state(0);
	const defaultOverscanThreshold = 4;

	let virtualData = $derived.by(() => {
		const headerRowsHeight = table.headerRowsCount * table.get.theadRowHeight;
		const footerRowsHeight = table.get.footers.length * table.get.tfootRowHeight;
		const dataRowHeight = table.get.tbodyRowHeight;
		const dataLength = table.get.data.length;
		const currentScrollTop = cachedScrollTop;

		const currentHeight = cachedClientHeight - headerRowsHeight - footerRowsHeight;

		const rowVisibleStartIndex = Math.floor(currentScrollTop / dataRowHeight);
		const rowVisibleEndIndex = Math.min(dataLength - 1, Math.floor((currentScrollTop + currentHeight) / dataRowHeight));
		const rowOverscanStartIndex = Math.max(0, rowVisibleStartIndex - defaultOverscanThreshold);
		const rowOverscanEndIndex = Math.min(dataLength - 1, rowVisibleEndIndex + defaultOverscanThreshold);

		const processedData: Array<{ data: TData; oi: number }> = [];

		for (let i = rowOverscanStartIndex; i <= rowOverscanEndIndex; i++) {
			const row = table.get.data[i];
			if (row) {
				processedData.push({ data: row, oi: i });
			}
		}

		return processedData;
	});

	$inspect('virtualData', virtualData);

	const virtualScrollAction = (tableNode: HTMLDivElement) => {
		let ticking = false;
		cachedClientHeight = tableNode.clientHeight;

		const handleScroll = () => {
			if (!ticking) {
				const newScrollTop = tableNode.scrollTop;
				const scrollDelta = Math.abs(newScrollTop - cachedScrollTop);
				const scrollThreshold = table.get.tbodyRowHeight * (defaultOverscanThreshold - 1);

				if (scrollDelta > scrollThreshold) {
					ticking = true;
					requestAnimationFrame(() => {
						cachedScrollTop = tableNode.scrollTop;
						ticking = false;
					});
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
		cachedClientHeight = height;
	}, 100); // Resize sonrası 100ms bekle

	$effect(() => {
		const enabled = table.get.enableVirtualization;
		const element = table.element;

		if (enabled && element) {
			if (!resizeObserver) {
				// Zaten varsa tekrar kurma
				resizeObserver = new ResizeObserver(async (entries) => {
					for (let entry of entries) {
						const height = entry.contentRect.height;
						if (height > 0) {
							// height değerini doğrudan parametre olarak geçir
							debouncedResizeHandler(height);
						}
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

<div class:slc-table-main={true} style:width={table.get.width} style:height={table.get.height}>
	<div class:slc-table-container={true}>
		<div
			role="grid"
			bind:this={table.element}
			use:virtualScrollAction
			class:slc-table={true}
			style:grid-template-rows={table.gridTemplateRows}
			style:grid-template-columns={table.gridTemplateColumns}
			style:scroll-padding-block-start={table.headerRowsCount > 0 ? table.headerRowsCount * table.get.theadRowHeight + 'px' : undefined}
			style:scroll-padding-block-end={table.get.footers.length > 0 ? table.get.footers.length * table.get.tfootRowHeight + 'px' : undefined}
			style:scroll-padding-inline-start={table.getFocusedCell?.colIndex === -1 || table.get.rowSelection === 'none' ? undefined : table.get.rowSelectionColumnWidth + 'px'}
			style:scroll-padding-inline-end={table.getFocusedCell?.colIndex === table.visibleColumns.length || table.get.rowAction === false ? undefined : table.get.rowActionColumnWidth + 'px'}
			aria-colcount={table.visibleColumns.length}
			aria-rowcount={table.get.data.length + table.get.footers.length + table.headerRowsCount}
		>
			<div role="row" class:slc-table-trh={true} style:display="contents" aria-rowindex="1">
				{#each table.visibleColumns as col, ci (col.oi)}
					{@const ariaColIndex = ci + 1}
					<div role="columnheader" class:slc-table-th={true} style:grid-row-start="1" aria-colindex={ariaColIndex}>
						{col.label}
					</div>
				{/each}
			</div>

			{#each virtualData as rowWrapper, rowindex (rowWrapper.oi)}
				{@const row = rowWrapper.data}
				{@const ariaRowIndex = rowWrapper.oi + table.headerRowsCount + 1}
				<div role="row" class:slc-table-trd={true} style:display="contents" aria-rowindex={ariaRowIndex}>
					{#each table.visibleColumns as col, ci (col.oi)}
						{@const ariaColIndex = ci + 1}
						<div role="gridcell" class:slc-table-td={true} style:grid-row-start={ariaRowIndex} aria-colindex={ariaColIndex}>
							{row[col.field]}
						</div>
					{/each}
				</div>
			{/each}

			{#if table.get.data.length > 0 && table.get.footers.length > 0}
				{#each table.get.footers as foot, footerindex (footerindex)}
					{@const ariaRowIndex = table.get.data.length + table.headerRowsCount + footerindex + 1}
					<div role="row" class:slc-table-trf={true} style:display="contents" aria-rowindex={ariaRowIndex}>
						{#each table.visibleColumns as col, ci (col.oi)}
							{@const ariaColIndex = ci + 1}
							{@const bottom = `${(table.get.footers.length - footerindex - 1) * table.get.tfootRowHeight}px`}
							<div role="gridcell" style:bottom class:slc-table-tf={true} style:grid-row-start={ariaRowIndex} aria-colindex={ariaColIndex}>
								{foot[col.field]}
							</div>
						{/each}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style>
	/* ################################ */
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
	}
	/* ################################ */
	.slc-table {
		display: grid;
		width: 100%;
		height: 100%;
		contain: strict; /* contain özelliği, bir elementin içeriksel sınırlarını belirler ve tarayıcıların bu sınırlar içinde optimizasyon yapmasına olanak tanır. content: Elementin içeriği, boyut, düzen ve stil açısından izole edilir. */
		content-visibility: auto; /* auto: Tarayıcı, elementin içeriğini yalnızca görünür olduğunda render eder. Bu, performans optimizasyonları yapmasına olanak tanır. */
		will-change: transform; /* Bunu ekleyin */
		box-sizing: border-box;
		overflow: auto;
		overscroll-behavior: none;
		background-color: hsl(var(--surface-50));
	}
	/* ################################ */
	.slc-table-trh {
		outline: none;
		background-color: color-mix(in srgb, hsl(var(--surface-100)) 90%, hsl(var(--surface-50)) 10%);
	}
	.slc-table-trd {
		outline: none;
		background-color: hsl(var(--surface-50));
	}
	.slc-table-trf {
		outline: none;
		background-color: color-mix(in srgb, hsl(var(--surface-100)) 90%, hsl(var(--surface-50)) 10%);
	}
	/* ################################ */
	.slc-table-trd:hover {
		background-color: color-mix(in srgb, hsl(var(--surface-200)) 70%, hsl(var(--surface-50)) 30%);
	}
	/* ################################ */
	.slc-table-th {
		border-width: 0px;
		position: sticky;
		top: 0px;
		z-index: 2;
		padding: 0px;
		padding-left: 0.5rem; /* 8px */
		padding-right: 0.5rem; /* 8px */
		outline: none;
		user-select: none;
		touch-action: none;
		overflow: clip;
		background-color: inherit;
	}
	.slc-table-td {
		position: relative;
		border-width: 0px;
		user-select: none;
		padding: 0px;
		padding-left: 0.5rem; /* 8px */
		padding-right: 0.5rem; /* 8px */
		outline: none;
		text-decoration: none;
		background-color: inherit;
	}
	.slc-table-tf {
		border-width: 0px;
		position: sticky;
		user-select: none;
		padding: 0px;
		padding-left: 0.5rem; /* 8px */
		padding-right: 0.5rem; /* 8px */
		outline: none;
		background-color: inherit;
	}
</style>
