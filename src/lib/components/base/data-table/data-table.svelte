<script lang="ts" generics="TData extends Row">
	import { getTable, type Sources, type Row } from './tables.svelte';
	const { sources: src }: { sources: Sources<TData> } = $props();
	const table = getTable<TData>(src.id);
</script>

<div class:slc-table-main={true} style:width={table.get.width} style:height={table.get.height}>
	<div class:slc-table-container={true}>
		<!-- TABLE -->
		<div {...table.attr} bind:this={table.element} use:table.tableVirtualScrollAction>
			<!-- TRH -->
			<div {...table.attr_trh}>
				{#each table.visibleColumns as colWrapper, ci (colWrapper.coi)}
					{@const col = colWrapper.data}
					{@const ariaColIndex = ci + 1}
					<!-- TH -->
					<div {...table.attr_th} aria-colindex={ariaColIndex}>
						{col.label}
					</div>
				{/each}
			</div>

			{#each table.virtualData as rowWrapper, ri (rowWrapper.roi)}
				{@const row = rowWrapper.data}
				{@const roi = rowWrapper.roi}
				{@const ariaRowIndex = roi + table.headerRowsCount + 1}
				<!-- TRD -->
				<div {...table.attr_trd} aria-rowindex={ariaRowIndex}>
					{#each table.visibleColumns as colWrapper, ci (colWrapper.coi)}
						{@const col = colWrapper.data}
						{@const originalCell = { rowIndex: roi, colIndex: ci }}
						{@const focusedCellState = table.focusedCellState}
						{@const isCellFocused = focusedCellState?.originalCell === `${originalCell.rowIndex}_${originalCell.colIndex}`}
						{@const tabindex = isCellFocused && focusedCellState?.tabIndex != null ? focusedCellState?.tabIndex : -1}
						{@const ariaColIndex = ci + 1}
						<!-- TD -->
						<div
							{...table.attr_td}
							role="gridcell"
							use:table.tdFocusAction={originalCell}
							class:slc-table-td-focused={isCellFocused}
							style:grid-row-start={ariaRowIndex}
							aria-colindex={ariaColIndex}
							{tabindex}
						>
							{row[col.field]}
						</div>
					{/each}
				</div>
			{/each}

			{#if table.get.data.length > 0 && table.get.footers.length > 0}
				{#each table.get.footers as foot, footerindex (footerindex)}
					{@const ariaRowIndex = table.get.data.length + table.headerRowsCount + footerindex + 1}
					<!-- TRF -->
					<div {...table.attr_trf} aria-rowindex={ariaRowIndex}>
						{#each table.visibleColumns as colWrapper, ci (colWrapper.coi)}
							{@const col = colWrapper.data}
							{@const ariaColIndex = ci + 1}
							{@const bottom = `${(table.get.footers.length - footerindex - 1) * table.get.tfootRowHeight}px`}
							<!-- TF -->
							<div {...table.attr_tf} style:bottom style:grid-row-start={ariaRowIndex} aria-colindex={ariaColIndex}>
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
	/* ################################ */
	.slc-table-td-focused {
		outline-width: 2px;
		outline-offset: -3px;
		outline-style: solid;
		outline-color: hsl(var(--secondary-800));
	}
</style>
