<script lang="ts" generics="TData extends Row">
	import { t } from '#lib/app/localization/index.js';
	import type { Row, HeaderRowType, DataRowType, FooterRowType } from './types.js';
	import Pagination from './parts/Pagination.svelte';
	import PerPage from './parts/PerPage.svelte';
	import ColumnToggler from './parts/ColumnToggler.svelte';
	import TableSettings from './parts/TableSettings.svelte';
	import { createTableContext, type MainProps, type RangeInfo } from './context.svelte';
	import { getSelectedLang } from '#lib/app/localization/index.js';
	import { untrack } from 'svelte';
	import HeaderRow from './HeaderRow.svelte';
	import HeaderCell from './HeaderCell.svelte';
	import DataRow from './DataRow.svelte';
	import DataCell from './DataCell.svelte';
	import FooterRow from './FooterRow.svelte';
	import FooterCell from './FooterCell.svelte';

	// selected: seçili satır id'leri (bind:selected). Sayfa bağlamazsa yerel değer olarak yazılır.
	// range: seçili hücre aralığı ve özeti (bind:range, salt okunur: tablo yazar)
	let { selected = $bindable([]), range = $bindable(), ...props }: MainProps<TData> & { range?: RangeInfo } = $props();

	// svelte-ignore state_referenced_locally
	const context = createTableContext<TData>(props, {
		get selected() {
			return selected;
		},
		set selected(ids) {
			selected = ids;
		}
	}); // init

	// Parent kullanımı: tableRef?.helpers.setFreeze('freezeLeft', 2) | tableRef?.helpers.resetLayout()
	export const helpers = context.helpers;

	// "1–30 / 245" bilgisi
	const rangeFrom = $derived(context.totalItems === 0 ? 0 : (context.page - 1) * context.perPage + 1);
	const rangeTo = $derived(Math.min(context.page * context.perPage, context.totalItems));

	// Aralık → bind:range ve onRangeChange
	$effect(() => {
		const info = context.rangeInfo;
		untrack(() => {
			if (info === range) return;
			range = info;
			props.onRangeChange?.(info);
		});
	});

	// Alt bardaki aralık özeti: sayılar uygulamanın diline göre
	const formatNumber = (n: number) => new Intl.NumberFormat(getSelectedLang(), { maximumFractionDigits: 2 }).format(n);
	// Kısaldığında tam metin title'da
	const rangeSummary = $derived.by(() => {
		const info = context.rangeInfo;
		if (!info) return undefined;
		const parts = [t('dt_range_cells', { count: info.count })];
		if (info.numericCount > 0) parts.push(t('dt_range_sum', { sum: formatNumber(info.sum) }), t('dt_range_avg', { avg: formatNumber(info.average ?? 0) }));
		return parts.join(' · ');
	});

	// Sorgu var ama ilk veri henüz gelmedi (hata da yok): alt bar iskelet gösterir
	const barPending = $derived(!context.loaded && context.query !== undefined && context.query.error === undefined);

	// Parent kullanımı: {tableRef?.states.loading}
	export const states = {
		get loading() {
			return context.query?.loading ?? false;
		},
		get headerRowHeight() {
			return context.headerRowHeight;
		}
	};
</script>

