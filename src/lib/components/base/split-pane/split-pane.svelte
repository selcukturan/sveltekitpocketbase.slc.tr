<script lang="ts">
	// https://github.com/Rich-Harris/svelte-split-pane
	import type { Attachment } from 'svelte/attachments';
	import type { SplitPanePropsType, Length } from './types';
	import { constrain } from './utils';

	let {
		class: classes,
		id = undefined,
		type,
		pos = '50%',
		min = '0%',
		max = '100%',
		disabled = false,
		priority = 'min',
		onchange,
		dividerLabel,
		resetPos,
		slotA,
		slotB
	}: SplitPanePropsType = $props();

	let container: HTMLElement;
	let dragging = $state(false);
	let w = $state(0);
	let h = $state(0);
	let position = $derived(pos);
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const size = () => (type === 'horizontal' ? w : h);

	// Yeni konumu sınırlar içinde uygular; onchange sürüklerken art arda değil, durunca bir kez çağrılır
	function setPos(new_pos: Length, notifyNow = false) {
		pos = constrain(container, size(), min, max, new_pos, priority);
		clearTimeout(timeoutId);
		if (notifyNow) onchange?.(pos);
		else timeoutId = setTimeout(() => onchange?.(pos), 150);
	}

	function update(e: PointerEvent) {
		if (disabled) return;
		const { top, left } = container.getBoundingClientRect();
		const pos_px = type === 'horizontal' ? e.clientX - left : e.clientY - top;
		setPos(pos.endsWith('%') ? `${(100 * pos_px) / size()}%` : `${pos_px}px`);
	}

	const toPx = (length: Length) => (length.endsWith('%') ? (parseFloat(length) * size()) / 100 : parseFloat(length));

	// Klavye: ok tuşları 10px (Shift ile 50px), Home/End en küçük/en büyük
	function onkeydown(e: KeyboardEvent) {
		if (disabled) return;
		const back = type === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
		const forward = type === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
		const step = e.shiftKey ? 50 : 10;
		let next: Length | undefined;
		if (e.key === back) next = `${toPx(pos) - step}px`;
		else if (e.key === forward) next = `${toPx(pos) + step}px`;
		else if (e.key === 'Home') next = min;
		else if (e.key === 'End') next = max;
		if (!next) return;
		e.preventDefault();
		setPos(next, true);
	}

	const ondblclick = () => {
		if (!disabled && resetPos) setPos(resetPos, true);
	};

	// Sürükleme: pointer capture ile pencere dışına taşsa da izlenir
	const drag: Attachment<HTMLElement> = (node) => {
		const pointerdown = (event: PointerEvent) => {
			if ((event.pointerType === 'mouse' && event.button === 2) || (event.pointerType !== 'mouse' && !event.isPrimary)) return;
			node.setPointerCapture(event.pointerId);
			event.preventDefault();
			dragging = true;

			const pointerup = () => {
				dragging = false;
				if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
				window.removeEventListener('pointermove', update, false);
				window.removeEventListener('pointerup', pointerup, false);
			};

			window.addEventListener('pointermove', update, false);
			window.addEventListener('pointerup', pointerup, false);
		};

		node.addEventListener('pointerdown', pointerdown, { capture: true, passive: false });
		return () => node.removeEventListener('pointerdown', pointerdown, { capture: true });
	};
</script>

<div data-pane={id} class="slc-split-pane-container {type} {classes}" bind:this={container} bind:clientWidth={w} bind:clientHeight={h} style={`--pos:${position}`}>
	<div class="pane">
		{@render slotA()}
	</div>

	<div class="pane">
		{@render slotB()}
	</div>

	{#if pos !== '0%' && pos !== '100%'}
		<!-- Bölücü: fare/dokunma ile sürüklenir, klavyeyle odaklanıp ok tuşlarıyla taşınır. WAI-ARIA "window splitter"
			 kalıbı: odaklanabilen role="separator" etkileşimlidir (Svelte'in a11y kuralı bunu tanımıyor). -->
		<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
		<div
			class="{type} divider"
			class:disabled
			role="separator"
			tabindex={disabled ? -1 : 0}
			aria-label={dividerLabel}
			aria-orientation={type === 'horizontal' ? 'vertical' : 'horizontal'}
			aria-valuenow={Math.round(toPx(pos))}
			aria-valuemin={Math.round(toPx(min))}
			aria-valuemax={Math.round(toPx(max))}
			{onkeydown}
			{ondblclick}
			{@attach drag}
		></div>
	{/if}
</div>

{#if dragging}
	<div class="mousecatcher"></div>
{/if}

<style>
	.slc-split-pane-container {
		--sp-thickness: var(--thickness, 20px);
		--sp-color: var(--color, transparent);
		display: grid;
		position: relative;
		width: 100%;
		height: 100%;
	}

	.slc-split-pane-container.vertical {
		grid-template-rows: var(--pos) 1fr;
	}

	.slc-split-pane-container.horizontal {
		grid-template-columns: var(--pos) 1fr;
	}

	/* Uygulama menü ağacı (app-layout): ince bölücü */
	.slc-split-pane-container.slc-app-page-layout {
		--sp-thickness: var(--thickness, 8px);
	}
	.pane {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	.pane > :global(*) {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.mousecatcher {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.0001);
	}

	.divider {
		position: absolute;
		z-index: 51;
		touch-action: none !important;
	}

	.divider:focus-visible {
		outline: none;
	}
	.divider:focus-visible::after {
		background-color: var(--color-primary-500);
		width: 3px !important;
		left: calc(50% - 1px) !important;
	}
	.vertical > .divider:focus-visible::after {
		width: 100% !important;
		height: 3px !important;
		left: 0 !important;
		top: calc(50% - 1px) !important;
	}

	.divider::after {
		content: '';
		position: absolute;
		background-color: var(--sp-color);
	}

	.horizontal > .divider {
		padding: 0 calc(0.5 * var(--sp-thickness));
		width: 0;
		height: 100%;
		cursor: ew-resize;
		left: var(--pos);
		transform: translate(calc(-0.5 * var(--sp-thickness)), 0);
	}

	.horizontal > .divider.disabled {
		cursor: default;
	}

	.horizontal > .divider::after {
		left: 50%;
		top: 0;
		width: 1px;
		height: 100%;
	}

	.vertical > .divider {
		padding: calc(0.5 * var(--sp-thickness)) 0;
		width: 100%;
		height: 0;
		cursor: ns-resize;
		top: var(--pos);
		transform: translate(0, calc(-0.5 * var(--sp-thickness)));
	}

	.vertical > .divider.disabled {
		cursor: default;
	}

	.vertical > .divider::after {
		top: 50%;
		left: 0;
		width: 100%;
		height: 1px;
	}
</style>
