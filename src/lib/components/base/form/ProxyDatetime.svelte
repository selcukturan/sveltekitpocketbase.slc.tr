<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value'> & { value: string };
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), class: classes, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputValue = $state(value ? value.slice(0, 16) : ''); // initial value
	// ######################## PROXY ###################################################################################################
	const proxy = {
		get value() {
			return inputValue;
		},
		set value(newValue) {
			inputValue = newValue;
			value = newValue ? `${newValue.replace('T', ' ')}:00.000Z` : '';
		}
	};
</script>

<input type="datetime-local" bind:value={proxy.value} class={classes} {...attributes} />
