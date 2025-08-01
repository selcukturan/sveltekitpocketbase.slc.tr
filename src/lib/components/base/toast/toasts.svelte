<script lang="ts">
	// https://github.com/huntabyte/svelte-5-context-classes
	import type { Toaster, Toast } from './types';
	import { getToaster } from './toaster.svelte';
	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let { id, position = 'bottom-right' }: Toaster = $props();

	const toaster = getToaster(id);

	const positions: Record<Required<Toaster>['position'], string> = {
		'bottom-right': 'bottom-2 right-2',
		'top-center': 'top-2 left-1/2 -translate-x-1/2',
		'bottom-center': 'bottom-2 left-1/2 -translate-x-1/2'
	};
	const toasterRootClasses = `min-w-11/12 sm:min-w-lg fixed z-1500 flex flex-col gap-2 px-3 ${positions[position]}`;
	const toastRootClasses: Record<Required<Toast>['type'] | 'base', string> = {
		base: 'relative min-w-full sm:min-w-sm sm:max-w-lg break-words rounded-sm border p-2 shadow-lg',
		info: 'bg-info-400 text-info-950 border-info-600 border',
		success: 'bg-success-400 text-success-950 border-success-600 border',
		warning: 'bg-warning-400 text-warning-950 border-warning-600 border',
		error: 'bg-error-400 text-error-950 border-error-600 border',
		loading: 'bg-surface-400 text-surface-950 border-surface-600 border',
		default: 'bg-surface-400 text-surface-950 border-surface-600 border'
	};
</script>

<!-- Toaster -->
<div class={toasterRootClasses} {@attach toaster.attach}>
	{#each toaster.toasts as toast (toast.id)}
		{@const toastId = toast.id}
		{@const toastType = toast.type ?? 'default'}
		<!-- Toast -->
		<div
			in:slide={{ duration: 300 }}
			out:fly={{ y: 200, duration: 300 }}
			animate:flip={{ duration: 300 }}
			class={`${toastRootClasses.base} ${toastRootClasses[toastType]}`}
		>
			<span class="text-sm font-medium">{toast.title}</span>
			<span class="text-xs">{toast.description}</span>
			{#if toastId && toast.closable !== false}
				<button class="absolute top-2 right-2 size-5" onclick={() => toaster.remove(toastId)}>
					<span class="sr-only">Close toast</span>
					<p>X</p>
				</button>
			{/if}
			{#if toastId && toast.action}
				<button class="bg-surface-950 text-surface-100" onclick={() => toast.action?.onClick(toastId)}>{toast.action.label}</button>
			{/if}
		</div>
	{/each}
</div>
