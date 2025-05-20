<script lang="ts">
	import { fade } from 'svelte/transition';

	import * as tooltip from '@zag-js/tooltip';
	import { useMachine, normalizeProps, mergeProps } from '@zag-js/svelte';
	import type { TooltipProps } from './types';

	const {
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
			{@render trigger()}
		</button>
	{/if}
	<!-- Tooltip Content -->
	{#if api.open}
		<div {...api.getPositionerProps()} transition:fade={{ duration: 100 }}>
			<!-- Arrow -->
			<!-- {#if arrow}
				<div {...api.getArrowProps()}>
					<div {...api.getArrowTipProps()} ></div>
				</div>
			{/if} -->
			<!-- Snippet Content -->
			<div {...api.getContentProps()}>
				{@render content?.()}
			</div>
		</div>
	{/if}
</span>

<style lang="postcss">
	@reference "tailwindcss";

	[data-part='content'] {
		z-index: 999999;
		font-size: var(--text-sm);
		font-weight: var(--font-weight-semibold);
		background-color: var(--color-surface-950);
		color: var(--color-surface-50);
		border-radius: var(--radius-md);
		pointer-events: none;
		user-select: none;
		display: inline-block;
		vertical-align: top;
		max-width: 275px;
		padding: 3px 5px;
		text-align: center;
	}
</style>
