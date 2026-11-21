<script lang="ts" module>
	import { t } from '#lib/app/localization/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, HeaderRowType, HeaderCellType } from './types.js';
	import { getTableContext } from './context.svelte.js';
	import { on } from 'svelte/events';
	import { Icon } from '#lib/components/icons/index.js';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet; // verilmezse t(label) gösterilir
		class?: string;
		hr: HeaderRowType<TData>;
		hc: HeaderCellType<TData>;
	};
	const { children, class: classes, hr, hc, ...attributes }: Props = $props();

	const context = getTableContext<TData>();

	const gridRowStart = 1;
	const col = $derived(hc.col);
	const field = $derived(col.data.field as string);
	const label = $derived(col.data.label ?? field);
	const layout = $derived(context.columnLayout[hc.colVisibleIndex]);

	const isSortable = $derived(col.data.sortable !== false);
	const sortDir = $derived(context.getColumnSortDirection(col.data.field));

	const sortableAttach = (node: HTMLElement) => {
		const destroyClick = on(node, 'click', (e: MouseEvent) => {
			e.preventDefault();
			context.toggleSort(col.data.field);
		});
		const destroyKeydown = on(node, 'keydown', (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				context.toggleSort(col.data.field);
			}
		});
		return () => {
			destroyClick();
			destroyKeydown();
		};
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class:slc-table-headercell={true}
	class:slc-table-freeze-left={layout?.freezeLeft}
	class:slc-table-freeze-right={layout?.freezeRight}
	class:slc-table-freeze-left-boundary={layout?.boundaryLeft}
	class:slc-table-freeze-right-boundary={layout?.boundaryRight}
	class:slc-table-headercell-resizing={context.resizingField === field}
	class:slc-table-headercell-sortable={isSortable}
	role="columnheader"
	aria-sort={!isSortable ? undefined : sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'}
	data-coi={col.originalIndex}
	data-align={layout?.textAlignHeader}
	data-header-index={hr.headerIndex}
	style:position="sticky"
	style:top="0"
	style:left={layout?.left}
	style:right={layout?.right}
	style:z-index={layout?.sticky ? 3 : 2}
	style:grid-row-start={gridRowStart}
	style:grid-column={layout?.gridColumn}
	class={classes}
	{@attach isSortable && sortableAttach}
	{@attach context.measureColumn(field)}
	tabindex={isSortable ? 0 : undefined}
	{...attributes}
>
	<div class="slc-table-header-content" style:text-align={layout?.textAlignHeader}>
		{#if children}
			{@render children()}
		{:else}
			{t(label, undefined, label)}
		{/if}
	</div>

	{#if isSortable}
		<span class="slc-table-sort-icon" class:active={sortDir !== undefined} aria-hidden="true">
			<Icon name={sortDir === 'asc' ? 'sort_asc' : sortDir === 'desc' ? 'sort_desc' : 'sort_none'} size={sortDir ? 15 : 13} />
		</span>
	{/if}

	{#if col.data.resizeable !== false}
		<div
			class="slc-table-resizer"
			onclick={(e) => e.stopPropagation()}
			{@attach context.colResizeAttach(col.originalIndex)}
			role="separator"
			aria-label={t('dt_resize_column')}
		></div>
	{/if}
</div>

<style>
	.slc-table-headercell {
		position: relative;
		display: flex;
		align-items: center;
		padding: 8px 12px;
		font-weight: 600;
		color: var(--_dt-header-text);
		background-color: var(--_dt-header-bg);
		border-bottom: 1px solid var(--_dt-border-strong);
		border-right: var(--_dt-col-line);
		user-select: none;
		box-sizing: border-box;
	}
	.slc-table-headercell-sortable {
		cursor: pointer;
	}
	.slc-table-headercell-sortable:hover {
		background-color: var(--_dt-header-hover);
	}
	.slc-table-headercell-sortable:focus-visible {
		outline: 2px solid var(--_dt-accent);
		outline-offset: -2px;
	}
	.slc-table-header-content {
		flex: 1 1 0%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* Sıralama ikonu başlık metninin hizasını bozmamalı: metin kolonun içeriğiyle aynı kenarda durur.
	   sol: ikon sağ uçta | sağ: ikon sol uçta (row-reverse) | orta: ikon absolute, metin gerçekten ortada */
	.slc-table-sort-icon {
		flex: none;
		margin-left: 6px;
		color: var(--_dt-muted);
		opacity: 0.35; /* sıralanmamış: soluk; başlığın üzerine gelince belirginleşir */
		transition: opacity 0.15s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		user-select: none;
	}
	.slc-table-headercell-sortable:hover .slc-table-sort-icon {
		opacity: 0.8;
	}
	.slc-table-headercell[data-align='right'] {
		flex-direction: row-reverse;
	}
	.slc-table-headercell[data-align='right'] .slc-table-sort-icon {
		margin-left: 0;
		margin-right: 6px;
	}
	.slc-table-headercell-sortable[data-align='center'] {
		padding-inline: 32px; /* iki yanda eşit boşluk: ikon metni kaydırmaz */
	}
	.slc-table-headercell[data-align='center'] .slc-table-sort-icon {
		position: absolute;
		right: 12px;
		margin-left: 0;
	}
	.slc-table-sort-icon.active {
		color: var(--_dt-accent);
		opacity: 1;
	}
	/* Tutma alanı geniş (8px), görünen çubuk ince ve yuvarlak uçlu; üst/alt/sağdan 2px boşluklu.
	   Başlığın üzerine gelince soluk görünür, çubuğun üzerine gelince / sürüklerken vurgu rengi alır. */
	.slc-table-resizer {
		position: absolute;
		top: 0;
		right: 0;
		width: 8px;
		height: 100%;
		cursor: col-resize;
		user-select: none;
		touch-action: none;
		z-index: 10;
	}
	.slc-table-resizer::after {
		content: '';
		position: absolute;
		top: 2px;
		bottom: 2px;
		right: 2px;
		width: 4px;
		border-radius: 9999px;
		background-color: var(--_dt-muted); /* sıralanabilir başlığın hover zemininde de seçilir */
		opacity: 0;
		transition:
			opacity 0.15s,
			background-color 0.15s;
	}
	.slc-table-headercell:hover .slc-table-resizer::after {
		opacity: 0.6;
	}
	.slc-table-resizer:hover::after,
	.slc-table-headercell-resizing .slc-table-resizer::after {
		opacity: 1;
		background-color: var(--_dt-accent);
	}
	.slc-table-freeze-left-boundary {
		box-shadow: var(--_dt-freeze-shadow-left);
		border-right: var(--_dt-freeze-line);
	}
	.slc-table-freeze-right-boundary {
		box-shadow: var(--_dt-freeze-shadow-right);
		border-left: var(--_dt-freeze-line);
	}
</style>
