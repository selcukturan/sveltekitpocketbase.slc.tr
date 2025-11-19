<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import { watch } from 'runed';
	import { formatDatetimeIsoToInput, parseDatetimeInputToIso } from '$lib/utils/input-helper';
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value' | 'oninput' | 'onchange'> & {
		value?: string;
		label?: string;
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
		field?: RemoteFormField<string>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), label, oninput, onchange, field, class: classes, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################
	let inputValue = $state('');
	let isValid = $state(true);
	let isBadInput = $state(false);

	// ## BEGIN value logic ###############################################################################
	const onInput = (e: Event) => {
		const target = e.target as HTMLInputElement;

		isValid = target.validity.valid; // 31.11.2025 -> valid = false
		isBadInput = target.validity.badInput; // 31.11.2025 -> badInput = true

		value = parseDatetimeInputToIso(target.value); // trigger watch value
		oninput?.(value);
	};
	watch(
		() => value,
		(newBindValue) => {
			if (isBadInput) {
				isBadInput = false;
				return;
			}
			inputValue = formatDatetimeIsoToInput(newBindValue);
		}
	);
	// ## END value logic ###############################################################################

	// ## BEGIN input change ############################################################################
	const onChange = (e: Event) => {
		const value = parseDatetimeInputToIso((e.target as HTMLInputElement).value);
		onchange?.(value);
	};
	// ## END input change ##############################################################################
</script>

<label>
	<h2>{label}</h2>
	<input
		{...(() => {
			if (field) return field.as('datetime-local');
			return { type: 'datetime-local' };
		})()}
		value={inputValue}
		oninput={onInput}
		onchange={onChange}
		class={classes}
		{...attributes}
	/>

	{#each field?.issues() ?? [] as issue}
		<p class="issue">{issue.message}</p>
	{/each}
</label>
<p>in: {value}</p>
