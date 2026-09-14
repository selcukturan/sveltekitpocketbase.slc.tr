<script lang="ts">
	// https://github.com/Rich-Harris/svelte-split-pane
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
		slotA,
		slotB
	}: SplitPanePropsType = $props();

	let container: HTMLElement;
	let dragging = $state(false);
	let w = $state(0);
	let h = $state(0);
	let position = $derived(pos);
	let timeoutId: NodeJS.Timeout;

	function update(e: PointerEvent) {
		if (disabled) return;

		const x = e.clientX;
		const y = e.clientY;

		const { top, left } = container.getBoundingClientRect();

		const pos_px = type === 'horizontal' ? x - left : y - top;
		const size = type === 'horizontal' ? w : h;

		const new_pos: Length = pos.endsWith('%') ? `${(100 * pos_px) / size}%` : `${pos_px}px`;
		pos = constrain(container, size, min, max, new_pos, priority);

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			onchange?.(pos);
		}, 150);
	}

	function drag(node: HTMLElement, callback: (event: PointerEvent) => void) {
		const pointerdown = (event: PointerEvent) => {
			if ((event.pointerType === 'mouse' && event.button === 2) || (event.pointerType !== 'mouse' && !event.isPrimary)) return;

			node.setPointerCapture(event.pointerId);

			event.preventDefault();

			dragging = true;

			const pointerup = () => {
				dragging = false;

				node.setPointerCapture(event.pointerId);

				window.removeEventListener('pointermove', callback, false);
				window.removeEventListener('pointerup', pointerup, false);
			};

			window.addEventListener('pointermove', callback, false);
			window.addEventListener('pointerup', pointerup, false);
		};

		node.addEventListener('pointerdown', pointerdown, { capture: true, passive: false });

		return {
			destroy() {
				node.removeEventListener('pointerdown', pointerdown);
			}
		};
	}
</script>

<div
	data-pane={id}
	class="slc-split-pane-container {type} {classes}"
	bind:this={container}
	bind:clientWidth={w}
	bind:clientHeight={h}
	style={`--pos:${position}`}
>
	<div class="pane">
		{@render slotA()}
	</div>

	<div class="pane">
		{@render slotB()}
	</div>

	{#if pos !== '0%' && pos !== '100%'}
		<div class="{type} divider" class:disabled use:drag={(e) => update(e)}></div>
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

	/*############# BEGIN for class="slc-app-page-layout" ###########################################################################*/
	.slc-split-pane-container.slc-app-page-layout {
		grid-template-columns: none !important;
		grid-template-rows: var(--pos) 1fr !important;
	}
	/* sm: 640px >  < 768px */
	@media (min-width: 640px) {
		.slc-split-pane-container.slc-app-page-layout {
			grid-template-rows: none !important;
			grid-template-columns: var(--pos) 1fr !important;
		}
	}
	/* md: 768px >  < ∞ */
	@media (min-width: 768px) {
		.slc-split-pane-container.slc-app-page-layout {
			--sp-thickness: var(--thickness, 8px);
		}
	}
	/*############# END for class="slc-app-page-layout" ###########################################################################*/
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
