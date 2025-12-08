<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { watch } from 'runed';

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

	// ######################## VARIABLES ###############################################################################################
	let inputValue = $state(0);
	let isOnInput = false;
	const separator = (1.1).toLocaleString().replace(/\d/g, '');

	// ## BEGIN value logic ###############################################################################
	const onInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		target.setCustomValidity('');
		const newValue = Number(target.value);
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
				inputValue = currValue;
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
	// ## END issues view logic ##############################################################################

	let inputAttributes = $derived(field ? field.as('number') : { type: 'number' });
</script>

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
