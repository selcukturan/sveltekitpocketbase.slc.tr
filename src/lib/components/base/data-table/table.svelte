<script lang="ts" generics="TData extends Row">
	import type { Sources, Row, Column, Footer } from './types';
	import { getTable } from './tables.svelte';
	import { fly } from 'svelte/transition';

	let { sources }: { sources: Sources<TData> } = $props();
	const t = getTable<TData>(sources.id);
	// $inspect('$inspect-selectedRows', t.selectedRows);
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
						{@render selectionContent({ type: 'header' })}
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
						{@render actionContent({ type: 'header', roi: -1 })}
					</div>
				{/if}
			</div>
			<!-- ########## DATA ########## -->
			{#each t.virtualData as rowWrapper, ri (rowWrapper.roi)}
				{@const row = rowWrapper.data}
				{@const roi = rowWrapper.roi}
				{@const rowStart = roi + t.headerRowsCountState + 1}
				{@const checked = t.selectedRows.has(roi)}
				<!-- ********** TRD ********** -->
				<div {...t.attr_trd} class:slc-table-trd-selected={checked}>
					{#if t.srcRowSelection !== 'none'}
						{@const originalCell = { rowIndex: roi, colIndex: -1 }}
						{@const isCellFocused = t.focusedCellState?.originalCell === `${originalCell.rowIndex}_${originalCell.colIndex}`}
						{@const tabindex = isCellFocused && t.focusedCellState?.tabIndex != null ? t.focusedCellState?.tabIndex : -1}
						<!-- TD selection -->
						<div {...t.attr_td_selection} role="gridcell" use:t.tdFocusAction={originalCell} class:slc-table-td-focused={isCellFocused} style:grid-row-start={rowStart} {tabindex}>
							{@render selectionContent({ type: 'data', checked, roi })}
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
							{@render actionContent({ type: 'data', roi })}
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
								{@render selectionContent({ type: 'footer' })}
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
								{@render actionContent({ type: 'footer' })}
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

{#snippet selectionContent({ type, checked, roi }: { type: 'header' | 'footer' | 'data'; checked?: boolean; roi?: number })}
	<div style="display: flex; height: 100%; width: 100%; justify-content: space-between;">
		<div style="display: none; align-items: center;">x</div>
		<div style="display: flex; min-width: 0px; flex: 1 1 0%; align-items: center; justify-content: center;">
			<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
				{#if type === 'header' && t.srcRowSelection === 'multiple'}
					<input
						aria-label="Select All"
						bind:this={t.headerCheckbox}
						tabindex="-1"
						type="checkbox"
						class="slc-table-selection-checkbox"
						use:t.selectAction={{ type }}
						checked={t.headerIsIndeterminate ? false : t.headerIsChecked}
					/>
				{:else if type === 'data' && roi != null}
					<input aria-label="Select" class="slc-table-selection-checkbox" tabindex="-1" type="checkbox" use:t.selectAction={{ type, roi }} {checked} />
				{:else if type === 'footer'}
					{@html ``}
				{:else}
					{@html ``}
				{/if}
			</span>
		</div>
		<div style="display: none; align-items: center;">x</div>
	</div>
{/snippet}

{#snippet actionContent({ type, roi }: { type: 'header' | 'footer' | 'data'; roi?: number })}
	<div style="display: flex; height: 100%; width: 100%; justify-content: space-between;">
		<div style="display: none; align-items: center;">x</div>
		<div style="display: flex; min-width: 0px; flex: 1 1 0%; align-items: center; justify-content: center;">
			<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
				{#if type === 'header' && t.srcActions.tableActions != null && t.srcActions.tableActions.length > 0 && roi != null}
					<div class="slc-table-th-action-container" tabindex="-1">
						<button class="slc-table-th-action-trigger" use:t.actionAction={{ type, roi }} type="button" tabindex="-1">
							<span>
								{@html `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`}
							</span>
						</button>
						{#if t.actionActiveRowIndex === roi}
							<div class="slc-table-th-action-popup" transition:fly={{ y: 0, duration: 150 }}>
								<div style:display="grid" role="menu">
									{#each t.srcActions.tableActions as item}
										<button
											class="slc-table-th-action-popup-item"
											data-action={item.action}
											type="button"
											onclick={() => t.handleItemClick({ type: 'table', rowIndex: roi, action: item.action })}
											role="menuitem"
											tabindex="-1"
										>
											<span>{item.label + ' - ' + roi}</span>
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{:else if type === 'data' && t.srcActions.rowActions != null && t.srcActions.rowActions.length > 0 && roi != null}
					<div class="slc-table-td-action-container" tabindex="-1">
						<button class="slc-table-td-action-trigger" use:t.actionAction={{ type, roi }} type="button" tabindex="-1">
							<span>
								{@html `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`}
							</span>
						</button>
						{#if t.actionActiveRowIndex === roi}
							<div class="slc-table-td-action-popup" transition:fly={{ y: 0, duration: 150 }}>
								<div style:display="grid" role="menu">
									{#each t.srcActions.rowActions as item}
										<button
											class="slc-table-td-action-popup-item"
											data-action={item.action}
											type="button"
											onclick={() => t.handleItemClick({ type: 'row', rowIndex: roi, action: item.action })}
											role="menuitem"
											tabindex="-1"
										>
											<span>{item.label + ' - ' + roi}</span>
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{:else}
					{@html ``}
				{/if}
			</span>
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
	.slc-table-trd:hover {
		background-color: color-mix(in srgb, hsl(var(--surface-200)) 70%, hsl(var(--surface-50)) 30%);
	}
	.slc-table-trd-selected {
		background-color: hsl(var(--primary-200)) !important;
	}
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
		/* overflow: clip; */
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
	.slc-table-selection-checkbox {
		display: block;
		margin: auto;
		inline-size: 16px;
		block-size: 16px;
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
	/******************************************************/
	.slc-table-th-action-trigger,
	.slc-table-td-action-trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		border-radius: 9999px;
		padding: 4px;
		margin: 0;
		outline: none;
		cursor: pointer;
		background-color: hsl(var(--surface-200));
	}
	/* [data-scope='th-action'][data-part='trigger']:focus-visible,
	[data-scope='td-action'][data-part='trigger']:focus-visible {
		background-color: hsl(var(--surface-400));
	} */
	.slc-table-th-action-trigger:hover,
	.slc-table-td-action-trigger:hover {
		background-color: hsl(var(--surface-300));
	}
	.slc-table-th-action-popup,
	.slc-table-td-action-popup {
		display: block;
		position: absolute;
		/* z-index: 1; */
		cursor: default;
		width: auto;
		min-width: 140px;
		max-width: 450px;
		max-height: 330px;
		overflow-x: hidden;
		overflow-y: auto;
		border-radius: 4px;
		/* position */
		top: 0;
		right: 100%;
		bottom: auto;
		left: auto;
		border: 1px solid hsl(var(--surface-400));
		/* background-color: hsl(var(--surface-50)); */
		margin-right: 5px;
		/* margin-top: -1px; */
	}
	.slc-table-th-action-popup-item,
	.slc-table-td-action-popup-item {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0.5rem 1rem;
		border: none;
		cursor: pointer;
		background-color: hsl(var(--surface-200));
	}
	/* .slc-table-th-action-popup-item[data-action='delete_all'] {
		background-color: hsl(var(--secondary-100));
	} */
	.slc-table-th-action-popup-item:hover,
	.slc-table-td-action-popup-item:hover {
		background-color: hsl(var(--surface-100));
	}
	.slc-table-th-action-popup-item:active,
	.slc-table-td-action-popup-item:active {
		background-color: hsl(var(--surface-300));
	}
</style>
