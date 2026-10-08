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

<div class="flex flex-col gap-1" {@attach watchCurrentChanged}>
	<!-- search record -->
	<div class="px-3 pt-3">
		<p class="pb-1 text-xs font-semibold tracking-wider">Kayıt Ara</p>
		<input
			value={context.pickerParams.search}
			type="text"
			placeholder="Ara..."
			class="{inputClasses.base} {inputClasses.variants.default} {inputClasses.sizes.md} border-surface-300! bg-surface-100!"
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
		<p class="pb-1 text-xs font-semibold tracking-wider">Tüm Kayıtlar</p>
		<div class="bg-surface-100 border-surface-300 relative flex h-48 flex-col overflow-y-auto rounded-md border">
			{#if isLoading}
				<div class="bg-surface-100/50 absolute inset-0 flex items-center justify-center">
					<div class="flex items-center gap-2">
						<LoadingSvg />
						<span>Lütfen bekleyin...</span>
					</div>
				</div>
			{/if}
			{#if items.length > 0}
				{#each items as item, idx (idx)}
					{#if typeof item.id === 'string'}
						{@const isMultiple = Array.isArray(context.pickerValue)}
						{@const isRadio = !isMultiple}
						{@const isSelected = isMultiple ? context.pickerValue.includes(item.id) : context.pickerValue === item.id}
						<div class="border-b-surface-300 hover:bg-surface-200/50 active:bg-surface-200 touch-manipulation border-b">
							<button
								type="button"
								aria-checked={isSelected}
								role={isRadio ? 'radio' : 'checkbox'}
								onclick={() => handleToggle(item)}
								class="flex w-full cursor-pointer touch-manipulation items-center gap-2 rounded-lg px-2.5 py-2 -outline-offset-5 select-none"
							>
								<span
									class="text-surface-50 border-surface-600 flex h-3.5 w-3.5 items-center justify-center border p-px {isRadio ? 'rounded-full' : 'rounded-sm'} {isSelected
										? 'bg-success-700! border-success-700!'
										: ''}"
								>
									{#if isSelected}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M20 6 9 17l-5-5" />
										</svg>
									{/if}
								</span>

								<span>{item.label}</span>
							</button>
						</div>
					{/if}
				{/each}
			{:else if !isLoading}
				<div class="bg-surface-100/50 absolute inset-0 flex items-center justify-center">
					<div class="flex items-center gap-2">
						<span>Gösterilecek kayıt yok.</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- selected records -->
	{#if true}
		{@const listItems = (Array.isArray(context.pickerValue) ? [...context.pickerValue].reverse() : context.pickerValue ? [context.pickerValue] : []) as string[]}
		{@const isEmpty = listItems.length === 0}

		<div class="px-3">
			<p class="pb-1 text-xs font-semibold tracking-wider">Seçilen Kayıtlar ({listItems.length})</p>
			<div tabindex="-1" class="bg-surface-100 border-surface-300 flex items-center gap-2 overflow-x-auto overflow-y-hidden rounded-md border p-2.5">
				{#if !isEmpty}
					{#each listItems as item, i (i)}
						<div
							class="bg-success-100 border-success-600 text-success-800 inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap select-none"
						>
							<span>{context.itemDetailCache.get(item)?.label ?? item}</span>
							<button
								type="button"
								tabindex="-1"
								onclick={() => removePickerSelectedItem(item)}
								class="text-success-800 hover:text-success-600 ml-1 cursor-pointer font-bold"
							>
								✕
							</button>
						</div>
					{/each}
				{:else}
					<p class="text-surface-400 border border-transparent py-0.5 text-xs font-bold whitespace-nowrap">Seçili kayıt yok.</p>
				{/if}
			</div>
		</div>
	{/if}

	<div class="bg-surface-100 inset-shadow-surface-200 mt-2 flex items-center justify-between border-t p-3 inset-shadow-sm">
		<Button label={no} onclick={() => hide('no button clicked', false)} variant="ghost" color="surface" />

		<Button label={yes} variant="filled" color="surface" onclick={() => hide('yes button clicked', true)} />
	</div>
</div>
