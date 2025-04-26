<script lang="ts" generics="TData extends Row">
	import { getTable, type Sources, type Row, type Column, type Footer } from './tables.svelte';
	let { sources }: { sources: Sources<TData> } = $props();
	const t = getTable<TData>(sources.id);
</script>

<!-- ############################################################ DATA TABLE ############################################################ -->
<div {...t.attr_main}>
	<div {...t.attr_container}>
		<!-- TABLE -->
		<div {...t.attr} bind:this={t.element} use:t.virtualScrollAction>
			<!-- ########## HEADER ########## -->
			<!-- ********** TRH ************* -->
			<div {...t.attr_trh}>
				{#if t.srcRowSelection !== 'none'}
					<!-- TH selection -->
					<div {...t.attr_th_selection}>
						{@render selectionContent()}
					</div>
				{/if}
				{#each t.visibleColumns as colWrapper, ci (colWrapper.coi)}
					{@const col = colWrapper.data}
					{@const coi = colWrapper.coi}
					<!-- TH -->
					<div {...t.attr_th} data-coi={coi}>
						{@render baseContent({ type: 'header', col, coi })}
					</div>
				{/each}
				{#if t.srcRowAction}
					<!-- TH action -->
					<div {...t.attr_th_action}>
						{@render actionContent()}
					</div>
				{/if}
			</div>
			<!-- ########## DATA ########## -->
			{#each t.virtualData as rowWrapper, ri (rowWrapper.roi)}
				{@const row = rowWrapper.data}
				{@const roi = rowWrapper.roi}
				{@const rowStart = roi + t.headerRowsCountState + 1}
				<!-- ********** TRD ********** -->
				<div {...t.attr_trd}>
					{#if t.srcRowSelection !== 'none'}
						{@const originalCell = { rowIndex: roi, colIndex: -1 }}
						{@const isCellFocused = t.focusedCellState?.originalCell === `${originalCell.rowIndex}_${originalCell.colIndex}`}
						{@const tabindex = isCellFocused && t.focusedCellState?.tabIndex != null ? t.focusedCellState?.tabIndex : -1}
						<!-- TD selection -->
						<div {...t.attr_td_selection} role="gridcell" use:t.tdFocusAction={originalCell} class:slc-table-td-focused={isCellFocused} style:grid-row-start={rowStart} {tabindex}>
							{@render selectionContent()}
						</div>
					{/if}
					{#each t.visibleColumns as colWrapper, ci (colWrapper.coi)}
						{@const col = colWrapper.data}
						{@const coi = colWrapper.coi}
						{@const originalCell = { rowIndex: roi, colIndex: ci }}
						{@const isCellFocused = t.focusedCellState?.originalCell === `${originalCell.rowIndex}_${originalCell.colIndex}`}
						{@const tabindex = isCellFocused && t.focusedCellState?.tabIndex != null ? t.focusedCellState?.tabIndex : -1}
						<!-- TD -->
						<div {...t.attr_td} role="gridcell" use:t.tdFocusAction={originalCell} class:slc-table-td-focused={isCellFocused} style:grid-row-start={rowStart} {tabindex}>
							{@render baseContent({ type: 'data', row, col, coi })}
						</div>
					{/each}
					{#if t.srcRowAction}
						{@const originalCell = { rowIndex: roi, colIndex: t.visibleColumns.length }}
						{@const isCellFocused = t.focusedCellState?.originalCell === `${originalCell.rowIndex}_${originalCell.colIndex}`}
						{@const tabindex = isCellFocused && t.focusedCellState?.tabIndex != null ? t.focusedCellState?.tabIndex : -1}
						<!-- TD action -->
						<div {...t.attr_td_action} role="gridcell" use:t.tdFocusAction={originalCell} class:slc-table-td-focused={isCellFocused} style:grid-row-start={rowStart} {tabindex}>
							{@render actionContent()}
						</div>
					{/if}
				</div>
			{/each}
			<!-- ########## FOOTER ########## -->
			{#if t.srcData.length > 0 && t.srcFooters.length > 0}
				{#each t.srcFooters as foot, footerindex (footerindex)}
					{@const rowStart = t.srcData.length + t.headerRowsCountState + footerindex + 1}
					{@const bottom = `${(t.srcFooters.length - footerindex - 1) * t.srcTfootRowHeight}px`}
					<!-- ********** TRF ********** -->
					<div {...t.attr_trf}>
						{#if t.srcRowSelection !== 'none'}
							<!-- TF selection -->
							<div {...t.attr_tf_selection} style:bottom style:grid-row-start={rowStart}>
								{@render selectionContent()}
							</div>
						{/if}
						{#each t.visibleColumns as colWrapper, ci (colWrapper.coi)}
							{@const col = colWrapper.data}
							{@const coi = colWrapper.coi}
							<!-- TF -->
							<div {...t.attr_tf} style:bottom style:grid-row-start={rowStart}>
								{@render baseContent({ type: 'footer', foot, col, coi })}
							</div>
						{/each}
						{#if t.srcRowAction}
							<!-- TF action -->
							<div {...t.attr_tf_action} style:bottom style:grid-row-start={rowStart}>
								{@render actionContent()}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>

<!-- ############################################################ SNIPPETS ############################################################ -->
{#snippet baseContent({ type, row, roi, col, coi, foot }: { type: 'header' | 'footer' | 'data'; row?: TData; roi?: number; col: Column<TData>; coi: number; foot?: Footer<TData> })}
	<div style="display: flex; height: 100%; width: 100%; justify-content: space-between;">
		<div style="display: none; align-items: center;">x</div>
		<div
			style="display: flex; min-width: 0px; flex: 1 1 0%; align-items: center;"
			style:justify-content={type === 'header' && col.alignHeader
				? col.alignHeader === 'center'
					? 'center'
					: col.alignHeader === 'right'
						? 'flex-end'
						: 'flex-start'
				: type === 'footer' && col.alignFooter
					? col?.alignFooter === 'center'
						? 'center'
						: col.alignFooter === 'right'
							? 'flex-end'
							: 'flex-start'
					: col.align
						? col.align === 'center'
							? 'center'
							: col.align === 'right'
								? 'flex-end'
								: 'flex-start'
						: 'flex-start'}
		>
			<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
				{#if type === 'header' && col.label}
					{col.label}
				{:else if type === 'data' && row}
					{row[col.field]}
				{:else if type === 'footer' && foot}
					{foot[col.field]}
				{:else}
					{'x'}
				{/if}
			</span>
		</div>
		<div style="display: none; align-items: center;">x</div>
	</div>
	{#if type === 'header' && col.resizeable}
		<div {...t.attr_th_resize} use:t.colResizePointerAction={(e) => t.colResizeUpdate(e, coi)}></div>
	{/if}
{/snippet}

{#snippet selectionContent()}
	<div style="display: flex; height: 100%; width: 100%; justify-content: space-between;">
		<div style="display: none; align-items: center;">x</div>
		<div style="display: flex; min-width: 0px; flex: 1 1 0%; align-items: center; justify-content: center;">
			<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"> s </span>
		</div>
		<div style="display: none; align-items: center;">x</div>
	</div>
{/snippet}

{#snippet actionContent()}
	<div style="display: flex; height: 100%; width: 100%; justify-content: space-between;">
		<div style="display: none; align-items: center;">x</div>
		<div style="display: flex; min-width: 0px; flex: 1 1 0%; align-items: center; justify-content: center;">
			<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"> a </span>
		</div>
		<div style="display: none; align-items: center;">x</div>
	</div>
{/snippet}

<!-- ############################################################ STYLE ############################################################ -->
<style>
	/******************************************************/
	.slc-table-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		/* contain: inline-size; */
	}
	.slc-table-container {
		flex: 1 1 0%;
		overflow: hidden;
		/* contain: inline-size; */
	}
	/******************************************************/
	.slc-table {
		display: grid;
		width: 100%;
		height: 100%;
		contain: strict;
		/* content-visibility: auto; */
		box-sizing: border-box;
		overflow: auto;
		overscroll-behavior: none;
		background-color: hsl(var(--surface-50));
	}
	/******************************************************/
	.slc-table-trh {
		outline: none;
		background-color: hsl(var(--surface-100));
	}
	.slc-table-trd {
		outline: none;
		background-color: hsl(var(--surface-50));
	}
	.slc-table-trf {
		outline: none;
		background-color: hsl(var(--surface-100));
	}
	/******************************************************/
	/* .slc-table-trd:hover {
		background-color: color-mix(in srgb, hsl(var(--surface-200)) 70%, hsl(var(--surface-50)) 30%);
	} */
	/******************************************************/
	.slc-table-th {
		border-color: hsl(var(--surface-200));
		border-right-width: 1px;
		border-bottom-width: 1px;
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
		border-color: hsl(var(--surface-200));
		border-right-width: 1px;
		border-bottom-width: 1px;
		user-select: none;
		padding: 0px;
		padding-left: 0.5rem; /* 8px */
		padding-right: 0.5rem; /* 8px */
		outline: none;
		text-decoration: none;
		background-color: inherit;
	}
	.slc-table-tf {
		border-color: hsl(var(--surface-200));
		border-right-width: 1px;
		border-top-width: 1px;
		position: sticky;
		user-select: none;
		padding: 0px;
		padding-left: 0.5rem; /* 8px */
		padding-right: 0.5rem; /* 8px */
		outline: none;
		background-color: inherit;
	}
	/******************************************************/
	.slc-table-td-focused {
		outline-width: 2px;
		outline-offset: -2px;
		outline-style: solid;
		outline-color: hsl(var(--secondary-800));
	}
	/******************************************************/
	.slc-table-th-selection {
		z-index: 3;
		/* position: sticky; */
		left: 0px;
		border-right-width: 5px;
	}
	.slc-table-td-selection {
		z-index: 1;
		position: sticky;
		left: 0px;
		border-right-width: 5px;
	}
	.slc-table-tf-selection {
		z-index: 1;
		/* position: sticky; */
		left: 0px;
		border-right-width: 5px;
	}
	/******************************************************/
	.slc-table-th-action {
		z-index: 3;
		/* position: sticky; */
		right: 0px;
		border-left-width: 5px;
	}
	.slc-table-td-action {
		z-index: 1;
		position: sticky;
		right: 0px;
		border-left-width: 5px;
	}
	.slc-table-tf-action {
		z-index: 1;
		/* position: sticky; */
		right: 0px;
		border-left-width: 5px;
	}
</style>
