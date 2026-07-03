<script lang="ts" generics="Tmultiple extends boolean = false">
	import { focustrap, portal } from '$lib/attachments';
	import { onMount, tick, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import { areEqual } from '$lib/utils/common';
	import { inputClasses } from './common';

	import { getRelationList, getMultipleRelationSelectedList, getSingleRelationSelectedList } from '$lib/remotes/relations.remote';
	import { SvelteMap } from 'svelte/reactivity';
	import type { RelationValueTypeChoice, RelationResolveData, RelationPropsType, RelationValueChangeArgs } from './type';

	let {
		collection,
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as RelationValueTypeChoice<Tmultiple>),
		message = 'Onaylıyor musunuz?',
		yes = 'Evet',
		no = 'Hayır',
		class: classes = '',
		id,
		name,
		label = '',
		animationDuration = 150,
		defaultSearch = '',
		disabled = false,
		readonly = false,
		onValueChange
	}: RelationPropsType<Tmultiple> = $props();

	const componentId = $props.id();

	// svelte-ignore state_referenced_locally
	let pickerSearchString = $state(defaultSearch);
	let pickerAnswer = $state('init');
	let pickerSelected = $state<string | string[]>(value);
	const pickerSelectedItemCache = new SvelteMap<string, Record<string, string>>();

	let dialog: HTMLDialogElement | null = $state(null);
	let isOpen = $state(false);
	let resolvePromise: ((data: RelationResolveData) => void) | null = null;
	let isClosing = $state(false);
	let closedby = $state<'any' | 'none' | 'closerequest' | null | undefined>('any');

	const labelFor = $derived(`slc_${componentId}${name || ''}${id || ''}_relation_picker_button`);

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
	const hide = async (log: string, confirm: boolean) => {
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

	function handleToggle(item: Record<string, string>) {
		const isSelected = Array.isArray(pickerSelected) ? pickerSelected.includes(item.id) : pickerSelected === item.id;
		if (!pickerSelectedItemCache.has(item.id)) pickerSelectedItemCache.set(item.id, { label: item.label });

		if (Array.isArray(pickerSelected)) {
			const newSelection = isSelected ? pickerSelected.filter((id) => id !== item.id) : [...pickerSelected, item.id];
			pickerSelected = newSelection;
		} else {
			const newSelection = isSelected ? '' : item.id;
			pickerSelected = newSelection;
		}
	}

	function handleRemoveRelation(idToRemove: string) {
		if (disabled || readonly) return;
		if (multiple && Array.isArray(value)) {
			value = value.filter((id) => id !== idToRemove) as RelationValueTypeChoice<Tmultiple>;
		} else if (!multiple && value === idToRemove) {
			value = '' as RelationValueTypeChoice<Tmultiple>;
		}
	}

	async function handlePickerOpen() {
		if (disabled || readonly) return;
		pickerAnswer = 'waiting';
		pickerSelected = value;
		pickerSearchString = '';

		const { confirm } = await show();

		if (confirm) {
			pickerAnswer = 'true';
			if (multiple && Array.isArray(pickerSelected)) {
				const newValue = pickerSelected as string[];
				value = newValue as RelationValueTypeChoice<Tmultiple>;
			} else if (!multiple && typeof pickerSelected === 'string') {
				const newValue = pickerSelected as string;
				value = newValue as RelationValueTypeChoice<Tmultiple>;
			}
			await tick();
		} else {
			pickerAnswer = 'false';
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

	onMount(() => {
		pickerSelected = value;
	});

	// ######### BEGIN: preventDefaultClick handlers ###########
	const preventDefaultClick = (node: HTMLElement) => {
		return on(node, 'click', (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
		});
	};
	// ######### END: preventDefaultClick handlers #############
</script>

<div class="relative block w-full">
	<button
		type="button"
		id={labelFor}
		onclick={handlePickerOpen}
		class="slc-input inline-flex w-full items-center justify-between text-start disabled:cursor-not-allowed disabled:opacity-50 {inputClasses.variants
			.default} {inputClasses.sizes.md} {!disabled && !readonly ? 'cursor-pointer' : 'cursor-default'} {classes}"
		{@attach watchValueChange}
		{disabled}
		tabindex={disabled || readonly ? -1 : 0}
	>
		<span>{label || 'Seçim Yapın'}</span>
		<svg class="w-4 h-4 text-surface-500" stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
		</svg>
	</button>
</div>

{#if multiple && Array.isArray(value) && value.length > 0}
	{@const relationList = await getMultipleRelationSelectedList({ ids: value, collection })}
	<div class="flex flex-wrap gap-1.5 mt-2" {@attach preventDefaultClick}>
		{#each relationList as item, idx (idx)}
			<div
				class="inline-flex items-center gap-1.5 bg-surface-200 border border-surface-300 text-surface-800 text-sm py-1 rounded-md {!disabled && !readonly
					? 'pl-2.5 pr-1'
					: 'px-2.5'}"
			>
				<span>{item.label}</span>
				{#if !disabled && !readonly}
					<button
						type="button"
						onclick={() => handleRemoveRelation(item.id)}
						class="text-surface-500 hover:text-error-600 transition-colors p-0.5 rounded hover:bg-surface-300"
						aria-label="{item.label} kaldır"
					>
						<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				{/if}
			</div>
		{/each}
	</div>
{:else if typeof value === 'string' && value && collection}
	{@const relationList = await getSingleRelationSelectedList({ id: value, collection })}
	<div class="flex flex-wrap gap-1.5 mt-2" {@attach preventDefaultClick}>
		{#each relationList as item, idx (idx)}
			<div
				class="inline-flex items-center gap-1.5 bg-surface-200 border border-surface-300 text-surface-800 text-sm py-1 rounded-md {!disabled && !readonly
					? 'pl-2.5 pr-1'
					: 'px-2.5'}"
			>
				<span>{item.label}</span>
				{#if !disabled && !readonly}
					<button
						type="button"
						onclick={() => handleRemoveRelation(item.id)}
						class="text-surface-500 hover:text-error-600 transition-colors p-0.5 rounded hover:bg-surface-300"
						aria-label="{item.label} kaldır"
					>
						<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<dialog
	style="--confirm-animation-duration: {animationDuration / 1000}s"
	{closedby}
	{@attach dialogEvents}
	class="bg-surface-300 m-auto w-11/12 max-w-lg rounded-lg p-0 shadow-lg border border-surface-200"
	bind:this={dialog}
	class:closing={isClosing}
	{@attach focustrap}
	{@attach portal}
>
	<div class="dialog-content flex flex-col gap-4">
		<p class="text-lg font-semibold text-surface-900">{message}</p>

		<div class="relative">
			<input
				value={pickerSearchString}
				type="text"
				placeholder="Ara..."
				class="{inputClasses.base} {inputClasses.variants.default} {inputClasses.sizes.md}"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						const target = e.target as HTMLInputElement;
						pickerSearchString = target.value;
					}
				}}
			/>
		</div>

		<div class="max-h-60 overflow-y-auto flex flex-col gap-1.5 p-1 bg-surface-100 rounded-md border border-surface-200">
			{#if isOpen}
				{@const pickerData = await getRelationList({ search: pickerSearchString, collection })}
				{#each pickerData?.items ?? [] as item, idx (idx)}
					{#if typeof item.id === 'string'}
						{@const isMultiple = Array.isArray(pickerSelected)}
						{@const isRadio = !isMultiple}
						{@const isSelected = isMultiple ? pickerSelected.includes(item.id) : pickerSelected === item.id}
						<button
							type="button"
							aria-checked={isSelected}
							role={isRadio ? 'radio' : 'checkbox'}
							onclick={() => handleToggle(item)}
							class="w-full text-left outline-none focus:ring-2 focus:ring-primary-500/20 rounded-md"
						>
							<div
								class="flex items-center justify-between p-2.5 rounded-md border transition-all duration-150 {isSelected
									? 'bg-primary-50 border-primary-500 text-primary-900'
									: 'bg-surface-200 hover:bg-surface-300 border-transparent text-surface-800'}"
							>
								<span>{item.label}</span>
								<span class="indicator text-primary-600 font-bold">{isSelected ? '✓' : ''}</span>
							</div>
						</button>
					{/if}
				{/each}
			{/if}
		</div>

		{#if isOpen}
			<div class="border-t border-surface-200 pt-3">
				<p class="text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Seçilen Kayıtlar</p>
				<div class="flex flex-wrap gap-1.5 min-h-8 items-center">
					{#if multiple && Array.isArray(pickerSelected) && collection}
						{@const relationList = await getMultipleRelationSelectedList({ ids: pickerSelected, collection })}
						{#each relationList as item, idx (idx)}
							<div class="inline-flex items-center gap-1 bg-primary-50 border border-primary-200 text-primary-800 text-xs px-2.5 py-1 rounded-full">
								<span>{item.label}</span>
								<button type="button" onclick={() => handleToggle(item)} class="text-primary-500 hover:text-primary-800 font-bold ml-1 outline-none">✕</button>
							</div>
						{/each}
					{:else if typeof pickerSelected === 'string' && pickerSelected && collection}
						{@const relationList = await getSingleRelationSelectedList({ id: pickerSelected, collection })}
						{#each relationList as item, idx (idx)}
							<div class="inline-flex items-center gap-1 bg-primary-50 border border-primary-200 text-primary-800 text-xs px-2.5 py-1 rounded-full">
								<span>{item.label}</span>
								<button type="button" onclick={() => handleToggle(item)} class="text-primary-500 hover:text-primary-800 font-bold ml-1 outline-none">✕</button>
							</div>
						{/each}
					{/if}
					{#if pickerSelected === '' || (Array.isArray(pickerSelected) && pickerSelected.length === 0)}
						<p class="text-sm text-surface-400 italic">Seçili kayıt yok.</p>
					{/if}
				</div>
			</div>
		{/if}

		<div class="flex justify-end gap-2 mt-2 border-t border-surface-200 pt-3">
			<button
				type="button"
				onclick={() => hide('no button clicked', false)}
				class="px-4 py-2 border border-surface-300 rounded-md text-surface-700 bg-white hover:bg-surface-50 active:scale-[0.98] transition-all duration-150 outline-none cursor-pointer"
			>
				{no}
			</button>
			<button
				type="button"
				onclick={() => hide('yes button clicked', true)}
				class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md active:scale-[0.98] transition-all duration-150 outline-none cursor-pointer"
			>
				{yes}
			</button>
		</div>
	</div>
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

	.dialog-content {
		padding: 1.5rem;
	}
</style>
