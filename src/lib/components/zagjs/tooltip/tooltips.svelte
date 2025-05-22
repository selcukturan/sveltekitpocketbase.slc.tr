<script lang="ts">
	import * as tooltip from '@zag-js/tooltip';
	import { useMachine, normalizeProps, mergeProps } from '@zag-js/svelte';
	import type { TooltipProps } from './types';
	import { fly } from 'svelte/transition';

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
			{@render trigger?.()}
		</button>
	{/if}
	<!-- Tooltip Content -->
	{#if api.open}
		<div {...api.getPositionerProps()}>
			<div {...api.getContentProps()} transition:fly={{ y: 3, duration: 150 }} class="bg-surface-950 text-surface-50 z-999999 rounded-sm px-1.5 py-1 text-sm font-semibold">
				{@render content?.()}
			</div>
		</div>
	{/if}
</span>
