<script lang="ts" generics="TData extends Row">
	import { Toggler } from '$lib/components/base/toggler';
	import { getTableContext } from '../context.svelte';
	import type { Row } from '../types';

	const context = getTableContext<TData>();
</script>

<Toggler placement="top-end" minWidth="200px">
	{#snippet trigger({ active, toggle })}
		<button type="button" class="slc-btn-toggler" class:active onclick={toggle} aria-label="Kolon Görünürlüğünü Değiştir">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 3h9M12 9h9M12 15h9M12 21h9M3 6h6v12H3z" />
			</svg>
			<span>Kolonlar</span>
		</button>
	{/snippet}

	<div class="slc-column-toggler-menu">
		{#each context.columns as col, originalIndex (originalIndex)}
			<label class="slc-column-toggler-item">
				<input type="checkbox" checked={col.hidden !== true} onchange={() => context.toggleColumnVisibility(originalIndex)} />
				<span>{col.label || String(col.field)}</span>
			</label>
		{/each}
	</div>
</Toggler>

<style>
	.slc-btn-toggler {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 500;
		color: var(--color-surface-700, #334155);
		background-color: var(--color-surface-50, #ffffff);
		border: 1px solid var(--color-surface-300, #cbd5e1);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		user-select: none;
	}
	.slc-btn-toggler:hover {
		background-color: var(--color-surface-100, #f8fafc);
		border-color: var(--color-surface-400, #94a3b8);
		color: var(--color-surface-900, #0f172a);
	}
	.slc-btn-toggler.active {
		background-color: var(--color-primary-50, #eff6ff);
		border-color: var(--color-primary-500, #3b82f6);
		color: var(--color-primary-700, #1d4ed8);
	}
	.slc-column-toggler-menu {
		padding: 8px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		background-color: var(--color-surface-50, #ffffff);
		border: 1px solid var(--color-surface-200, #e2e8f0);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}
	.slc-column-toggler-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
		border-radius: 4px;
		cursor: pointer;
		user-select: none;
		transition: background-color 0.15s;
		font-size: 13px;
		color: var(--color-surface-800, #1e293b);
	}
	.slc-column-toggler-item:hover {
		background-color: var(--color-surface-100, #f1f5f9);
		color: var(--color-surface-900, #0f172a);
	}
	.slc-column-toggler-item input {
		cursor: pointer;
		accent-color: var(--color-primary-500, #3b82f6);
		width: 14px;
		height: 14px;
	}
</style>
