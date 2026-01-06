<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { RemoteFormField } from '@sveltejs/kit';
	import { formatDatetimeIsoToInput, parseDatetimeInputToIso } from '$lib/utils/input-helper';
	import Field from './Field.svelte';
	import { getFormInputsContext } from './context.svelte';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<SvelteHTMLElements['input'], 'type' | 'id' | 'value' | 'name' | 'aria-invalid'> & {
		id?: string;
		value?: string;
		name?: string;
		'aria-invalid'?: SvelteHTMLElements['input']['aria-invalid'];
		field?: RemoteFormField<string>;
		label?: string;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), label, field, class: classes, id, name, 'aria-invalid': ariaInvalid, ...rest }: Props = $props();
	const context = getFormInputsContext();

	const attributes = $derived({ ...field?.as('datetime-local'), value: undefined });
	const issues = $derived(field?.issues() ?? []);

	const mainName = $derived(attributes.name || name);
	const required = $derived(context?.getValibotMetadata(mainName)?.slc_required === true ? true : false);

	const valueChange = (value: string) => {
		field?.set(value);
		context?.form.validate({ preflightOnly: true });
	};

	let first = true;
	const proxy = {
		get value() {
			const currentValue = formatDatetimeIsoToInput(value);
			if (first) {
				first = false;
				valueChange(currentValue);
			}
			return currentValue;
		},
		set value(v) {
			const currentValue = parseDatetimeInputToIso(v);
			value = currentValue;
			valueChange(currentValue);
		}
	};
</script>

<Field {issues} {required} {label} id={mainName || id}>
	{#snippet input(inputClass)}
		<input
			bind:value={proxy.value}
			type={attributes.type || 'datetime-local'}
			id={mainName || id}
			name={mainName}
			aria-invalid={attributes['aria-invalid'] || ariaInvalid}
			{...rest}
			class="{classes} {inputClass}"
		/>
	{/snippet}
</Field>

<style>
	input::-webkit-calendar-picker-indicator {
		cursor: pointer;
		border-radius: 4px;
		filter: invert(0.3);
	}
</style>
