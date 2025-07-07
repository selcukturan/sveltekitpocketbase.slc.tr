<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value'> & { value: string };
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), class: classes, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputValue = value ? value.slice(0, 10) : ''; // initial value
	// ######################## PROXY ###################################################################################################
	const proxy = {
		get value() {
			return inputValue;
		},
		set value(newValue) {
			inputValue = newValue;
			value = newValue ? `${newValue} 00:00:00.000Z` : '';
		}
	};
</script>

<input type="date" bind:value={proxy.value} class={classes} {...attributes} />
