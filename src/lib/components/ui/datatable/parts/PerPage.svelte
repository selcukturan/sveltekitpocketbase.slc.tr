<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import { Icon } from '#lib/components/icons/index.js';

	type Props = {
		perPage: number;
		options?: number[];
		disabled?: boolean; // istek sürerken true
		onChange?: (perPage: number) => void; // sayfa sayısı değişeceği için çağıran 1. sayfaya dönmeli
	};
	let { perPage, options = [30, 50, 100, 200, 500, 1000], disabled = false, onChange }: Props = $props();
</script>

<Toggler
	placement="top-end"
	--border="1px solid var(--_dt-border)"
	--background-color="var(--_dt-bg)"
	--box-shadow="0 8px 24px -6px var(--_dt-shadow)"
	--border-radius="0.5rem"
>
	{#snippet trigger({ active, attr })}
		<button {...attr} class="slc-dt-control" class:active {disabled} aria-label={t('dt_per_page_label')}>
			<span>{t('dt_per_page', { count: perPage })}</span>
			<Icon name="chevron_down" size={14} />
		</button>
	{/snippet}

	{#snippet children({ close })}
		<div class="slc-dt-menu" role="menu">
			{#each options as option (option)}
				<button
					type="button"
					role="menuitemradio"
					aria-checked={option === perPage}
					class="slc-dt-menu-item"
					class:selected={option === perPage}
					onclick={() => {
						if (option !== perPage) onChange?.(option);
						close();
					}}
				>
					{option}
				</button>
			{/each}
		</div>
	{/snippet}
</Toggler>

<style>
	.slc-dt-control {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		height: 2rem;
		padding: 0 0.625rem;
		border: 1px solid var(--_dt-border-strong);
		border-radius: 0.375rem;
		background-color: var(--_dt-bg);
		color: var(--_dt-header-text);
		white-space: nowrap;
		cursor: pointer;
		user-select: none;
	}
	.slc-dt-control:hover,
	.slc-dt-control.active {
		background-color: var(--_dt-header-bg);
	}
	.slc-dt-control:disabled {
		opacity: 0.5;
		cursor: progress;
	}
	.slc-dt-control:focus-visible {
		outline: 2px solid var(--_dt-accent);
		outline-offset: 1px;
	}
	.slc-dt-menu {
		display: flex;
		flex-direction: column;
		min-width: 6rem;
		padding: 0.25rem;
	}
	.slc-dt-menu-item {
		padding: 0.375rem 0.625rem;
		border-radius: 0.25rem;
		background: transparent;
		color: var(--_dt-text);
		text-align: right;
		font-variant-numeric: tabular-nums;
		cursor: pointer;
	}
	.slc-dt-menu-item:hover,
	.slc-dt-menu-item:focus-visible {
		background-color: var(--_dt-header-bg);
		outline: none;
	}
	.slc-dt-menu-item.selected {
		color: var(--_dt-accent);
		font-weight: 600;
	}
</style>
