<script lang="ts" generics="TData extends Row">
	import { t } from '#lib/app/localization/index.js';
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { getTableContext } from '../state/context.svelte.js';
	import type { Row } from '../types';

	const context = getTableContext<TData>();
</script>

<Toggler
	placement="top-end"
	--border="1px solid var(--_dt-border)"
	--background-color="var(--_dt-bg)"
	--box-shadow="0 8px 24px -6px var(--_dt-shadow)"
	--border-radius="0.5rem"
	--max-height="60dvh"
>
	{#snippet trigger({ active, attr })}
		<button {...attr} class="slc-dt-control" class:active aria-label={t('dt_toggle_columns')}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 3h9M12 9h9M12 15h9M12 21h9M3 6h6v12H3z" />
			</svg>
			<span>{t('dt_columns')}</span>
			<Icon name="chevron_down" size={14} />
		</button>
	{/snippet}

	<div class="slc-dt-menu">
		{#each context.columns as col, originalIndex (col.field)}
			{@const label = col.label ?? String(col.field)}
			<!-- seçim kolonu gizlenmez (selection prop'una bağlı) -->
			{#if col.type !== 'select'}
				<label class="slc-dt-menu-item">
					<input type="checkbox" checked={col.hidden !== true} onchange={() => context.toggleColumnVisibility(originalIndex)} />
					<span>{t(label, undefined, label)}</span>
				</label>
			{/if}
		{/each}
	</div>
</Toggler>

<style>
	/* PerPage.svelte ile aynı görünüm */
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
	.slc-dt-control:focus-visible {
		outline: 2px solid var(--_dt-accent);
		outline-offset: 1px;
	}
	.slc-dt-menu {
		display: flex;
		flex-direction: column;
		min-width: 12rem;
		padding: 0.25rem;
	}
	.slc-dt-menu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.625rem;
		border-radius: 0.25rem;
		color: var(--_dt-text);
		cursor: pointer;
		user-select: none;
	}
	.slc-dt-menu-item:hover {
		background-color: var(--_dt-header-bg);
	}
	.slc-dt-menu-item input {
		width: 14px;
		height: 14px;
		accent-color: var(--_dt-accent);
		cursor: pointer;
	}
</style>
