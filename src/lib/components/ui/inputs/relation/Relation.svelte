<script lang="ts" generics="Tmultiple extends boolean = false">
	import { focustrap, portal } from '#lib/attachments/index.js';
	import { tick, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { areEqual } from '#lib/utils/common.js';
	import { inputClasses } from '../common.js';

	import { getMultipleRelationSelectedList, getSingleRelationSelectedList } from '#lib/remotes/relations.remote.js';
	import type { RelationValueTypeChoice, RelationResolveData, RelationPropsType, RelationValueChangeArgs, HideFuncType } from '../type.js';
	import RelationDialogContent from './dialog-content.svelte';
	import { createRelationInputsContext } from './context.svelte.js';
	import LoadingSvg from './loading-svg.svelte';

	let {
		collection,
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as RelationValueTypeChoice<Tmultiple>),
		message = 'Onaylıyor musunuz?',
		yes = 'Seçimi Kaydet',
		no = 'İptal',
		class: classes = '',
		id = '',
		name,
		label = '',
		status = 'default',
		size = 'md',
		inform = false,
		animationDuration = 150,
		defaultSearch = '',
		disabled = false,
		readonly = false,
		onValueChange
	}: RelationPropsType<Tmultiple> = $props();

	// svelte-ignore state_referenced_locally
	const context = createRelationInputsContext<Tmultiple>(value, defaultSearch); // init

	// let pickerDataTimestamp = $state(new Date().getTime());
	// let pickerSearch = $state.raw({ search: defaultSearch, timestamp: new Date().getTime() });
	// let pickerAnswer = $state<'init' | 'waiting' | 'true' | 'false'>('init');
	// let context.pickerValue = $state(value);

	let dialog: HTMLDialogElement | null = $state(null);
	let isOpen = $state(false);
	let resolvePromise: ((data: RelationResolveData) => void) | null = null;
	let isClosing = $state(false);
	let closedby = $state<'any' | 'none' | 'closerequest' | null | undefined>('any');

	const show = (): Promise<RelationResolveData> => {
		return new Promise<RelationResolveData>((resolve) => {
			resolvePromise = resolve;
			isOpen = true;
			tick().then(() => {
				dialog?.showModal();
			});
		});
	};

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	const hide: HideFuncType = async (log, confirm) => {
		if (isClosing) return;
		isClosing = true;
		await sleep(animationDuration);
		isClosing = false;
		dialog?.close();
		isOpen = false;
		resolvePromise?.({ confirm });
		resolvePromise = null;
	};

	const dialogEvents = (dialogElement: HTMLElement) => {
		if (!(dialogElement instanceof HTMLDialogElement)) {
			throw new Error('Dialog element is not an HTMLDialogElement');
		}

		const destroyKeydown = on(dialogElement, 'keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				hide('confirm - handleKeydown - Esc key pressed', false);
			}
		});
		const destroyCancel = on(dialogElement, 'cancel', (e: Event) => {
			e.preventDefault();
			if (e.target === dialogElement) {
				hide('handleCancel - Backdrop click', false);
			}
		});

		return () => {
			destroyKeydown();
			destroyCancel();
		};
	};

	async function pickerOpen() {
		if (disabled || readonly) return;
		// pickerAnswer = 'waiting';
		context.pickerValue = value;
		context.pickerParams = { collection, search: defaultSearch, timestamp: new Date().getTime() };

		const { confirm } = await show();

		if (confirm) {
			// pickerAnswer = 'true';
			if (multiple && Array.isArray(context.pickerValue)) {
				const newValue = context.pickerValue as string[];
				value = newValue as RelationValueTypeChoice<Tmultiple>;
			} else if (!multiple && typeof context.pickerValue === 'string') {
				const newValue = context.pickerValue as string;
				value = newValue as RelationValueTypeChoice<Tmultiple>;
			}
			await tick();
		} else {
			// pickerAnswer = 'false';
		}
	}

	const triggerChange = ({ value, beforeValue, initial }: RelationValueChangeArgs<Tmultiple>) => {
		onValueChange?.({ value, beforeValue, initial });
	};

	let initial = true;
	let beforeValue = $state.snapshot(value) as RelationValueTypeChoice<Tmultiple>;
	const watchValueChange = () => {
		void value;
		return untrack(() => {
			const snapshotValue = $state.snapshot(value) as RelationValueTypeChoice<Tmultiple>;
			if (initial || !areEqual(snapshotValue, beforeValue)) {
				triggerChange({ value: snapshotValue, beforeValue, initial });
			}
			beforeValue = snapshotValue;
			if (initial) initial = false;
		});
	};

	function removeInputSelectedItem(idToRemove: string) {
		if (disabled || readonly) return;
		if (multiple && Array.isArray(value)) {
			value = value.filter((id) => id !== idToRemove) as RelationValueTypeChoice<Tmultiple>;
		} else if (!multiple && value === idToRemove) {
			value = '' as RelationValueTypeChoice<Tmultiple>;
		}
	}

	// ######### BEGIN: Initial Selected List ###########
	let selectedListPromiseTimestamp = $state(new Date().getTime());
	let selectedListPromiseValue = $state.raw(value);
	let selectedListPromise = $derived(
		multiple
			? getMultipleRelationSelectedList({
					ids: selectedListPromiseValue as RelationValueTypeChoice<true>,
					collection,
					timestamp: selectedListPromiseTimestamp
				})
			: getSingleRelationSelectedList({
					id: selectedListPromiseValue as RelationValueTypeChoice<false>,
					collection,
					timestamp: selectedListPromiseTimestamp
				})
	);
	const watchSelectedListPromise = () => selectedListPromise.current?.forEach((item) => context.itemDetailCache.set(item.id, item));
	// ######### END: Initial Selected List #############

	const defaultClasses = $derived(!inform ? inputClasses.base + ' ' + inputClasses.variants[status] + ' ' + inputClasses.sizes[size] : '');
