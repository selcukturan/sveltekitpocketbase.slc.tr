<script lang="ts" generics="TData extends Row">
	/**
	 * HTML Popover - CSS Anchor Positioning
	 * Support;
	 * Browser support for anchor positioning:	https://caniuse.com/css-anchor-positioning
	 * Browser support for popover:				https://caniuse.com/mdn-api_htmlelement_popover
	 * Polyfill;
	 * Popover Polyfill:						https://github.com/oddbird/popover-polyfill
	 * Anchor positioning polyfill:				https://github.com/oddbird/css-anchor-positioning
	 *
	 */
	import { fly } from 'svelte/transition';
	import type { Row, Sources, Column, Footer, OnActionParams } from '../types';
	import { getTable } from '../tables.svelte';
	import { Th, Td, Tf } from '..';
	import { flushSync } from 'svelte';

	type Props = {
		src: Sources<TData>;
		row?: TData;
		ri?: number;
		foot?: Footer<TData>;
		fi?: number;
		type?: 'header' | 'cell' | 'footer';
	};
	const { src, row, ri, foot, fi, type = 'cell' }: Props = $props();

	const table = getTable<TData>(src.id);

	const row_oi = $derived(table.get.enableVirtualization === false ? ri : row?.oi);

	const col: Column<TData> = { field: '_action', align: 'center' };

	let container: HTMLDivElement | undefined = $state(undefined);
	let active = $state(false);
	let isOutsideMouseDown = $state(false);
	let escClose = $state(true);

	const show = () => {
		if (active) return;
		active = true;
		flushSync(); // active değiştikten sonra $effect içindeki değişikliklerin hemen işlenmesi için flushSync kullanılır
	};
	const hide = () => {
		if (!active) return;
		active = false;
		flushSync(); // active değiştikten sonra $effect içindeki değişikliklerin hemen işlenmesi için flushSync kullanılır
	};
	const toggle = () => (active ? hide() : show());

	const handleItemClick = (params: OnActionParams) => {
		hide();
		table.actionTrigger(params);
	};

	// `window: Window` Event Listeners
	const handleFocusChange = (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		if (active && !container?.contains(target)) {
			hide();
		}
	};
	const handleEscPress = (e: KeyboardEvent) => {
		if (active && escClose && e.code === 'Escape') {
			e.preventDefault();
			hide();
		}
	};
	const handleOutsideMousedown = (e: MouseEvent) => {
		if (!active) return;

		const target = e.target as HTMLElement;
		isOutsideMouseDown = !container?.contains(target); // Tıklama container dışındaysa true olur
	};
	const handleOutsideClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (active && isOutsideMouseDown && !container?.contains(target)) {
			hide();
		}
	};

	$effect(() => {
		if (active) {
			window.addEventListener('click', handleOutsideClick);
			window.addEventListener('mousedown', handleOutsideMousedown);
			window.addEventListener('keydown', handleEscPress);
			window.addEventListener('focusin', handleFocusChange);
			return () => {
				window.removeEventListener('click', handleOutsideClick);
				window.removeEventListener('mousedown', handleOutsideMousedown);
				window.removeEventListener('keydown', handleEscPress);
				window.removeEventListener('focusin', handleFocusChange);
			};
		}
	});
</script>

{#if table.get.rowAction === true}
	{#if type === 'header'}
		<Th {src} {col} ci={table.visibleColumns.length}>
			{#if table.get.actions.tableActions != null && table.get.actions.tableActions.length > 0}
				<div bind:this={container} data-scope="th-action" data-part="container" tabindex="-1">
					<button data-scope="th-action" data-part="trigger" onclick={toggle} type="button" tabindex="0">
						<span>
							{@html `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`}
						</span>
					</button>
					{#if active}
						<div data-scope="th-action" data-part="popup" transition:fly={{ y: 0, duration: 200 }}>
							<div style:display="grid" role="menu">
								{#each table.get.actions.tableActions as item}
									<button
										data-scope="th-action"
										data-part="popup-item"
										data-action={item.action}
										type="button"
										onclick={() => handleItemClick({ type: 'table', action: item.action })}
										role="menuitem"
										tabindex="-1"
									>
										<span>{item.label}</span>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else}
				{@html ``}
			{/if}
		</Th>
	{:else if type === 'cell' && row != null && ri != null}
		<Td {src} {col} ci={table.visibleColumns.length} {row} {ri}>
			{#if table.get.actions.rowActions != null && table.get.actions.rowActions.length > 0}
				<div bind:this={container} data-scope="td-action" data-part="container" tabindex="-1">
					<button data-scope="td-action" data-part="trigger" onclick={toggle} type="button" tabindex="0">
						<span>
							{@html `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`}
						</span>
					</button>
					{#if active}
						<div data-scope="td-action" data-part="popup" transition:fly={{ y: 0, duration: 200 }}>
							<div style:display="grid" role="menu">
								{#each table.get.actions.rowActions as item}
									<button
										data-scope="td-action"
										data-part="popup-item"
										data-action={item.action}
										type="button"
										onclick={() => handleItemClick({ type: 'row', rowIndex: row_oi, action: item.action })}
										role="menuitem"
										tabindex="-1"
									>
										<span>{item.label + ' - ' + row_oi}</span>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else}
				{@html ``}
			{/if}
		</Td>
	{:else if type === 'footer' && foot != null && fi != null}
		<Tf {src} {col} ci={table.visibleColumns.length} {foot} {fi}>
			{@html ``}
		</Tf>
	{:else}
		{@html ``}
	{/if}
{:else}
	{@html ``}
{/if}

<style>
	[data-scope='th-action'][data-part='trigger'],
	[data-scope='td-action'][data-part='trigger'] {
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		border-radius: 9999px;
		padding: 4px;
		margin: 0;
		outline: none;
		cursor: pointer;
	}
	[data-scope='th-action'][data-part='popup'],
	[data-scope='td-action'][data-part='popup'] {
		display: block;
		position: absolute;
		/* z-index: 1; */
		cursor: default;
		width: auto;
		min-width: 140px;
		max-width: 450px;
		max-height: 330px;
		overflow-x: hidden;
		overflow-y: auto;
		border-radius: 4px;
		/* position */
		top: 0;
		right: 100%;
		bottom: auto;
		left: auto;
	}
	[data-scope='th-action'][data-part='popup-item'],
	[data-scope='td-action'][data-part='popup-item'] {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0.5rem 1rem;
		border: none;
		cursor: pointer;
	}
</style>
