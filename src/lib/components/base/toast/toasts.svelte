<script lang="ts">
	// https://github.com/huntabyte/svelte-5-context-classes
	import type { Toaster, Toast } from './types';
	import { getToaster } from './toaster.svelte';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let { id, position = 'bottom-right' }: Toaster = $props();

	const toaster = getToaster(id);

	const positionsClasses: Record<Required<Toaster>['position'], string> = {
		'bottom-right': 'bottom-2 right-2 items-end',
		'top-center': 'top-2 left-1/2 -translate-x-1/2 items-center',
		'bottom-center': 'bottom-2 left-1/2 -translate-x-1/2 items-center'
	};
	const toasterRootClasses = `min-w-11/12 sm:min-w-0 fixed z-3000 flex flex-col gap-2 px-2 ${positionsClasses[position]}`;
	const toastRootClasses: Record<Required<Toast>['type'] | 'base', string> = {
		base: 'relative flex items-center break-words rounded-sm border p-2 shadow-lg min-w-full sm:min-w-sm sm:max-w-lg',
		info: 'bg-info-400 text-info-950 border-info-600 border',
		success: 'bg-success-400 text-success-950 border-success-600 border',
		warning: 'bg-warning-400 text-warning-950 border-warning-600 border',
		error: 'bg-error-400 text-error-950 border-error-600 border',
		loading: 'bg-surface-400 text-surface-950 border-surface-600 border',
		default: 'bg-surface-400 text-surface-950 border-surface-600 border'
	};

	const actionButtonClasses: Record<Required<Toast>['type'] | 'base', string> = {
		base: 'cursor-pointer mx-2 rounded-sm px-2 py-1',
		info: 'text-info-50 bg-info-600 hover:bg-info-800 active:bg-info-700',
		success: 'text-success-50 bg-success-600 hover:bg-success-800 active:bg-success-700',
		warning: 'text-warning-50 bg-warning-600 hover:bg-warning-800 active:bg-warning-700',
		error: 'text-error-50 bg-error-600 hover:bg-error-800 active:bg-error-700',
		loading: 'text-surface-50 bg-surface-600 hover:bg-surface-800 active:bg-surface-700',
		default: 'text-surface-50 bg-surface-600 hover:bg-surface-800 active:bg-surface-700'
	};

	const closeButtonClasses: Record<Required<Toast>['type'] | 'base', string> = {
		base: 'inline-flex items-center justify-center h-5 w-5 rounded-full cursor-pointer select-none',
		info: 'bg-info-500 text-info-50 hover:bg-info-700 active:bg-info-600',
		success: 'bg-success-500 text-success-50 hover:bg-success-700 active:bg-success-600',
		warning: 'bg-warning-500 text-warning-50 hover:bg-warning-700 active:bg-warning-600',
		error: 'bg-error-500 text-error-50 hover:bg-error-700 active:bg-error-600',
		loading: 'bg-surface-500 text-surface-50 hover:bg-surface-700 active:bg-surface-600',
		default: 'bg-surface-500 text-surface-50 hover:bg-surface-700 active:bg-surface-600'
	};
</script>

<!-- Toaster -->
<div class={toasterRootClasses} {@attach toaster.attach}>
	{#each toaster.toasts as toast (toast.id)}
		{@const toastId = toast.id}
		{@const toastType = toast.type ?? 'default'}
		<!-- Toast -->
		<div
			in:fly={{ y: 100, duration: 200 }}
			out:fly={{ y: 200, duration: 200 }}
			animate:flip={{ duration: 200 }}
			class={`${toastRootClasses.base} ${toastRootClasses[toastType]}`}
		>
			<div class="pr-2">
				{#if toastType === 'info'}
					<!-- <Icon name="info" /> -->
					<i class={`ri-information-line !text-2xl`}></i>
				{:else if toastType === 'error'}
					<i class={`ri-error-warning-line !text-2xl`}></i>
				{:else if toastType === 'success'}
					<i class={`ri-check-line !text-2xl`}></i>
				{:else if toastType === 'warning'}
					<i class={`ri-alert-line !text-2xl`}></i>
				{:else if toastType === 'loading'}
					<div class="animate-spin">
						<i class={`ri-loader-4-line !text-2xl`}></i>
					</div>
				{:else}
					<i class={`ri-circle-line !text-2xl`}></i>
				{/if}
			</div>
			<div class="flex-1">
				<h3 class="font-semibold">{toast.title}</h3>
				<p class="text-sm">{toast.description}</p>
			</div>
			{#if toastId && toast.action}
				<div>
					<button class={`${actionButtonClasses.base} ${actionButtonClasses[toastType]}`} onclick={() => toast.action?.onClick(toastId)}>
						{toast.action.label}
					</button>
				</div>
			{/if}
			{#if toastId && toast.closable !== false}
				<div class="self-start">
					<button
						type="button"
						class={`${closeButtonClasses.base} ${closeButtonClasses[toastType]}`}
						onclick={() => toaster.remove(toastId)}
						aria-label="Close"
					>
						<i class={`ri-close-line !text-base !leading-0`}></i>
					</button>
				</div>
			{/if}
		</div>
	{/each}
</div>
