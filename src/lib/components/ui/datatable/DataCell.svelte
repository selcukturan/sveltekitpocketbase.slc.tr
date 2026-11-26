<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { Row, DataRowType, DataCellType } from './types.js';
	import { getTableContext } from './state/context.svelte.js';
	import Value from './Value.svelte';
	import CellInput from './parts/CellInput.svelte';
</script>

<script lang="ts" generics="TData extends Row">
	// Ek HTML attribute'u (spread) alınmaz: spread, hücrenin tüm attribute'larını her güncellemede tek bir nesneyle
	// yeniden kurdurur (kaydırmada hücre başına gereksiz iş ve çöp). Görünüm için class, içerik için children kullanın.
	type Props = {
		children?: Snippet; // verilmezse değer kolon tipine göre <Value> ile gösterilir
		editable?: boolean; // verilirse kolondaki editable'ı bu hücre için geçersiz kılar (kendi dataRow snippet'inde)
		class?: string;
		dr: DataRowType<TData>;
		dc: DataCellType<TData>;
	};
	const { children, class: classes, dr, dc, editable }: Props = $props();

	const context = getTableContext<TData>();

	// Sanal kaydırmada hücreler sürekli oluşturulur: kolon bilgisi context'te kolon başına bir kez hesaplanır (columnLayout),
	// satır tıklaması grid'deki tek dinleyiciyle yakalanır (trackRowClick, data-row ile).
	const layout = $derived(context.columnLayout[dc.colVisibleIndex]);
	const gridRowStart = $derived(dr.rowOriginalIndex + context.headerLength + 1);
	// Aktif hücre (klavye imleci): her hücre yalnızca bir string karşılaştırır, DOM'da değişen 2 hücredir
	const isActive = $derived(context.cursor.key === `${dr.rowOriginalIndex}:${dc.colVisibleIndex}`);
	const isActiveRow = $derived(context.cursor.activeRow === dr.rowOriginalIndex);
	const isSelected = $derived(context.selection.enabled && context.selection.has(dr.row.id));
	const inRange = $derived(context.cursor.inRange(dr.rowOriginalIndex, dc.colVisibleIndex));
	// Düzenleme: düzenlenen hücre düzenleyiciyi çizer. Yeni değer (optimistik) sorgunun kendisinden gelir (withOverride);
	// istek sürerken hücre "kaydediliyor" olarak işaretlenir.
	const isEditing = $derived(context.editor.isEditing(dr.rowOriginalIndex, dc.colVisibleIndex));
	const isSaving = $derived(context.editor.isSaving(dr.row.id, dc.col.data.field as string));
</script>

<div
	data-slc-table-datacell
	data-row={dr.rowOriginalIndex}
	data-col={dc.colVisibleIndex}
	data-active={isActive || undefined}
	data-active-row={isActiveRow || undefined}
	data-selected={isSelected || undefined}
	data-in-range={inRange || undefined}
	data-saving={isSaving || undefined}
	aria-selected={inRange || undefined}
	id={context.cellId({ row: dr.rowOriginalIndex, col: dc.colVisibleIndex })}
	{@attach editable !== undefined && context.editor.override(dr.row.id, dc.col.data.field as string, editable)}
	role="gridcell"
	class={[classes, context.rowClass?.(dr.row)]}
	class:slc-table-freeze-left={layout?.freezeLeft}
	class:slc-table-freeze-right={layout?.freezeRight}
	class:slc-table-freeze-left-boundary={layout?.boundaryLeft}
	class:slc-table-freeze-right-boundary={layout?.boundaryRight}
	class:clickable={context.onRowClick !== undefined}
	style:grid-row-start={gridRowStart}
	style:grid-column={layout?.gridColumn}
	style:justify-content={layout?.justifyCell}
	style:position={layout?.sticky ? 'sticky' : undefined}
	style:left={layout?.left}
	style:right={layout?.right}
	style:z-index={layout?.sticky ? 1 : undefined}
>
	{#if isEditing}
		<CellInput id={context.cellId({ row: dr.rowOriginalIndex, col: dc.colVisibleIndex })} options={dc.col.data.options} align={context.alignOf(dc.col.data)} />
	{:else if children}
		{@render children()}
	{:else if dc.col.data.type === 'select'}
		<!-- Görsel: tıklama grid'deki dinleyiciyle (seçim kolonu) işlenir; durum satırın aria-selected'ında -->
		{#if context.selection.enabled}
			<input class="slc-table-check" type={context.selection.mode === 'single' ? 'radio' : 'checkbox'} checked={isSelected} tabindex="-1" aria-hidden="true" />
		{/if}
	{:else}
		<Value value={dc.value} type={dc.col.data.type} />
	{/if}
</div>

<style>
	[data-slc-table-datacell] {
		display: flex;
		font-variant-numeric: tabular-nums; /* rakamlar eşit genişlikte: alt alta karşılaştırma kolay */
		align-items: center;
		padding: 8px 12px;
		border-bottom: var(--_dt-row-line);
		border-right: var(--_dt-col-line);
		background-color: var(--_dt-bg); /* sticky hücreler altını örtsün */
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		user-select: none; /* çift/shift tıklamada metin seçilmesin; kopyalama Ctrl+C ile (3. aşama) */
	}
	[data-slc-table-datacell].clickable {
		cursor: pointer;
	}
	/* Düzenleyici (CellInput) hücreyi kaplar; sticky hücrelerde inline style 'sticky' bunu ezer, o da konumlandırır */
	[data-slc-table-datacell] {
		position: relative;
	}
	/* Kaydediliyor */
	[data-slc-table-datacell][data-saving] {
		color: var(--_dt-muted);
		font-style: italic;
	}
	.slc-table-check {
		width: 15px;
		height: 15px;
		accent-color: var(--_dt-accent);
		pointer-events: none;
	}
	/* Aktif hücre: odak tablodayken (grid ya da hücredeki bir buton) vurgu rengi, değilken soluk (yeri kaybolmasın) */
	[data-slc-table-datacell][data-active] {
		outline: 2px solid var(--_dt-border-strong);
		outline-offset: -2px;
	}
	:global(.slc-table:focus-within) [data-slc-table-datacell][data-active] {
		outline-color: var(--_dt-accent);
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
