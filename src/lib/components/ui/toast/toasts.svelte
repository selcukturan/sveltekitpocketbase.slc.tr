<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import type { ToasterOptions, Toast, ToastsProps } from './types.js';
	import { getToaster } from './toaster.svelte.js';
	import { slide, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { Icon, type IconKey } from '#lib/components/icons/index.js';

	const { toasterName = 'app-toaster' }: ToastsProps = $props();

	// svelte-ignore state_referenced_locally
	const toaster = getToaster(toasterName);

	const positionClasses: Record<Required<ToasterOptions>['position'], string> = {
		'bottom-left': 'bottom-2 left-2 items-start',
		'top-left': 'top-2 left-2 items-start',
		'bottom-right': 'bottom-2 right-2 items-end',
		'top-center': 'top-2 left-1/2 -translate-x-1/2 items-center',
		'bottom-center': 'bottom-2 left-1/2 -translate-x-1/2 items-center'
	};
	const toasterRootClasses = `w-full sm:w-auto fixed z-4000 flex flex-col gap-2 px-2 ${positionClasses[toaster.options.position]}`;
	// Toast: nötr kart (açılır yüzey rengi), türün rengi yalnızca soldaki şeritte ve ikonda. Doygun renkli zeminler
	// koyu temada ve farklı monitörlerde göz yoruyordu; metin her türde aynı (okunaklı) renkte.
	type ToastType = Required<Toast>['type'];
	const tones: Record<ToastType, { bar: string; icon: string }> = {
		info: { bar: 'bg-info-500', icon: 'bg-info-100 text-info-700' },
		success: { bar: 'bg-success-500', icon: 'bg-success-100 text-success-700' },
		warning: { bar: 'bg-warning-500', icon: 'bg-warning-100 text-warning-700' },
		error: { bar: 'bg-error-500', icon: 'bg-error-100 text-error-700' },
		loading: { bar: 'bg-surface-400', icon: 'bg-surface-200 text-surface-700' },
		default: { bar: 'bg-surface-400', icon: 'bg-surface-200 text-surface-700' }
	};
	const icons: Record<ToastType, IconKey> = {
		info: 'info',
		success: 'circle_check',
		warning: 'circle_alert',
		error: 'circle_x',
		loading: 'loader',
		default: 'bell'
	};
</script>

<!-- Toaster -->
<div class={toasterRootClasses} {@attach toaster.attach}>
	<!-- Toasts -->
	{#each toaster.toasts as toast (toast.id)}
		{@const toastId = toast.id}
		{@const toastType = toast.type ?? 'default'}
		<!-- Toast -->
		<div
			in:slide={{ duration: 200 }}
			out:fly={{ y: toaster.options.position.startsWith('top') ? -20 : 20, duration: 200 }}
			animate:flip={{ duration: 200 }}
			class="border-surface-300 relative flex w-full items-start gap-3 overflow-hidden rounded-xl border bg-(--slc-system-bg-surface) p-3 pl-4 shadow-lg sm:w-96"
			role={toastType === 'error' ? 'alert' : 'status'}
		>
			<span class="{tones[toastType].bar} absolute inset-y-0 left-0 w-1" aria-hidden="true"></span>
			<span class="{tones[toastType].icon} inline-flex size-8 shrink-0 items-center justify-center rounded-full" aria-hidden="true">
				<Icon name={icons[toastType]} size={18} class={toastType === 'loading' ? 'animate-spin' : ''} />
			</span>
			<div class="min-w-0 flex-1 pt-0.5">
				<h3 class="text-surface-950 text-sm font-semibold">{toast.title}</h3>
				{#if toast.description}<p class="text-surface-600 mt-0.5 text-sm break-words">{toast.description}</p>{/if}
				{#if toastId && toast.action}
					<button class="slc-btn-outline mt-2 h-8 px-3 text-xs" onclick={() => toast.action?.onClick(toastId)}>
						{toast.action.label}
					</button>
				{/if}
			</div>
			{#if toastId && toast.closable !== false}
				<button
					type="button"
					class="text-surface-500 hover:bg-surface-200 hover:text-surface-900 -mt-1 -mr-1 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md"
					onclick={() => toaster.remove(toastId)}
					aria-label={t('close')}
				>
					<Icon name="close" size={16} />
				</button>
			{/if}
		</div>
	{/each}
</div>
