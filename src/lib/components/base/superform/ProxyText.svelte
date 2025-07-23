<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value'> & { value: string };
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), class: classes, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputValue = $state(value ? value : ''); // initial value
	// ######################## PROXY ###################################################################################################
	const proxy = {
		get value() {
			return inputValue;
		},
		set value(newValue) {
			inputValue = newValue;
			value = newValue ? newValue : '';
		}
	};
</script>

<input type="text" bind:value={proxy.value} class={classes} {...attributes} />
