<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value'> & { value: number };
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(0), class: classes, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputValue = $state(value ? value : 0); // initial value
	// ######################## PROXY ###################################################################################################
	const proxy = {
		get value() {
			return inputValue;
		},
		set value(newValue) {
			inputValue = newValue;
			value = newValue ? newValue : 0;
		}
	};
</script>

<input type="number" bind:value={proxy.value} step="0.0001" class={classes} {...attributes} />

<style>
	/* Webkit tabanlı tarayıcılar için (Chrome, Safari, Edge, Opera) */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none; /* Okları gizle */
	}

	/* Firefox için */
	input[type='number'] {
		-moz-appearance: textfield; /* Firefox'ta okları gizle */
		appearance: textfield; /* Standart özellik */
	}
</style>
