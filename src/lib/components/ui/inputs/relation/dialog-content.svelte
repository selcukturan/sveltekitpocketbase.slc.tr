<script lang="ts" generics="Tmultiple extends boolean = false">
	import { inputClasses } from '../common.js';
	import { Button } from '#lib/components/ui/inputs/index.js';
	import { getRelationList } from '#lib/remotes/relations.remote.js';
	import { untrack } from 'svelte';
	import type { RelationValueTypeChoice, RelationDialogContentPropsType } from '../type.js';
	import { getRelationInputsContext } from './context.svelte.js';
	import LoadingSvg from './loading-svg.svelte';

	let { multiple = false as Tmultiple, yes = 'Seçimi Kaydet', no = 'İptal', hide }: RelationDialogContentPropsType<Tmultiple> = $props();

	const context = getRelationInputsContext<Tmultiple>();

	function handleToggle(item: Record<string, string>) {
		const isSelected = Array.isArray(context.pickerValue) ? context.pickerValue.includes(item.id) : context.pickerValue === item.id;

		context.itemDetailCache.set(item.id, item);

		if (Array.isArray(context.pickerValue)) {
			const newSelection = isSelected ? context.pickerValue.filter((id) => id !== item.id) : [...context.pickerValue, item.id];
			context.pickerValue = newSelection as RelationValueTypeChoice<Tmultiple>;
		} else {
			const newSelection = isSelected ? '' : item.id;
			context.pickerValue = newSelection as RelationValueTypeChoice<Tmultiple>;
		}
	}

	function removePickerSelectedItem(idToRemove: string) {
		if (multiple && Array.isArray(context.pickerValue)) {
			context.pickerValue = context.pickerValue.filter((id) => id !== idToRemove) as RelationValueTypeChoice<Tmultiple>;
		} else if (!multiple && context.pickerValue === idToRemove) {
			context.pickerValue = '' as RelationValueTypeChoice<Tmultiple>;
		}
	}

	let relationListPromise = $derived(getRelationList(context.pickerParams));
	let isLoading = $derived(relationListPromise.loading);
	let currentData = $state<typeof relationListPromise.current>();
	let items = $derived(currentData?.items ?? []);
	const watchCurrentChanged = () => {
		const query = relationListPromise;
		const current = query?.current;

		return untrack(() => {
			if (query && query.ready && current) {
				currentData = current;
			}
		});
	};
</script>

{#snippet circleCheck()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-circle-check preview-icon"><circle cx="12" cy="12" r="10" /><path d="m16 9-5.5 5.5L8 12" /></svg
	>
{/snippet}

{#snippet circle()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-circle preview-icon"><circle cx="12" cy="12" r="10" /></svg
	>
{/snippet}

{#snippet square()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-square preview-icon"><rect width="18" height="18" x="3" y="3" rx="2" /></svg
	>
{/snippet}

{#snippet squareCheck()}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-square-check preview-icon"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m16 9-5.5 5.5L8 12" /></svg
	>
{/snippet}

<div class="flex flex-col gap-3" {@attach watchCurrentChanged}>
	<!-- input -->
	<div class="px-3 pt-3">
		<input
			value={context.pickerParams.search}
			type="text"
			placeholder="Ara..."
			class="{inputClasses.base} {inputClasses.variants.default} {inputClasses.sizes.md}"
			onkeydown={(e) => {
				if (e.key === 'Enter' && !isLoading) {
					e.preventDefault();
					const target = e.target as HTMLInputElement;
					context.pickerParams = { ...context.pickerParams, search: target.value, timestamp: new Date().getTime() };
				}
			}}
		/>
	</div>
	<!-- all records -->
	<div class="px-3">
		<p class="mb-2 text-xs font-semibold tracking-wider">Kayıtlar</p>
		<div class="bg-surface-200 border-surface-300 relative flex h-60 flex-col gap-2 overflow-y-auto rounded-md border p-2">
			{#if isLoading}
				<div class="bg-surface-300/50 absolute inset-0 flex items-center justify-center">
					<div class="flex items-center gap-2">
						<LoadingSvg />
						<span>Lütfen bekleyin...</span>
					</div>
				</div>
			{/if}
			{#each items as item, idx (idx)}
				{#if typeof item.id === 'string'}
					{@const isMultiple = Array.isArray(context.pickerValue)}
					{@const isRadio = !isMultiple}
					{@const isSelected = isMultiple ? context.pickerValue.includes(item.id) : context.pickerValue === item.id}
					<button
						type="button"
						aria-checked={isSelected}
						role={isRadio ? 'radio' : 'checkbox'}
						onclick={() => handleToggle(item)}
						class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 select-none {isSelected
							? 'bg-success-400/90 hover:bg-success-400/70'
							: 'bg-surface-400/90 hover:bg-surface-400/60'}"
					>
						{#if isRadio}
							{#if isSelected}
								{@render circleCheck()}
							{:else}
								{@render circle()}
							{/if}
						{:else}
							{#if isSelected}
								{@render squareCheck()}
							{:else}
								{@render square()}
							{/if}
						{/if}

						<span>{item.label}</span>
					</button>
				{/if}
			{/each}
		</div>
	</div>

	<!-- selected records -->
	{#if true}
		<!-- {@const listItems = (multiple ? context.pickerValue : [context.pickerValue]) as string[]} -->
		{@const listItems = (Array.isArray(context.pickerValue) ? [...context.pickerValue].reverse() : context.pickerValue ? [context.pickerValue] : []) as string[]}
		{@const isEmpty = listItems.length === 0}

		<div class="px-3">
			<p class="mb-2 text-xs font-semibold tracking-wider">Seçilen Kayıtlar</p>
			<div tabindex="-1" class="bg-surface-200 border-surface-300 flex h-12 items-center gap-2 overflow-x-auto overflow-y-hidden rounded-md border p-1">
				{#if !isEmpty}
					{#each listItems as item, i (i)}
						<div
							class="bg-success-100 border-success-600 text-success-800 inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs whitespace-nowrap select-none"
						>
							<span>{context.itemDetailCache.get(item)?.label ?? item}</span>
							<button
								type="button"
								tabindex="-1"
								onclick={() => removePickerSelectedItem(item)}
								class="text-success-500 hover:text-success-800 ml-1 cursor-pointer font-bold"
							>
								✕
							</button>
						</div>
					{/each}
				{:else}
					<p class="text-surface-400 text-sm italic">Seçili kayıt yok.</p>
				{/if}
			</div>
		</div>
	{/if}

	<!-- actions -->
	<div class="bg-surface-100 border-surface-200 flex items-center justify-between gap-2 border-t p-3">
		<Button label={no} onclick={() => hide('no button clicked', false)} variant="ghost" color="surface" />

		<Button label={yes} variant="filled" color="surface" onclick={() => hide('yes button clicked', true)} />
	</div>
</div>
