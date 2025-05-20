<script lang="ts">
	import * as tooltip from '@zag-js/tooltip';
	import { useMachine, normalizeProps, mergeProps } from '@zag-js/svelte';
	import type { TooltipProps } from './types';
	import { fade } from 'svelte/transition';

	const {
		arrow = false,
		// Snippets
		trigger,
		content,
		// Events
		onmouseover,
		onclick,
		// Zag ---
		...zagProps
	}: TooltipProps = $props();

	// Zag
	const id = $props.id();
	const service = useMachine(tooltip.machine, () => ({
		id: id,
		...zagProps
	}));
	const api = $derived(tooltip.connect(service, normalizeProps));
	const triggerProps = $derived(mergeProps(api.getTriggerProps(), { onmouseover, onclick }));
</script>

<span data-testid="tooltip">
	<!-- Snippet: Trigger -->
	{#if trigger}
		<button {...triggerProps} type="button">
			{@render trigger?.()}
		</button>
	{/if}
	<!-- Tooltip Content -->
	{#if api.open}
		<div {...api.getPositionerProps()}>
			{#if arrow}
				<div {...api.getArrowProps()}>
					<div {...api.getArrowTipProps()}></div>
				</div>
			{/if}
			<div {...api.getContentProps()}>
				{@render content?.()}
			</div>
		</div>
	{/if}
</span>

<style lang="postcss">
	@reference "tailwindcss";

	[data-part='arrow'] {
		z-index: 999998;
		--arrow-size: 10px;
		--arrow-background: var(--color-surface-950);

		transition:
			opacity 150ms,
			visibility 150ms,
			transform 150ms;
		transform: translateY(0px);
		/* show */
		opacity: 1;
		visibility: visible;

		@starting-style {
			transform: translateY(3px);
			/* hide */
			opacity: 0;
			visibility: hidden;
		}
	}

	[data-part='content'] {
		z-index: 999999;
		font-size: var(--text-sm);
		font-weight: var(--font-weight-semibold);
		background-color: var(--color-surface-950);
		color: var(--color-surface-50);
		border-radius: var(--radius-md);
		max-width: 275px;
		padding: 3px 7px;

		transition:
			opacity 150ms,
			visibility 150ms,
			transform 150ms;
		transform: translateY(0px);
		/* show */
		opacity: 1;
		visibility: visible;

		@starting-style {
			transform: translateY(3px);
			/* hide */
			opacity: 0;
			visibility: hidden;
		}
	}
</style>