</script>

<div style:display="none" {@attach watchSelectedListPromise}>relation-component-state-watcher</div>

{#snippet listItem({ id, label, isLoading }: { id: string; label: string; isLoading: boolean })}
	<!-- list-item -->
	<div
		class="hover:bg-surface-300/50 border-surface-300 relative flex min-h-8 w-full items-center gap-2.5 border-t px-3 py-2 wrap-break-word outline-none first:border-t-0"
	>
		<!-- content -->
		<div class="flex w-full max-w-full min-w-0 items-center gap-1 leading-0.5 select-text">
			{#if isLoading}
				<LoadingSvg />
			{/if}
			<!-- label -->
			<span class="bg-surface-300 border-surface-400 rounded-sm border px-1 py-0.5 text-sm shadow-sm">{label}</span>
		</div>
		<!-- action -->
		<div class="inline-flex shrink-0 items-center gap-2.5">
			{#if !disabled && !readonly}
				<button
					disabled={isLoading}
					type="button"
					onclick={() => removeInputSelectedItem(id)}
					class="slc-input hover:bg-surface-400/50 focus:bg-surface-500/50 cursor-pointer rounded-full p-2 outline-none"
					aria-label="{label} kaldır"
				>
					{#if isLoading}
						<LoadingSvg />
					{:else}
						<svg class="h-4 w-4" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					{/if}
				</button>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet list()}
	{@const isLoading = selectedListPromise.loading}
	{@const isEmpty = multiple ? value.length === 0 : value === ''}
	{@const listItems = (multiple ? value : [value]) as string[]}
	<output class="mt-1 flex flex-col gap-0 rounded-sm {defaultClasses}">
		<div class="border-surface-300 max-h-80 overflow-y-auto" class:border-t={inform ? true : isEmpty ? false : true}>
			{#if !isEmpty}
				{#if isLoading}
					{#each listItems as item, i (i)}
						{@render listItem({ id: item, label: item, isLoading })}
					{/each}
				{:else}
					{#each listItems as item, i (i)}
						{@render listItem({ id: item, label: context.itemDetailCache.get(item)?.label ?? 'no data', isLoading })}
					{/each}
				{/if}
			{/if}
		</div>
		<div class="border-surface-300 group/btn px-1 pt-1" class:border-t={!isEmpty}>
			<button
				disabled={isLoading || disabled}
				type="button"
				{id}
				onclick={pickerOpen}
				class="slc-input group-hover/btn:bg-surface-400/50 focus:bg-surface-500/50 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md p-1 text-start text-sm font-bold outline-none"
				{@attach watchValueChange}
				tabindex={disabled || readonly ? -1 : 0}
			>
				{#if isLoading}
					<LoadingSvg />
				{:else}
					<svg class="h-4 w-4" stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				{/if}

				<span>{label || 'Kayıt seçiciyi aç'}</span>
			</button>
		</div>
	</output>
{/snippet}

{@render list()}

<dialog
	style="--confirm-animation-duration: {animationDuration / 1000}s"
	{closedby}
	{@attach dialogEvents}
	class="bg-surface-50 shadow-surface-400 m-auto w-11/12 max-w-lg rounded-md shadow-md"
	bind:this={dialog}
	class:closing={isClosing}
	{@attach focustrap}
	{@attach portal}
>
	{#if isOpen}
		<RelationDialogContent {hide} {multiple} {yes} {no} />
	{/if}
</dialog>

<style>
	/* BEGIN Base Dialog Style */
	dialog {
		opacity: 0;
	}

	dialog::backdrop {
		background-color: var(--color-surface-300);
		opacity: 0;
	}

	dialog[open] {
		animation: dialog-enter-from-bottom var(--confirm-animation-duration) ease-out forwards;
	}
	dialog[open]::backdrop {
		animation: backdrop-fade-in var(--confirm-animation-duration) ease-out forwards;
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
		}
		dialog[open]::backdrop {
			opacity: 0;
		}
	}

	dialog[open].closing {
		animation: dialog-exit-to-bottom var(--confirm-animation-duration) ease-out forwards;
	}
	dialog[open].closing::backdrop {
		animation: backdrop-fade-out var(--confirm-animation-duration) ease-out forwards;
	}

	@keyframes dialog-enter-from-bottom {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes dialog-exit-to-bottom {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	@keyframes backdrop-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.5;
		}
	}

	@keyframes backdrop-fade-out {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 0;
		}
	}
	/* END Base Dialog Style */
</style>
