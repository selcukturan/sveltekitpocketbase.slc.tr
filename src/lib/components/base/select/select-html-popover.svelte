<script lang="ts">
	import { tick } from 'svelte';
	import { randomString } from '$lib/utils/common';
	import type { HTMLInputAttributes } from 'svelte/elements';

	/**
	 * KISIT TARAYICI UYUMLULUĞU:
	 * HTML popover:
	 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover#browser_compatibility
	 * https://caniuse.com/?search=popover
	 *
	 * CSS anchor positioning:
	 * https://developer.mozilla.org/en-US/docs/Web/CSS/position-anchor
	 * https://caniuse.com/css-anchor-positioning
	 */
	type DataType = {
		value: string;
		label: string;
	};

	interface Props extends HTMLInputAttributes {
		value?: string;
		data?: DataType[];
		label?: string;
		class?: string;
		//************/
		popovertarget?: string;
		//************/
		errors?: string[];
	}

	let {
		value = $bindable(undefined),
		data,
		label,
		class: classes,
		size = undefined,
		errors,

		...attributes
	}: Props = $props();

	const uuid = `slc_${randomString(8).toLowerCase()}`;

	let myPopover: HTMLDivElement;
	const selectText = '-- Seçiniz --';

	/* $effect(() => {cntrts = constraints;}); */

	const handleSelectOnClick = async (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const target = e.currentTarget as HTMLButtonElement;
		const { slcselectvalue } = target.dataset;
		const val = slcselectvalue || '';
		value = val === '' ? undefined : val;
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
		{...attributes}
		class="{classes} bg-error-500 w-full"
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
			<div
				onclick={handleSelectOnClick}
				data-slcselectvalue=""
				class="hover:bg-surface-200 active:bg-surface-300 cursor-pointer rounded-md p-2 select-none"
			>
				{selectText}
			</div>
			{#if data}
				{#each data as item}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						onclick={handleSelectOnClick}
						data-slcselectvalue={item.value}
						class="hover:bg-surface-200 active:bg-surface-300 cursor-pointer rounded-md p-2 select-none"
					>
						{item.label}
					</div>
				{/each}
			{:else}
				<div class="cursor-pointer p-2 select-none">No data</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.slc-anchored-notice {
		inset: unset;
		position: absolute;
		margin-top: 5px;
		/*x*/
		position-try-fallbacks: flip-block;
		/* position-visibility: anchors-visible; */
		position-area: inline-end span-block-end;

		min-width: calc(anchor-size(width) * 1);
		max-height: 300px;
	}
</style>
