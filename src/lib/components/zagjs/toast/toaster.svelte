<script lang="ts">
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import * as toast from '@zag-js/toast';
	import Toast from './toast.svelte';
	import type { ToasterProps } from './types.js';

	const {
		// Toaster
		toaster,
		// Toast
		base = 'flex justify-between items-center gap-3',
		width = 'min-w-xs',
		padding = 'p-3',
		rounded = 'rounded-container',
		classes = '',
		// Message
		messageBase = 'grid',
		messageClasses = '',
		// Title
		titleBase = 'font-semibold',
		titleClasses = '',
		// Description
		descriptionBase = 'text-sm',
		descriptionClasses = '',
		// Dismiss Button
		btnDismissBase = 'btn-icon hover:preset-tonal',
		btnDismissClasses = '',
		// State
		stateInfo = 'border-info-600 bg-info-400 text-info-950',
		stateSuccess = 'border-success-600 bg-success-400 text-success-950',
		stateWarning = 'border-warning-600 bg-warning-400 text-warning-950',
		stateError = 'border-error-600 bg-error-400 text-error-950'
	}: ToasterProps = $props();

	const id = $props.id();
	const service = useMachine(toast.group.machine, () => ({ id: id, store: toaster }));
	const api = $derived(toast.group.connect(service, normalizeProps));

	console.log(service);
</script>

<div {...api.getGroupProps()} data-testid="toaster-root">
	{#each api.getToasts() as newToastOptions, index (newToastOptions.id)}
		<Toast
			{base}
			{width}
			{padding}
			{rounded}
			{classes}
			{messageBase}
			{messageClasses}
			{titleBase}
			{titleClasses}
			{descriptionBase}
			{descriptionClasses}
			{btnDismissBase}
			{btnDismissClasses}
			{stateInfo}
			{stateError}
			{stateWarning}
			{stateSuccess}
			{newToastOptions}
			{index}
			parent={service}
		></Toast>
	{/each}
</div>
