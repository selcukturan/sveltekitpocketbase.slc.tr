<script lang="ts" generics="TData extends Row">
	import { t } from '#lib/app/localization/index.js';
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import * as input from '#lib/components/ui/inputs/index.js';
	import { inputClasses } from '#lib/components/ui/inputs/common.js';
	import type { Column, Row } from '../types.js';
	import { MIN, MAX, type Filters, type FilterField, type FilterValues } from '../utils/filter.js';

	// Liste filtreleri (utils/filter.ts → defineFilters). Tablodan bağımsızdır: sayfa nereye koyarsa orada durur.
	// Metin filtreleri satır içinde (hızlı arama); sayı, tarih, evet/hayır ve seçim filtreleri "Filtreler" panelinde.
	// Değerler list.filter'a (taslak) yazılır; Ara ya da Enter uygular (list.search), Temizle sıfırlayıp arar (list.clear).
	// Etiket: filtre tanımındaki label (defineTable kolonlardan verir), yoksa columns'taki kolon, yoksa alan adı.
	type ListLike = { filter: object; params: { filterData: object }; search: () => void; clear: () => void };
	let { list, filters, columns = [] }: { list: ListLike; filters: Filters; columns?: Column<TData>[] } = $props();

	const draft = $derived(list.filter as FilterValues); // bind:value ile yazılır (list.filter reaktif proxy)
	const inline = $derived(filters.fields.filter((f) => f.type === 'text'));
	const panel = $derived(filters.fields.filter((f) => f.type !== 'text'));
	const applied = $derived(filters.countActive(list.params.filterData as FilterValues, ['number', 'date', 'datetime', 'bool', 'select']));

	const labelOf = (f: FilterField) => {
		const label = f.label ?? columns.find((col) => col.field === f.field)?.label ?? f.field;
		return t(label, undefined, label);
	};
	const optionsOf = (f: FilterField) =>
		f.type === 'bool'
			? [
					{ value: 'true', label: t('yes') },
					{ value: 'false', label: t('no') }
				]
			: (f.options ?? []).map((option) => ({ value: option, label: option }));
	const onEnter =(e: KeyboardEvent, close?: () => void) => {
		if (e.key !== 'Enter') return;
		list.search();
		close?.();
	};
	const fieldClass = `${inputClasses.base} ${inputClasses.variants.default} ${inputClasses.sizes.md}`; // inputs/ ile aynı görünüm
</script>

{#snippet range(f: FilterField, close: () => void)}
	{@const label = labelOf(f)}
	{@const date = f.type === 'date' || f.type === 'datetime'}
	<div class="slc-filter-range">
		{#each [MIN, MAX] as end (end)}
			{@const hint = t(date ? (end === MIN ? 'dt_filter_from' : 'dt_filter_to') : end === MIN ? 'dt_filter_min' : 'dt_filter_max')}
			<input
				class={fieldClass}
				type={date ? 'date' : 'number'}
				step="any"
				bind:value={() => draft[f.field + end], (value) => (draft[f.field + end] = value == null ? '' : String(value))}
				placeholder={hint}
				aria-label="{label} · {hint}"
				onkeydown={(e) => onEnter(e, close)}
			/>
		{/each}
	</div>
{/snippet}

<div class="slc-filter-bar">
	{#each inline as f (f.field)}
		{@const label = labelOf(f)}
		<div class="w-56">
			<input.Text bind:value={draft[f.field]} placeholder={t('search_contains', { field: label })} aria-label={label} onkeydown={(e) => onEnter(e)} />
		</div>
	{/each}

	{#if panel.length > 0}
		<Toggler placement="bottom-end">
			{#snippet trigger({ active, attr })}
				<input.Button
					{...attr}
					variant={active || applied > 0 ? 'light' : 'ghost'}
					color="surface"
					aria-label={applied > 0 ? t('dt_filters_applied', { count: applied }) : t('dt_filters')}
				>
					{t('dt_filters')}
					{#if applied > 0}<span class="slc-filter-badge">{applied}</span>{/if}
				</input.Button>
			{/snippet}
			{#snippet children({ close })}
				<div class="slc-filter-panel" role="group" aria-label={t('dt_filters')}>
					{#each panel as f (f.field)}
						{@const label = labelOf(f)}
						<span class="slc-filter-label">{label}</span>
						{#if f.type === 'number' || f.type === 'date' || f.type === 'datetime'}
							{@render range(f, close)}
						{:else}
							<!-- "Tümü" = seçimi kaldır (boş değer); liste panelin içinde açılır (iç içe popover) -->
							<input.Select
								bind:value={() => draft[f.field] ?? '', (value) => (draft[f.field] = value)}
								options={optionsOf(f)}
								deSelectText={t('dt_filter_any')}
								aria-label={label}
							/>
						{/if}
					{/each}
					<div class="slc-filter-buttons">
						<input.Button
							variant="ghost"
							color="surface"
							label={t('dt_filter_clear')}
							onclick={() => {
								list.clear();
								close();
							}}
						/>
						<input.Button
							variant="filled"
							label={t('search')}
							onclick={() => {
								list.search();
								close();
							}}
						/>
					</div>
				</div>
			{/snippet}
		</Toggler>
	{/if}

	<input.Button variant="filled" label={t('search')} onclick={list.search} />
	<input.Button variant="ghost" color="surface" label={t('dt_filter_clear')} onclick={list.clear} />
</div>

<style>
	.slc-filter-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
	.slc-filter-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.375rem;
		border-radius: 9999px;
		background-color: var(--color-primary-500);
		color: white;
		font-size: 0.75rem;
	}
	.slc-filter-panel {
		display: grid;
		grid-template-columns: max-content minmax(14rem, 1fr);
		align-items: center;
		gap: 0.75rem 1rem;
		padding: 1rem;
		font-size: 0.875rem;
	}
	.slc-filter-label {
		color: var(--color-surface-600);
		font-weight: 500;
	}
	.slc-filter-range {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
	}
	.slc-filter-buttons {
		grid-column: 1 / -1;
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding-top: 0.25rem;
	}
</style>
