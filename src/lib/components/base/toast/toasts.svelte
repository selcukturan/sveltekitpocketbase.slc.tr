<script lang="ts">
	// https://github.com/huntabyte/svelte-5-context-classes
	import type { Attachment } from 'svelte/attachments';
	import { getToaster } from './toaster.svelte';
	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let {
		id,
		position = 'bottom-right',
		type = 'info'
	}: {
		id: string;
		position?: 'top-center' | 'bottom-center' | 'bottom-right';
		type?: 'info' | 'success' | 'warning' | 'error' | 'loading';
	} = $props();

	const toaster = getToaster(id);

	const positions = {
		'bottom-right': 'bottom-2 right-2',
		'top-center': 'top-2 left-1/2 -translate-x-1/2',
		'bottom-center': 'bottom-2 left-1/2 -translate-x-1/2'
	};
	const className = `min-w-11/12 sm:min-w-lg fixed z-1500 flex flex-col gap-2 px-3 ${positions[position]}`;

	const rootClasses = {
		base: 'relative min-w-full sm:min-w-sm sm:max-w-lg break-words rounded-sm border p-2 shadow-lg',
		info: 'bg-info-400 text-info-950 border-info-600 border',
		success: 'bg-success-400 text-success-950 border-success-600 border',
		warning: 'bg-warning-400 text-warning-950 border-warning-600 border',
		error: 'bg-error-400 text-error-950 border-error-600 border',
		loading: 'bg-surface-400 text-surface-950 border-surface-600 border'
	};
	const handleClick = (event: MouseEvent, id: string) => {
		console.log('click');
		event.stopPropagation();
		toaster.remove(id);
	};

	function closeAttach(id: string): Attachment {
		return (element) => {
			if (!(element instanceof HTMLElement)) {
				throw new Error('closeAttach must be attached to an HTMLElement');
			}

			const handleClick = (event: MouseEvent) => {
				toaster.remove(id);
			};

			element.addEventListener('click', handleClick);
			return () => {
				// destroy buraya
				element.removeEventListener('click', handleClick);
			};
		};
	}
</script>

<!-- Toaster -->
<div class={className} {@attach toaster.attach}>
	{#each toaster.toasts as toast (toast.id)}
		<!-- Toast -->
		<div
			in:slide={{ duration: 300 }}
			out:fly={{ y: 200, duration: 300 }}
			animate:flip={{ duration: 300 }}
			class={`${rootClasses.base} ${rootClasses[type]}`}
		>
			<span class="text-sm font-medium">{toast.title + ' - ' + crypto.randomUUID()}</span>
			<span class="text-xs">{toast.message}</span>
			<button data-toast-button class="absolute top-2 right-2 size-5" {@attach closeAttach(toast.id)}>
				<span class="sr-only">Close toast</span>
				<p>X</p>
			</button>
		</div>
	{/each}
</div>
