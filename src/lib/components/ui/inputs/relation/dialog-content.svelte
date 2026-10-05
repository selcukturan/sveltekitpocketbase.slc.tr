<script lang="ts" generics="Tmultiple extends boolean = false">
	import { inputClasses } from '../common.js';
	import { Button } from '#lib/components/ui/inputs/index.js';
	import { getRelationList } from '#lib/remotes/relations.remote.js';
	import { untrack } from 'svelte';
	import type { RelationValueTypeChoice, RelationResolveData, RelationDialogContentPropsType } from '../type.js';
	import { getRelationInputsContext } from './context.svelte.js';
	import LoadingSvg from './loading-svg.svelte';

	let { multiple = false as Tmultiple, yes = 'Seçimi Kaydet', no = 'İptal', hide }: RelationDialogContentPropsType<Tmultiple> = $props();

	const context = getRelationInputsContext<Tmultiple>();

	// let pickerSearch = $state.raw({ search: defaultSearch, timestamp: new Date().getTime() });

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
	let currentData = $state<typeof relationListPromise.current>(); // watchCurrentChanged ile değişir
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
	{#snippet loading()}

	{/snippet}

	<!-- all records -->
	<div class="px-3">
		<p class="mb-2 text-xs font-semibold tracking-wider">Kayıtlar</p>
		<div class="bg-surface-200 border-surface-300 relative flex h-60 flex-col gap-1.5 overflow-y-auto rounded-md border p-1">
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
						class="w-full rounded-md text-left"
					>
						<div
							class="flex items-center justify-between rounded-md border p-2.5 transition-all duration-150 {isSelected
								? 'bg-primary-50 border-primary-500 text-primary-900'
								: 'bg-surface-200 hover:bg-surface-300 text-surface-800 border-transparent'}"
						>
							<span>{item.label}</span>
							<span class="indicator text-primary-600 font-bold">{isSelected ? '✓' : ''}</span>
						</div>
					</button>
				{/if}
			{/each}
		</div>
	</div>

	<!-- selected records -->
	{#if true}
		{@const isEmpty = multiple ? context.pickerValue.length === 0 : context.pickerValue === ''}
		{@const listItems = (multiple ? context.pickerValue : [context.pickerValue]) as string[]}

		<div class="px-3">
			<p class="mb-2 text-xs font-semibold tracking-wider">Seçilen Kayıtlar</p>
			<div class="bg-surface-200 border-surface-300 flex h-10 flex-wrap items-center gap-1.5 rounded-md border p-1">
				{#if !isEmpty}
					{#each listItems as item, i (i)}
						<div class="bg-primary-50 border-primary-200 text-primary-800 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs">
							<span>{context.itemDetailCache.get(item)?.label ?? item}</span>
							<button type="button" tabindex="-1" onclick={() => removePickerSelectedItem(item)} class="text-primary-500 hover:text-primary-800 ml-1 font-bold">
								✕
							</button>
						</div>
					{/each}
					{#if context.pickerValue === '' || (Array.isArray(context.pickerValue) && context.pickerValue.length === 0)}
						<p class="text-surface-400 text-sm italic">Seçili kayıt yok.</p>
					{/if}
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
