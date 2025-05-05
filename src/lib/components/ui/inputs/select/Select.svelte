<script lang="ts">
	import { tick } from 'svelte';
	import utils from '$lib/utils';
	import Popup from '../common/Popup.svelte';
	import type { Props } from './types';

	let { value = $bindable(undefined), data, label, class: classes, variant = undefined, size = undefined, errors, constraints, ...attributes }: Props = $props();

	const uuid = `slc_${utils.randomString(8).toLowerCase()}`;

	let myPopover: HTMLDivElement;
	const selectText = '-- Seçiniz --';
	const cntrts = constraints;
	/* $effect(() => {cntrts = constraints;}); */

	const handleSelectOnClick = async (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.currentTarget as HTMLButtonElement;
		const { slcselectvalue } = target.dataset;
		const val = slcselectvalue || '';
		value = cntrts?.required && val === '' ? undefined : val;
		await tick(); // DOM güncellemelerinin tamamlanmasını bekler
		myPopover.hidePopover();
	};
</script>

<section>
	<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
	<input
		type="button"
		style:anchor-name={`--anchor-${uuid}`}
		popovertarget={`s${uuid}`}
		value={value || selectText}
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...attributes}
		class={classes}
	/>
	<div
		id={`s${uuid}`}
		style:position-anchor={`--anchor-${uuid}`}
		style:top={`anchor(bottom)`}
		style:left={`anchor(left)`}
		popover=""
		bind:this={myPopover}
		class="slc-anchored-notice bg-surface-50 text-surface-950 rounded-md border"
	>
		<div class="flex flex-col">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div onclick={handleSelectOnClick} data-slcselectvalue="" class="hover:bg-surface-200 active:bg-surface-300 cursor-pointer rounded-md p-2 select-none">
				{selectText}
			</div>
			{#if data}
				{#each data as item}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div onclick={handleSelectOnClick} data-slcselectvalue={item.value} class="hover:bg-surface-200 active:bg-surface-300 cursor-pointer rounded-md p-2 select-none">
						{item.label}
					</div>
				{/each}
			{:else}
				<div class="cursor-pointer p-2 select-none">No data</div>
			{/if}
		</div>
	</div>
	<Popup show={errors ? true : false}>{errors}</Popup>
</section>

<style>
	.slc-anchored-notice {
		inset: unset;
		position: absolute;
		margin-top: 5px;
		position-try-options: flip-block;
		position-visibility: anchors-visible;
		min-width: calc(anchor-size(width) * 1);
		max-height: 300px;
	}
</style>
