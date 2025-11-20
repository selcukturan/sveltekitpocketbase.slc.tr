<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
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
		const newValue = target.value;
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
		const value = target.value;
		onchange?.({ event, value });
	};
	// ## END input change ##############################################################################

	let inputAttributes = $derived(field ? field.as('text') : { type: 'text' });
</script>

<label>
	<h2>{label}</h2>
	<input {...inputAttributes} value={inputValue} oninput={onInput} onchange={onChange} class={classes} {...attributes} />

	{#each field?.issues() ?? [] as issue}
		<p class="issue">{issue.message}</p>
	{/each}
</label>
