<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formatDateIsoToInput, parseDateInputToIso } from '$lib/utils/input-helper';
	import { watch } from 'runed';
	import Popup from './Popup.svelte';
	import { getFormInputsContext } from './context.svelte';
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
	const context = getFormInputsContext();
	// ######################## VARIABLES ###############################################################################################
	let isOnInput = false;
	let inputValue = $state('');
	let inputElement: HTMLInputElement | undefined = $state();
	const issues = $derived(field?.issues() ?? []);
	const inputAttributes = $derived(field ? field.as('date') : { type: 'date' });

	// ## BEGIN value logic ###############################################################################
	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;

		const newValue = parseDateInputToIso(target.value);
		if (newValue !== value) {
			isOnInput = true;
			value = newValue;
			oninput?.({ event, value });
		}
		context.validate?.({ preflightOnly: true });
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
</script>

<div style:position="relative">
	<label>
		<h2>{label}</h2>
		<input
			bind:this={inputElement}
			{...inputAttributes}
			value={inputValue}
			oninput={onInput}
			onchange={onChange}
			class={classes}
			{...attributes}
		/>
	</label>
	<Popup {issues} />
</div>

<style>
	input::-webkit-calendar-picker-indicator {
		cursor: pointer;
		border-radius: 4px;
		filter: invert(0.3);
	}
</style>
