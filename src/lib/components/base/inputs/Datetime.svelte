<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { RemoteFormField } from '@sveltejs/kit';
	import { formatDatetimeIsoToInput, parseDatetimeInputToIso } from '$lib/utils/input-helper';
	import { watch } from 'runed';
	import Popup from './Popup.svelte';
	import { getFormInputsContext } from './context.svelte';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'type' | 'id' | 'value' | 'name' | 'oninput' | 'onchange'> & {
		value?: string;
		label?: string;
		oninput?: ({ event, newValue }: { event: Event; newValue: string }) => void;
		onchange?: ({ event, newValue }: { event: Event; newValue: string }) => void;
		field: RemoteFormField<string>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), label, oninput, onchange, field, class: classes, ...rest }: Props = $props();
	const context = getFormInputsContext();
	// ######################## VARIABLES ###############################################################################################
	let isOnInput = false; // `oninput` ile değiştirildi mi?
	let inputValue = $state('');

	const attributes = $derived(field.as('datetime-local'));
	const issues = $derived(field.issues() ?? []);

	// ## BEGIN value logic ###############################################################################
	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		// inputValue = input value burada değişti (target.value)
		field.set(target.value); // field value burada değişti (target.value)

		const newBindValue = parseDatetimeInputToIso(target.value);
		if (newBindValue !== value) {
			isOnInput = true;
			value = newBindValue;
		}
		oninput?.({ event, newValue: newBindValue });
		context.validate?.();
	};
	// `value`, bileşen dışından `prop` ile değiştiriliyorsa `input` değeri ayarlanır.
	// `value`, bileşen içinden `oninput` ile değiştiriliyorsa `input` değeri ayarlanmaz.

	watch(
		() => value,
		(currValue) => {
			if (isOnInput) {
				isOnInput = false;
				return;
			} else {
				const newInputValue = formatDatetimeIsoToInput(currValue);
				inputValue = newInputValue; // input value burada değişti (newInputValue)
				field.set(newInputValue); // field value burada değişti (newInputValue)
			}
		}
	);
	// ## END value logic ###############################################################################

	// ## BEGIN input change ############################################################################
	const onChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const newValue = parseDatetimeInputToIso(target.value);
		onchange?.({ event, newValue });
	};
	// ## END input change ##############################################################################
</script>

<div style:position="relative">
	<label>
		<h2>{label}</h2>
		<input
			{...attributes}
			{...rest}
			id={attributes.name}
			value={inputValue}
			oninput={onInput}
			onchange={onChange}
			class={classes}
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
