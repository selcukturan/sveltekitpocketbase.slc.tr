<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Popup from './Popup.svelte';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value'> & {
		value?: Date | null;
		required?: boolean;
		errors?: string[];
		constraints?: { required: boolean };
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(), class: classes, errors, constraints = { required: false }, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputElement: HTMLInputElement;
	// ######################## UTILS ###################################################################################################
	const pad = (number: number, size: number = 2): string => String(number).padStart(size, '0');

	const stringToDate = (val: string): Date | null => {
		if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return null;
		const date = new Date(val);
		return isNaN(date.getTime()) ? null : date;
	};

	const dateToString = (val?: Date | null): string => {
		if (val == null) return '';
		const year = pad(val.getFullYear(), 4);
		const month = pad(val.getMonth() + 1);
		const day = pad(val.getDate());
		const hour = pad(val.getHours());
		const minute = pad(val.getMinutes());
		return `${year}-${month}-${day}T${hour}:${minute}`;
	};
	// ######################## MANAGE VALUE ############################################################################################
	const oninput = () => {
		const rawValue = inputElement.value;
		if (rawValue === '') {
			value = constraints.required ? undefined : null;
		} else {
			value = stringToDate(rawValue);
		}
	};

	const setInputValueIfChanged = (newValue: string) => {
		if (inputElement.value !== newValue) {
			inputElement.value = newValue;
		}
	};

	$effect(() => {
		setInputValueIfChanged(dateToString(value));
	});
</script>

<div style:display="contents">
	<input type="datetime-local" bind:this={inputElement} {oninput} class={classes} {...attributes} />
	<Popup show={errors ? true : false}>{errors}</Popup>
</div>
