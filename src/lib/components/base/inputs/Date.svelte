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
	let inputValue = $state('');
	let isOnInput = false;

	// ## BEGIN value logic ###############################################################################
	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;

		target.setCustomValidity('');

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

	// ## BEGIN issues view logic ############################################################################
	let inputElement: HTMLInputElement | undefined = $state();
	const issues = $derived(field?.issues() ?? []);
	$effect(() => {
		if (!inputElement) return;
		if (issues.length > 0) {
			inputElement.setCustomValidity(issues[0].message);
			inputElement.reportValidity();
		} else {
			inputElement.setCustomValidity('');
		}
	});
	// ## END issues view logic ###########################################################################

	let inputAttributes = $derived(field ? field.as('date') : { type: 'date' });
</script>

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
