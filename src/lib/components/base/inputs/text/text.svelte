<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import { watch } from 'runed';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value' | 'oninput' | 'onchange'> & {
		value?: string;
		label?: string;
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
		field: RemoteFormField<string>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), label, oninput, onchange, field, class: classes, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputValue = $state(parseInputValue(value)); // initial input value
	// ######################## PROXY ###################################################################################################

	function parseInputValue(raw: string) {
		// if (attributes.type !== 'number') return raw;
		// return raw != '' ? Number(raw) : null;
		return raw ? raw : '';
	}
	function parseBindValue(raw: string) {
		return raw ? raw : '';
	}

	watch(
		() => inputValue,
		(currValue, prevValue) => {
			console.log('watch', currValue, prevValue);
			value = parseBindValue(currValue);
			oninput?.(value);
		}
	);
</script>

<label>
	<h2>{label}</h2>
	<input
		{...field.as('text')}
		bind:value={inputValue}
		onchange={() => onchange?.(value)}
		class={classes}
		{...attributes}
	/>

	{#each field.issues() ?? [] as issue}
		<p class="issue">{issue.message}</p>
	{/each}
</label>
