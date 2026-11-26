<script lang="ts" generics="TData extends Row">
	import { t } from '#lib/app/localization/index.js';
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { getTableContext, type Borders, type Density } from '../state/context.svelte.js';
	import type { Row } from '../types';

	const context = getTableContext<TData>();

	const borderOptions: Borders[] = ['none', 'horizontal', 'vertical', 'both'];
	const densityOptions: Density[] = ['compact', 'normal', 'relaxed'];

	// Sol + sağ sabit kolon toplamı görünür kolon sayısını aşamaz
	const freezeFull = $derived(context.freezeLeft + context.freezeRight >= context.visibleColumns.length);
</script>

<!-- Kenarlık önizlemesi: 3x3 hücreli küçük tablo; seçeneğe göre yatay/dikey çizgiler çizilir -->
{#snippet borderPreview(option: Borders)}
	<svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
		<rect x="1" y="1" width="20" height="14" rx="2" />
		{#if option === 'horizontal' || option === 'both'}
			<path d="M1 5.67h20M1 10.33h20" />
		{/if}
		{#if option === 'vertical' || option === 'both'}
			<path d="M7.67 1v14M14.33 1v14" />
		{/if}
	</svg>
{/snippet}

<!-- Yoğunluk önizlemesi: satır aralığı seçeneğe göre açılan 3 çizgi -->
{#snippet densityPreview(option: Density)}
	{@const gap = option === 'compact' ? 3.5 : option === 'normal' ? 5 : 6.5}
	<svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
		<path d="M3 {8 - gap}h16M3 8h16M3 {8 + gap}h16" />
	</svg>
{/snippet}

{#snippet stepper(label: string, value: number, onMinus: () => void, onPlus: () => void)}
	<div class="slc-settings-row">
		<span>{label}</span>
		<div class="slc-stepper">
			<button type="button" onclick={onMinus} disabled={value <= 0} aria-label="{label} −">−</button>
			<output aria-live="polite">{value}</output>
			<button type="button" onclick={onPlus} disabled={freezeFull} aria-label="{label} +">+</button>
		</div>
	</div>
{/snippet}

<Toggler
	placement="top-end"
	--border="1px solid var(--_dt-border)"
	--background-color="var(--_dt-bg)"
	--box-shadow="0 8px 24px -6px var(--_dt-shadow)"
	--border-radius="0.5rem"
>
	{#snippet trigger({ active, attr })}
		<button {...attr} class="slc-dt-control" class:active aria-label={t('dt_settings')} title={t('dt_settings')}>
			<Icon name="settings" size={15} />
		</button>
	{/snippet}

	<div class="slc-settings" role="group" aria-label={t('dt_settings')}>
		<p class="slc-settings-title">{t('dt_settings')}</p>

		<section>
			<p class="slc-settings-label">{t('dt_borders')}</p>
			<div class="slc-segmented" role="radiogroup" aria-label={t('dt_borders')}>
				{#each borderOptions as option (option)}
					<button
						type="button"
						role="radio"
						aria-checked={context.borders === option}
						class:selected={context.borders === option}
						onclick={() => context.helpers.setBorders(option)}
						title={t(`dt_borders_${option}`)}
					>
						{@render borderPreview(option)}
						<span>{t(`dt_borders_${option}`)}</span>
					</button>
				{/each}
			</div>
		</section>

		<section>
			<p class="slc-settings-label">{t('dt_density')}</p>
			<div class="slc-segmented" style:grid-template-columns="repeat(3, 1fr)" role="radiogroup" aria-label={t('dt_density')}>
				{#each densityOptions as option (option)}
					<button
						type="button"
						role="radio"
						aria-checked={context.density === option}
						class:selected={context.density === option}
						onclick={() => context.helpers.setDensity(option)}
						title={t(`dt_density_${option}`)}
					>
						{@render densityPreview(option)}
						<span>{t(`dt_density_${option}`)}</span>
					</button>
				{/each}
			</div>
		</section>

		<section>
			<p class="slc-settings-label">{t('dt_freeze')}</p>
			{@render stepper(t('dt_freeze_left'), context.freezeLeft, context.unsetFreezeLeft, context.setFreezeLeft)}
			{@render stepper(t('dt_freeze_right'), context.freezeRight, context.unsetFreezeRight, context.setFreezeRight)}
		</section>

		<button type="button" class="slc-settings-reset" disabled={!context.isLayoutChanged} onclick={context.helpers.resetLayout}>
			{t('dt_reset_layout')}
		</button>
	</div>
</Toggler>

<style>
	/* PerPage / ColumnToggler ile aynı tetikleyici görünümü */
	.slc-dt-control {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--_dt-border-strong);
		border-radius: 0.375rem;
		background-color: var(--_dt-bg);
		color: var(--_dt-header-text);
		cursor: pointer;
	}
	.slc-dt-control:hover,
	.slc-dt-control.active {
		background-color: var(--_dt-header-bg);
	}
	.slc-dt-control:focus-visible {
		outline: 2px solid var(--_dt-accent);
		outline-offset: 1px;
	}

	.slc-settings {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		width: 17rem;
		padding: 0.875rem;
		color: var(--_dt-text);
	}
	.slc-settings section {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}
	.slc-settings-title {
		font-weight: 600;
	}
	.slc-settings-label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--_dt-muted);
	}

	/* Kenarlık seçimi: 4'lü buton grubu */
	.slc-segmented {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2px;
		padding: 2px;
		border-radius: 0.375rem;
		background-color: var(--_dt-header-bg);
	}
	.slc-segmented button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.375rem 0.125rem;
		border-radius: 0.25rem;
		background: transparent;
		color: var(--_dt-header-text);
		font-size: 0.6875rem;
		cursor: pointer;
	}
	.slc-segmented button:hover:not(.selected) {
		background-color: var(--_dt-header-hover);
	}
	.slc-segmented button.selected {
		background-color: var(--_dt-bg);
		color: var(--_dt-accent);
		font-weight: 600;
		box-shadow: 0 1px 3px var(--_dt-shadow);
	}
	.slc-segmented button:focus-visible,
	.slc-stepper button:focus-visible,
	.slc-settings-reset:focus-visible {
		outline: 2px solid var(--_dt-accent);
		outline-offset: 1px;
	}

	/* Sabit kolon sayaçları */
	.slc-settings-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.slc-stepper {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--_dt-border-strong);
		border-radius: 0.375rem;
		overflow: hidden;
	}
	.slc-stepper button {
		width: 1.75rem;
		height: 1.75rem;
		background: transparent;
		color: var(--_dt-header-text);
		font-size: 1rem;
		line-height: 1;
		cursor: pointer;
	}
	.slc-stepper button:hover:not(:disabled) {
		background-color: var(--_dt-header-bg);
	}
	.slc-stepper button:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.slc-stepper output {
		min-width: 2rem;
		text-align: center;
		font-variant-numeric: tabular-nums;
		border-inline: 1px solid var(--_dt-border-strong);
		line-height: 1.75rem;
	}

	.slc-settings-reset {
		padding: 0.375rem;
		border-top: 1px solid var(--_dt-border);
		padding-top: 0.75rem;
		background: transparent;
		color: var(--_dt-accent);
		font-size: 0.8125rem;
		cursor: pointer;
	}
	.slc-settings-reset:disabled {
		color: var(--_dt-muted);
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
