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
	import { Dialog } from '#lib/components/base/dialog/index.js';

	let {
		collection,
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as RelationValueTypeChoice<Tmultiple>),
		message = 'Onaylıyor musunuz?',
		yes = 'Seçimi Kaydet',
		no = 'Vazgeç',
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

	let dialog = $state<Dialog | null>(null);

	async function pickerOpen() {
		if (disabled || readonly || !dialog) return;
		// pickerAnswer = 'waiting';
		context.pickerValue = value;
		context.pickerParams = { collection, search: defaultSearch, timestamp: new Date().getTime() };

		const { confirm } = await dialog.show();

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
			? selectedListPromiseValue.length > 0
				? getMultipleRelationSelectedList({
						ids: selectedListPromiseValue as RelationValueTypeChoice<true>,
						collection,
						timestamp: selectedListPromiseTimestamp
					})
				: undefined
			: selectedListPromiseValue !== ''
				? getSingleRelationSelectedList({
						id: selectedListPromiseValue as RelationValueTypeChoice<false>,
						collection,
						timestamp: selectedListPromiseTimestamp
					})
				: undefined
	);
	const watchSelectedListPromise = () => selectedListPromise?.current?.forEach((item) => context.itemDetailCache.set(item.id, item));
	// ######### END: Initial Selected List #############

	const defaultClasses = $derived(!inform ? inputClasses.base + ' ' + inputClasses.variants[status] + ' ' + inputClasses.sizes[size] : '');
</script>

<div style:display="none" {@attach watchSelectedListPromise}>relation-component-state-watcher</div>

{#snippet listItem({ id, label, isLoading }: { id: string; label: string; isLoading: boolean })}
	<!-- list-item -->
	<div
		class="hover:bg-surface-300/50 border-surface-300 relative flex min-h-8 w-full items-center gap-2.5 border-t px-3 py-1.5 wrap-break-word outline-none first:border-t-0"
	>
		<!-- content -->
		<div class="flex w-full max-w-full min-w-0 items-center gap-2 select-text">
			{#if isLoading}
				<LoadingSvg />
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="text-surface-500 h-4 w-4 shrink-0"
					><path d="M20 6 9 17l-5-5" />
				</svg>
			{/if}
			<!-- label -->
			<span class="truncate text-sm">{label}</span>
		</div>
		<!-- action -->
		<div class="inline-flex shrink-0 items-center gap-2.5">
			{#if !disabled && !readonly}
				<button
					disabled={isLoading}
					type="button"
					onclick={() => removeInputSelectedItem(id)}
					class="slc-input hover:bg-surface-400/50 focus:bg-surface-500/50 cursor-pointer rounded-full p-1 outline-none"
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
	{@const isLoading = selectedListPromise?.loading ?? false}
	{@const listItems = (Array.isArray(value) ? [...value].reverse() : value ? [value] : []) as string[]}
	{@const isEmpty = listItems.length === 0}
	<output class="mt-1 flex flex-col gap-0 rounded-sm {defaultClasses}">
		<div class="border-surface-300 max-h-48 overflow-y-auto" class:border-t={inform ? true : isEmpty ? false : true}>
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

<Dialog
	bind:this={dialog}
	{animationDuration}
	{@attach focustrap}
	{@attach portal}
	class="bg-surface-50 shadow-surface-400 m-auto w-11/12 max-w-lg rounded-md shadow-2xl"
>
	{#if dialog}
		<RelationDialogContent hide={dialog.hide} {multiple} {yes} {no} />
	{/if}
</Dialog>
