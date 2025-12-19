<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { watch } from 'runed';
	import Popup from './Popup.svelte';
	import { getFormInputsContext } from './context.svelte';

	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value' | 'oninput' | 'onchange'> & {
		value?: number;
		label?: string;
		step?: string;
		oninput?: (params: { event: Event; value: number }) => void;
		onchange?: (params: { event: Event; value: number }) => void;
		field?: RemoteFormField<number>;
	};

	// ######################## PROPS ###################################################################################################
	let { value = $bindable(0), label, step = '1', oninput, onchange, field, class: classes, ...attributes }: Props = $props();

	const context = getFormInputsContext();

	// ######################## VARIABLES ###############################################################################################
	let isOnInput = false;
	let inputValue = $state(0);
	let inputElement: HTMLInputElement | undefined = $state();
	const separator = (1.1).toLocaleString().replace(/\d/g, '');
	const issues = $derived(field?.issues() ?? []);
	const inputAttributes = $derived(field ? field.as('number') : { type: 'number' });

	// ## BEGIN value logic ###############################################################################
	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const newValue = Number(target.value);
		if (newValue !== value) {
			isOnInput = true;
			value = newValue;
			oninput?.({ event, value });
		}
		context.validate?.();
	};
	watch(
		() => value,
		(currValue) => {
			if (isOnInput) {
				isOnInput = false;
				return;
			} else {
				inputValue = currValue;
				field?.set(currValue);
			}
		}
	);
	// ## END value logic ###############################################################################

	// ## BEGIN input change ############################################################################
	const onChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = Number(target.value);
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
			placeholder="123{step === '1' ? '' : separator}45"
			{step}
			value={inputValue}
			oninput={onInput}
			onchange={onChange}
			class={classes}
			{...attributes}
		/>
	</label>
	<Popup {issues} />
</div>
