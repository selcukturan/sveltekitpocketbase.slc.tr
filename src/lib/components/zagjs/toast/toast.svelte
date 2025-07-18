<script lang="ts">
	import * as toast from '@zag-js/toast';
	import type { ToastProps } from './types';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import { Icon } from '$lib/components/icons';

	const props: ToastProps = $props();

	const service = useMachine(toast.machine, () => ({
		...props.newToastOptions,
		parent: props.parent,
		index: props.index
	}));

	const api = $derived(toast.connect(service, normalizeProps));

	const rootClasses = {
		base: 'min-w-full sm:min-w-sm sm:max-w-lg break-words rounded-sm border p-2 shadow-lg',
		info: 'bg-info-400 text-info-950 border-info-600 border',
		success: 'bg-success-400 text-success-950 border-success-600 border',
		warning: 'bg-warning-400 text-warning-950 border-warning-600 border',
		error: 'bg-error-400 text-error-950 border-error-600 border',
		loading: 'bg-surface-400 text-surface-950 border-surface-600 border'
	};

	const rootClass = $derived.by(() => {
		switch (api.type) {
			case 'info':
				return `${rootClasses.base} ${rootClasses.info}`;
			case 'success':
				return `${rootClasses.base} ${rootClasses.success}`;
			case 'warning':
				return `${rootClasses.base} ${rootClasses.warning}`;
			case 'error':
				return `${rootClasses.base} ${rootClasses.error}`;
			case 'loading':
				return `${rootClasses.base} ${rootClasses.loading}`;
			default:
				return '';
		}
	});

	const actionButtonClasses = {
		base: 'cursor-pointer mx-2 rounded-sm px-2 py-1',
		info: 'text-info-50 bg-info-600 hover:bg-info-800 active:bg-info-700',
		success: 'text-success-50 bg-success-600 hover:bg-success-800 active:bg-success-700',
		warning: 'text-warning-50 bg-warning-600 hover:bg-warning-800 active:bg-warning-700',
		error: 'text-error-50 bg-error-600 hover:bg-error-800 active:bg-error-700',
		loading: 'text-surface-50 bg-surface-600 hover:bg-surface-800 active:bg-surface-700'
	};

	const actionButtonClass = $derived.by(() => {
		switch (api.type) {
			case 'info':
				return `${actionButtonClasses.base} ${actionButtonClasses.info}`;
			case 'success':
				return `${actionButtonClasses.base} ${actionButtonClasses.success}`;
			case 'warning':
				return `${actionButtonClasses.base} ${actionButtonClasses.warning}`;
			case 'error':
				return `${actionButtonClasses.base} ${actionButtonClasses.error}`;
			case 'loading':
				return `${actionButtonClasses.base} ${actionButtonClasses.loading}`;
			default:
				return '';
		}
	});

	const closeButtonClasses = {
		base: 'inline-flex h-5 w-5 transform cursor-pointer items-center justify-center rounded-full text-center align-middle leading-none select-none',
		info: 'bg-info-500 text-info-50 hover:bg-info-700 active:bg-info-600',
		success: 'bg-success-500 text-success-50 hover:bg-success-700 active:bg-success-600',
		warning: 'bg-warning-500 text-warning-50 hover:bg-warning-700 active:bg-warning-600',
		error: 'bg-error-500 text-error-50 hover:bg-error-700 active:bg-error-600',
		loading: 'bg-surface-500 text-surface-50 hover:bg-surface-700 active:bg-surface-600'
	};

	const closeButtonClass = $derived.by(() => {
		switch (api.type) {
			case 'info':
				return `${closeButtonClasses.base} ${closeButtonClasses.info}`;
			case 'success':
				return `${closeButtonClasses.base} ${closeButtonClasses.success}`;
			case 'warning':
				return `${closeButtonClasses.base} ${closeButtonClasses.warning}`;
			case 'error':
				return `${closeButtonClasses.base} ${closeButtonClasses.error}`;
			case 'loading':
				return `${closeButtonClasses.base} ${closeButtonClasses.loading}`;
			default:
				return '';
		}
	});
</script>

<div {...api.getRootProps()} class={rootClass}>
	<span {...api.getGhostBeforeProps()}></span>
	<div class="flex h-full items-center">
		<div class="pr-2">
			{#if api.type === 'info'}
				<Icon name="info" />
			{:else if api.type === 'error'}
				<Icon name="circle-x" />
			{:else if api.type === 'success'}
				<Icon name="circle-check" />
			{:else if api.type === 'warning'}
				<Icon name="circle-alert" />
			{:else if api.type === 'loading'}
				<div class="animate-spin">
					<Icon name="loader" />
				</div>
			{:else}
				<Icon name="circle" />
			{/if}
		</div>
		<div class="flex-1">
			<h3 {...api.getTitleProps()} class="font-semibold">{api.title}</h3>
			<p {...api.getDescriptionProps()} class="text-sm">{api.description}</p>
		</div>
		{#if props.newToastOptions.action}
			<div>
				<button type="button" class={actionButtonClass} {...api.getActionTriggerProps()}>{props.newToastOptions.action.label}</button>
			</div>
		{/if}
		{#if api.closable}
			<div class="self-start">
				<button type="button" class={closeButtonClass} {...api.getCloseTriggerProps()} onclick={api.dismiss} aria-label="Kapat">
					<Icon name="close" size="12px" />
				</button>
			</div>
		{/if}
	</div>
	<span {...api.getGhostAfterProps()}></span>
</div>

<style lang="postcss">
	/* @reference "tailwindcss"; */

	/* BEGIN Zag.js Required */
	[data-part='root'] {
		translate: var(--x) var(--y);
		scale: var(--scale);
		z-index: var(--z-index);
		height: var(--height);
		opacity: var(--opacity);
		will-change: translate, opacity, scale;
	}
	[data-part='root'] {
		transition:
			translate 400ms,
			scale 400ms,
			opacity 400ms;
		transition-timing-function: cubic-bezier(0.21, 1.02, 0.73, 1);
	}
	[data-part='root'][data-state='closed'] {
		transition:
			translate 400ms,
			scale 400ms,
			opacity 200ms;
		transition-timing-function: cubic-bezier(0.06, 0.71, 0.55, 1);
	}
	/* END Zag.js Required */

	/* Overlap'in arkasinda kalan ve tasma ihtimali olan uzun metinler icin toast'lara `overflow-hidden` uygular */
	[data-scope='toast'][data-part='root'][data-sibling][data-overlap] {
		overflow: hidden;
	}
</style>
