<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formatDateIsoToInput, parseDateInputToIso } from '$lib/utils/input-helper';
	import { watch } from 'runed';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value' | 'oninput' | 'onchange'> & {
		value?: string;
		label?: string;
		oninput?: (params: { event: Event; value: string }) => void;
		onchange?: (params: { event: Event; value: string }) => void;
		field?: RemoteFormField<string>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), label, oninput, onchange, field, class: classes, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputRef: HTMLInputElement | undefined = $state(undefined);
	let inputValue = $state('');
	let isOnInput = false;

	// ## BEGIN value logic ###############################################################################
	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const newValue = parseDateInputToIso(target.value);
		if (newValue !== value) {
			isOnInput = true;
			value = newValue;
			oninput?.({ event, value });
		}
	};
	watch(
		() => value,
		(currValue) => {
			if (isOnInput) {
				isOnInput = false;
				return;
			} else {
				inputValue = formatDateIsoToInput(currValue);
			}
		}
	);
	// ## END value logic ###############################################################################

	// ## BEGIN input change ############################################################################
	const onChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = parseDateInputToIso(target.value);
		onchange?.({ event, value });
	};
	// ## END input change ##############################################################################

	let inputAttributes = $derived(field ? field.as('date') : { type: 'date' });
</script>

<label>
	<h2>{label}</h2>
	<input
		bind:this={inputRef}
		{...inputAttributes}
		value={inputValue}
		oninput={onInput}
		onchange={onChange}
		class={classes}
		{...attributes}
	/>

	<!-- Custom Picker Trigger -->
	<button
		type="button"
		aria-label="Open Date Picker"
		aria-labelledby="datetime-label"
		onclick={() => inputRef?.showPicker()}
		class="text-surface-500 hover:text-surface-900 cursor-pointer"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-calendar"
		>
			<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
		</svg>
	</button>

	{#each field?.issues() ?? [] as issue}
		<p class="issue">{issue.message}</p>
	{/each}
</label>

<style>
	/* Hide native indicator but keep functionality via custom button */
	input::-webkit-calendar-picker-indicator {
		display: none;
		-webkit-appearance: none;
	}
</style>
