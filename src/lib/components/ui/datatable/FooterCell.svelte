<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, FooterRowType, FooterCellType } from './types.js';
	import { getTableContext } from './context.svelte.js';
	import { t, getSelectedLang } from '#lib/app/localization/index.js';
	import { parseAggregate, aggregate, formatAggregate } from './footer.js';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet; // verilmezse değer gösterilir: kısayol/fonksiyon hesaplanır, diğerleri metin (bkz. footer.ts)
		class?: string;
		fr: FooterRowType<TData>;
		fc: FooterCellType<TData>;
	};
	const { children, class: classes, fr, fc, ...attributes }: Props = $props();

	const context = getTableContext<TData>();

	const gridRowStart = $derived(context.dataLength + context.headerLength + fr.footerIndex + 1);
	const bottom = $derived(`${(context.footerLength - fr.footerIndex - 1) * context.footerRowHeight}px`);

	const layout = $derived(context.columnLayout[fc.colVisibleIndex]);

	// Gösterilecek metin ve açıklama. Veri değişince (düzenleme, yapıştırma, optimistik güncelleme) kendiliğinden güncellenir.
	const shown = $derived.by((): { text: string; title?: string } => {
		const value = fc.value;
		const items = context.items as TData[];
		const locale = getSelectedLang();
		const pageHint = t('dt_footer_page_hint', { count: items.length });
		if (typeof value === 'function') {
			const result = (value as (items: TData[]) => unknown)(items);
			if (result === null || result === undefined) return { text: '' };
			return { text: typeof result === 'number' ? formatAggregate(result, undefined, locale) : String(result), title: pageHint };
		}
		const agg = parseAggregate(value);
		if (agg) {
			const result = aggregate(agg.fn, items as Record<string, unknown>[], fc.col.data.field as string);
			const text = result === undefined ? '' : agg.fn === 'count' ? formatAggregate(result, 0, locale) : formatAggregate(result, agg.digits, locale);
			return { text, title: pageHint };
		}
		return { text: value === null || value === undefined ? '' : String(value) };
	});
</script>

<div
	data-slc-table-footercell
	role="gridcell"
	class={classes}
	class:slc-table-freeze-left={layout?.freezeLeft}
	class:slc-table-freeze-right={layout?.freezeRight}
	class:slc-table-freeze-left-boundary={layout?.boundaryLeft}
	class:slc-table-freeze-right-boundary={layout?.boundaryRight}
	style:position="sticky"
	style:bottom
	style:left={layout?.left}
	style:right={layout?.right}
	style:z-index={layout?.sticky ? 3 : 2}
	style:grid-row-start={gridRowStart}
	style:grid-column={layout?.gridColumn}
	style:justify-content={layout?.justifyFooter}
	title={shown.title}
	{...attributes}
>
	{#if children}
		{@render children()}
	{:else}
		<!-- Metin kendi kutusunda: flex kutusundaki çıplak metne text-overflow uygulanmaz (üç nokta çıkmaz) -->
		<span class="slc-table-footer-text">{shown.text}</span>
	{/if}
</div>

<style>
	[data-slc-table-footercell] {
		display: flex;
		font-variant-numeric: tabular-nums; /* rakamlar eşit genişlikte: alt alta karşılaştırma kolay */
		align-items: center;
		padding: 8px 12px;
		font-weight: 500;
		color: var(--_dt-header-text);
		background-color: var(--_dt-header-bg);
		border-top: 1px solid var(--_dt-border-strong);
		border-right: var(--_dt-col-line);
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.slc-table-footer-text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