<!-- Varsayılan satırlar: sayfada headerRow/dataRow/footerRow verilmezse kullanılır -->
{#snippet defaultHeaderRow(hr: HeaderRowType<TData>)}
	<HeaderRow {hr}>
		{#snippet headerCell(hc)}
			<HeaderCell {hr} {hc} />
		{/snippet}
	</HeaderRow>
{/snippet}

{#snippet defaultDataRow(dr: DataRowType<TData>)}
	<DataRow {dr}>
		{#snippet dataCell(dc)}
			{#if dc.col.data.type === 'actions'}
				<DataCell {dr} {dc}>
					<div class="flex h-full w-full items-center justify-center gap-1">{@render context.actions?.(dr.row)}</div>
				</DataCell>
			{:else}
				<DataCell {dr} {dc} />
			{/if}
		{/snippet}
	</DataRow>
{/snippet}

{#snippet defaultFooterRow(fr: FooterRowType<TData>)}
	<FooterRow {fr}>
		{#snippet footerCell(fc)}
			<FooterCell {fr} {fc} />
		{/snippet}
	</FooterRow>
{/snippet}

<!--
	Yerleşim:
	[toolbar]
	[tablo .................................................]
	[1–30 / 245 kayıt]      [‹ 1 2 3 … 9 ›]      [30 / sayfa ▾] [Kolonlar ▾] [⚙]
	[statusbar]
	Renkler tema değişkenlerinden gelir (bkz. <style> içindeki --dt-*); açık/koyu temada surface ölçeği kendiliğinden döner.
-->
<div class:slc-table-main={true} class={context.mainClass} data-borders={context.borders} style:width="100%" style:height="100%">
	{@render context.toolbar?.()}
	<div class:slc-table-container={true} class={context.containerClass}>
		{#if !context.query && context.list}
			<div class="slc-table-message"><p>{t('dt_not_loaded')}</p></div>
		{:else if context.query?.loading === true}
			<div class="slc-table-message slc-table-message-loading"><p>{t('loading')}</p></div>
		{:else if context.query?.error !== undefined}
			<div class="slc-table-message slc-table-message-error">
				<p>{context.query?.error.message ? t(context.query.error.message, undefined, context.query.error.message) : t('error_generic')}</p>
			</div>
		{:else if context.dataLength === 0}
			<div class="slc-table-message"><p>{t('dt_no_data')}</p></div>
		{/if}
		<div
			role="grid"
			class:slc-table={true}
			bind:this={context.el}
			bind:clientHeight={context.clientHeight}
			{@attach context.watchCurrentChanged}
			{@attach context.trackTableScroll}
			{@attach context.trackInteractions}
			class={context.tableClass}
			style:grid-template-rows={context.gridTemplateRows}
			style:grid-template-columns={context.gridTemplateColumns}
			style:scroll-padding-block-start="{context.scrollPadding.top}px"
			style:scroll-padding-block-end="{context.scrollPadding.bottom}px"
			style:scroll-padding-inline-start="{context.scrollPadding.left}px"
			style:scroll-padding-inline-end="{context.scrollPadding.right}px"
			tabindex="0"
			aria-activedescendant={context.activeCellId}
			aria-rowcount={context.headerLength + context.dataLength + context.footerLength}
			aria-colcount={context.visibleColumns.length}
		>
			{#if context.headerLength > 0}
				{@render (context.headerRow ?? defaultHeaderRow)({ headerIndex: 0 })}
			{/if}

			{#if context.dataLength > 0}
				{#each context.virtualData as row, virtualIndex (row.data.id)}
					{@render (context.dataRow ?? defaultDataRow)({
						row: row.data,
						rowVirtualIndex: virtualIndex,
						rowOriginalIndex: row.originalIndex
					})}
				{/each}
			{/if}

			{#if context.dataLength > 0 && context.footerLength > 0}
				{#each context.footers as row, footerIndex (footerIndex)}
					{@render (context.footerRow ?? defaultFooterRow)({
						footerRow: row,
						footerIndex
					})}
				{/each}
			{/if}
		</div>
	</div>

	<!-- İlk veri gelene kadar iskelet: kontroller hep birlikte gelir, yükseklik değişmez (kontroller 2rem, bkz. min-height) -->
	{#if barPending}
		<div class="slc-table-bar" aria-busy="true" aria-label={t('loading')}>
			<div class="slc-table-bar-start"><span class="slc-table-skeleton" style:width="7.5rem" style:height="1rem"></span></div>
			<div class="slc-table-bar-center"><span class="slc-table-skeleton" style:width="16rem"></span></div>
			<div class="slc-table-bar-end">
				<!-- sayfa başına, kolonlar, ayarlar -->
				<span class="slc-table-skeleton" style:width="6.5rem"></span>
				<span class="slc-table-skeleton" style:width="7.25rem"></span>
				<span class="slc-table-skeleton" style:width="2.25rem"></span>
			</div>
		</div>
	{:else}
		<div class="slc-table-bar">
			<div class="slc-table-bar-start">
				{#if context.paginable}
					<span class="slc-table-range">{t('dt_range', { from: rangeFrom, to: rangeTo, total: context.totalItems })}</span>
				{/if}
				{#if context.rangeInfo}
					{@const info = context.rangeInfo}
					<!-- Bar genişliğine katılmaz (absolute): aralık seçilince bar kaymaz, sığmazsa … ile kısalır -->
					<span class="slc-table-range-info-wrap">
						<span class="slc-table-range-info" aria-live="polite" title={rangeSummary}>
							{t('dt_range_cells', { count: info.count })}
							{#if info.numericCount > 0}
								· {t('dt_range_sum', { sum: formatNumber(info.sum) })} · {t('dt_range_avg', { avg: formatNumber(info.average ?? 0) })}
							{/if}
						</span>
					</span>
				{/if}
				{#if context.selection.mode === 'multiple' && context.selection.count > 0}
					<span class="slc-table-selected">{t('dt_selected', { count: context.selection.count })}</span>
					<button type="button" class="slc-table-clear" onclick={context.selection.clear}>{t('dt_clear_selection')}</button>
				{/if}
			</div>
			<div class="slc-table-bar-center">
				{#if context.paginable && context.totalPages > 1}
					<Pagination
						page={context.page}
						perPage={context.perPage}
						totalPages={context.totalPages}
						disabled={context.busy}
						onChange={(data) => context.onPagination?.(data)}
					/>
				{/if}
			</div>
			<div class="slc-table-bar-end">
				{#if context.paginable}
					<PerPage perPage={context.perPage} disabled={context.busy} onChange={(perPage) => context.onPagination?.({ page: 1, perPage })} />
				{/if}
				<ColumnToggler />
				{#if context.settings}
					<TableSettings />
				{/if}
			</div>
		</div>
	{/if}

	{@render context.statusbar?.()}
</div>

<style>
	/* ---------------------------------------------------------------------------
	   Tema: tablonun tüm renkleri buradan gelir. Alt bileşenler (HeaderCell, DataCell...)
	   yalnızca bu değişkenleri kullanır. Sayfa düzeyinde ezmek için (iç adlar --_dt-*, dış adlar --dt-*):
	   <dt.DataTable --dt-header-bg="var(--color-primary-100)" ... />
	--------------------------------------------------------------------------- */
	.slc-table-main {
		--_dt-bg: var(--dt-bg, var(--color-surface-50));
		--_dt-text: var(--dt-text, var(--color-surface-900));
		--_dt-muted: var(--dt-muted, var(--color-surface-500));
		--_dt-header-bg: var(--dt-header-bg, var(--color-surface-200));
		--_dt-bar-bg: var(--dt-bar-bg, var(--color-surface-100));
		--_dt-header-text: var(--dt-header-text, var(--color-surface-700));
		--_dt-header-hover: var(--dt-header-hover, var(--color-surface-300));
		--_dt-row-hover: var(--dt-row-hover, color-mix(in srgb, var(--color-primary-500) 7%, var(--_dt-bg)));
		--_dt-row-selected: var(--dt-row-selected, color-mix(in srgb, var(--color-primary-500) 15%, var(--_dt-bg)));
		--_dt-range: var(--dt-range, color-mix(in srgb, var(--color-primary-500) 26%, var(--_dt-bg)));
		--_dt-border: var(--dt-border, var(--color-surface-200));
		--_dt-border-strong: var(--dt-border-strong, var(--color-surface-300));
		/* freeze sınırı: koyu temada gölge görünmediği için ayrımı 2px çizgi sağlar */
		--_dt-freeze-line: 2px solid var(--dt-freeze-border, var(--color-surface-400));
		--_dt-accent: var(--dt-accent, var(--color-primary-500));
		/* gölge: surface ölçeği koyu temada döndüğü için siyah üzerinden */
		--_dt-shadow: var(--dt-shadow, color-mix(in srgb, black 18%, transparent));
		--_dt-freeze-shadow-left: 6px 0 8px -4px var(--_dt-shadow);
		--_dt-freeze-shadow-right: -6px 0 8px -4px var(--_dt-shadow);
		/* hücre çizgileri: borders prop'una göre (aşağıdaki [data-borders] kuralları) */
		--_dt-line: 1px solid var(--_dt-border);
		--_dt-row-line: var(--_dt-line);
		--_dt-col-line: none;

		display: flex;
		flex-direction: column;
		overflow: hidden;
		contain: inline-size;
		color: var(--_dt-text);
		background-color: var(--_dt-bg);
		font-size: 0.875rem; /* 14px */
	}
	.slc-table-main[data-borders='none'] {
		--_dt-row-line: none;
	}
	.slc-table-main[data-borders='vertical'] {
		--_dt-row-line: none;
		--_dt-col-line: var(--_dt-line);
	}
	.slc-table-main[data-borders='both'] {
		--_dt-col-line: var(--_dt-line);
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
		background-color: var(--_dt-bg);
	}
	/* Odak grid'de; görünür odak aktif hücrenin çerçevesi (DataCell). Aktif hücre yokken grid'in kendisi çerçevelenir. */
	.slc-table:focus {
		outline: none;
	}
	.slc-table:focus-visible:not([aria-activedescendant]) {
		outline: 2px solid var(--_dt-accent);
		outline-offset: -2px;
	}
	.slc-table:before {
		content: '';
		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}
	/******************************************************/
	.slc-table-message {
		display: flex;
		position: absolute;
		inset: 0;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		z-index: 5;
		color: var(--_dt-muted);
	}
	/* Kart: koyu temada gölge görünmediği için kenarlık + başlık rengi ile ayrışır */
	.slc-table-message p {
		padding: 0.5rem 1rem;
		border: 1px solid var(--_dt-border-strong);
		border-radius: 0.5rem;
		background-color: var(--_dt-header-bg);
		color: var(--_dt-header-text);
		box-shadow: 0 4px 14px -4px var(--_dt-shadow);
	}
	/* Yüklenirken eski veri soluk görünür, mesaj üstte durur */
	.slc-table-message-loading {
		background-color: color-mix(in srgb, var(--_dt-bg) 55%, transparent);
	}
	.slc-table-message-error p {
		border-color: var(--color-error-400);
		color: var(--color-error-600);
	}
	/******************************************************/
	.slc-table-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.75rem;
		border-top: 1px solid var(--_dt-border);
		background-color: var(--_dt-bar-bg);
	}
	.slc-table-bar > div {
		min-height: 2rem; /* kontrol yüksekliği: iskelet ↔ kontroller geçişinde bar zıplamaz */
	}
	.slc-table-skeleton {
		display: inline-block;
		height: 2rem;
		border-radius: 0.375rem;
		background-color: var(--_dt-header-bg);
		animation: slc-table-pulse 1.2s ease-in-out infinite;
	}
	@keyframes slc-table-pulse {
		50% {
			opacity: 0.45;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.slc-table-skeleton {
			animation: none;
		}
	}
	.slc-table-bar-start,
	.slc-table-bar-end {
		display: flex;
		flex: 1 1 0%;
		align-items: center;
		gap: 0.5rem;
		min-width: max-content;
	}
	.slc-table-bar-end {
		justify-content: flex-end;
	}
	.slc-table-bar-center {
		display: flex;
		justify-content: center;
	}
	.slc-table-range {
		color: var(--_dt-muted);
		white-space: nowrap;
	}
	/* Satır üzerine gelince tüm hücreler (sticky olanlar dahil) vurgulanır */
	:global(.slc-table [data-slc-table-datarow]:hover [data-slc-table-datacell]) {
		background-color: var(--_dt-row-hover) !important;
	}
	/* Seçili satır: sticky hücreler altını örtmeye devam etsin diye opak karışım */
	:global(.slc-table [data-slc-table-datacell][data-selected]) {
		background-color: var(--_dt-row-selected) !important;
	}
	:global(.slc-table [data-slc-table-datarow]:hover [data-slc-table-datacell][data-selected]:not([data-in-range])) {
		background-color: color-mix(in srgb, var(--_dt-accent) 22%, var(--_dt-bg)) !important;
	}
	/* Hücre aralığı (Shift/sürükleme): seçili satır ve hover'ın üzerinde (aynı özgüllük, sonra tanımlı) */
	:global(.slc-table [data-slc-table-datarow] [data-slc-table-datacell][data-in-range]) {
		background-color: var(--_dt-range) !important;
	}
	.slc-table-range-info-wrap {
		position: relative;
		flex: 1 1 0%;
		min-width: 0;
		align-self: stretch;
	}
	.slc-table-range-info {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		color: var(--_dt-text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-variant-numeric: tabular-nums;
	}
	.slc-table-selected {
		font-weight: 600;
		color: var(--_dt-accent);
		white-space: nowrap;
	}
	.slc-table-clear {
		color: var(--_dt-muted);
		text-decoration: underline;
		cursor: pointer;
	}
	.slc-table-clear:hover {
		color: var(--_dt-text);
	}
</style>
