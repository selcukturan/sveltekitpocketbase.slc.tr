<script lang="ts">
	import { getTableContext } from '../state/context.svelte.js';

	// Sağ tık menüsünün öğesi (DataTable'ın contextMenu snippet'inde).
	// Sıra önemli: önce odak tabloya (işlem bir onay penceresi açarsa odağı o alır, kapanınca tabloya döner),
	// sonra işlem (menüdeki satırı okuyabilir), en son menü kapanır.
	let { label, onclick, danger = false, disabled = false }: { label: string; onclick: () => void; danger?: boolean; disabled?: boolean } = $props();

	const context = getTableContext();

	const run = () => {
		context.helpers.focus();
		onclick();
		context.menu = undefined;
	};
</script>

<button type="button" role="menuitem" class="slc-table-menu-item" class:danger {disabled} onclick={run}>{label}</button>

<style>
	.slc-table-menu-item {
		padding: 0.375rem 0.625rem;
		border-radius: 0.25rem;
		text-align: left;
		cursor: pointer;
	}
	.slc-table-menu-item:hover,
	.slc-table-menu-item:focus-visible {
		background-color: var(--_dt-header-bg);
		outline: none;
	}
	.slc-table-menu-item:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.slc-table-menu-item.danger {
		color: var(--color-error-600);
	}
</style>
