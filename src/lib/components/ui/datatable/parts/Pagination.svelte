<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Icon } from '#lib/components/icons/index.js';

	type Props = {
		perPage: number;
		totalPages: number;
		page: number;
		onChange?: ({ page, perPage }: { page: number; perPage: number }) => void;
	};
	let { perPage, totalPages, page, onChange }: Props = $props();

	// Kademeli komşu sayısı: uçlara yakınken daha çok sayfa gösterilir, toplam buton sayısı sabit kalır
	let delta = $derived.by(() => {
		if (page === 1 || page === totalPages) return 3;
		if (page === 2 || page === totalPages - 1) return 2;
		return 1;
	});

	let visiblePages = $derived.by(() => {
		const range: (number | '...')[] = [];
		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) range.push(i);
			else if (range[range.length - 1] !== '...') range.push('...');
		}
		return range;
	});

	function goToPage(target: number) {
		if (target < 1 || target > totalPages || target === page) return;
		onChange?.({ page: target, perPage });
	}
</script>

<nav class="slc-pagination" aria-label={t('dt_pagination')}>
	<button type="button" class="slc-page-btn" onclick={() => goToPage(page - 1)} disabled={page <= 1} aria-label={t('previous')} title={t('previous')}>
		<Icon name="chevron_left" size={16} />
	</button>

	{#each visiblePages as item, index (index)}
		{#if item === '...'}
			<span class="slc-page-ellipsis" aria-hidden="true">…</span>
		{:else}
			<button type="button" class="slc-page-btn" class:active={item === page} aria-current={item === page ? 'page' : undefined} onclick={() => goToPage(item)}>
				{item}
			</button>
		{/if}
	{/each}

	<button type="button" class="slc-page-btn" onclick={() => goToPage(page + 1)} disabled={page >= totalPages} aria-label={t('next')} title={t('next')}>
		<Icon name="chevron_right" size={16} />
	</button>
</nav>

<style>
	.slc-pagination {
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.slc-page-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 2rem;
		height: 2rem;
		padding: 0 0.5rem;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		background: transparent;
		color: var(--_dt-header-text);
		font-variant-numeric: tabular-nums;
		cursor: pointer;
		user-select: none;
	}
	.slc-page-btn:hover:not(:disabled):not(.active) {
		background-color: var(--_dt-header-bg);
	}
	.slc-page-btn:focus-visible {
		outline: 2px solid var(--_dt-accent);
		outline-offset: 1px;
	}
	.slc-page-btn.active {
		background-color: var(--_dt-accent);
		color: var(--color-surface-50);
		font-weight: 600;
		cursor: default;
	}
	.slc-page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.slc-page-ellipsis {
		min-width: 1.25rem;
		text-align: center;
		color: var(--_dt-muted);
	}
</style>
