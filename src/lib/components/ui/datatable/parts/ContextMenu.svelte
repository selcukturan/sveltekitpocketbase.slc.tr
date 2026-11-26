<script lang="ts" module>
	import type { Attachment } from 'svelte/attachments';
	import { on } from 'svelte/events';
	import type { Row } from '../types.js';
	import { getTableContext } from '../state/context.svelte.js';
</script>

<script lang="ts" generics="TData extends Row">
	// Sağ tık menüsü (DataTable'ın contextMenu snippet'i). Popover üst katmanda, imlecin olduğu yerde (fixed) açılır;
	// ekrana sığmazsa içeri kaydırılır. Açılınca ilk öğe odak alır, ↑ ↓ Home End gezinir. Dışarı tıklama ve Esc kapatır
	// (popover="auto"); tablo kaydırılınca da kapanır. Kapanırken odak menüdeyse tabloya döner.
	const context = getTableContext<TData>();

	const items = (node: HTMLElement) => [...node.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)')];

	const popover: Attachment<HTMLElement> = (node) => {
		node.showPopover();

		// Ekrana sığdır: sağ/alt kenardan taşıyorsa sola/yukarı kaydır
		const rect = node.getBoundingClientRect();
		const menu = context.menu!;
		node.style.left = `${Math.max(0, Math.min(menu.x, window.innerWidth - rect.width - 4))}px`;
		node.style.top = `${Math.max(0, Math.min(menu.y, window.innerHeight - rect.height - 4))}px`;
		items(node)[0]?.focus({ preventScroll: true });

		const close = () => (context.menu = undefined);
		const offToggle = on(node, 'toggle', (e) => (e as ToggleEvent).newState === 'closed' && close());
		// Kaydırınca kapanır. Sağ tık hücreyi aktif yapıp görünür alana kaydırabilir (scrollIntoView): o kaydırma sayılmaz,
		// konum menünün açıldığı karenin sonunda alınır.
		const el = context.el;
		let base: { top: number; left: number } | undefined;
		const frame = requestAnimationFrame(() => el && (base = { top: el.scrollTop, left: el.scrollLeft }));
		const offScroll = el
			? on(el, 'scroll', () => base && (Math.abs(el.scrollTop - base.top) > 2 || Math.abs(el.scrollLeft - base.left) > 2) && close(), { passive: true })
			: undefined;
		const offKey = on(node, 'keydown', (e: KeyboardEvent) => {
			const list = items(node);
			const index = list.indexOf(document.activeElement as HTMLElement);
			const move = (to: number) => {
				e.preventDefault();
				list[(to + list.length) % list.length]?.focus();
			};
			if (e.key === 'ArrowDown') move(index + 1);
			else if (e.key === 'ArrowUp') move(index - 1);
			else if (e.key === 'Home') move(0);
			else if (e.key === 'End') move(list.length - 1);
			else if (e.key === 'Tab') e.preventDefault(); // odak menüde kalır (Esc ya da seçim ile çıkılır)
		});

		// Odak menüde mi: temizlik (async modda) eleman DOM'dan kalktıktan sonra çalışabilir, o an activeElement body olur
		let focusInside = false;
		const offIn = on(node, 'focusin', () => (focusInside = true));
		const offOut = on(node, 'focusout', (e: FocusEvent) => (focusInside = node.contains(e.relatedTarget as Node | null)));

		return () => {
			offToggle();
			cancelAnimationFrame(frame);
			offScroll?.();
			offKey();
			offIn();
			offOut();
			if (node.isConnected && node.matches(':popover-open')) node.hidePopover();
			// Odak menüdeydi (Esc, dışarı tıklama): tabloya döner. MenuItem odağı zaten tabloya vermiştir.
			const active = document.activeElement;
			if (focusInside && (!active || active === document.body || node.contains(active))) context.helpers.focus();
		};
	};
</script>

{#if context.menu && context.contextMenu}
	{@const row = context.menu.row}
	<div class="slc-table-context-menu" role="menu" popover="auto" {@attach popover}>
		{@render context.contextMenu(row as TData)}
	</div>
{/if}

<style>
	.slc-table-context-menu {
		position: fixed;
		inset: auto;
		margin: 0;
		display: flex;
		flex-direction: column;
		min-width: 10rem;
		padding: 0.25rem;
		border: 1px solid var(--_dt-border-strong);
		border-radius: 0.5rem;
		color: var(--_dt-text);
		background-color: var(--_dt-bg);
		box-shadow: 0 8px 24px -6px var(--_dt-shadow);
		font-size: 0.875rem;
	}
</style>
