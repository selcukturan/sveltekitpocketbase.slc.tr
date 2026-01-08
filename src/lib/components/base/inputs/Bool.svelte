<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { RemoteFormField } from '@sveltejs/kit';
	import { getFormInputsContext } from './context.svelte';
	import Field from './Field.svelte';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<SvelteHTMLElements['input'], 'type' | 'id' | 'value' | 'name' | 'aria-invalid'> & {
		id?: string;
		value?: boolean;
		name?: string;
		'aria-invalid'?: SvelteHTMLElements['input']['aria-invalid'];
		field?: RemoteFormField<boolean>;
		label?: string;
	};
	// ######################## PROPS ###################################################################################################
	let {
		value = $bindable(false),
		label,
		field,
		class: classes,
		id,
		name,
		'aria-invalid': ariaInvalid,
		...rest
	}: Props = $props();
	const context = getFormInputsContext();

	const attributes = $derived({ ...field?.as('checkbox'), value: undefined, checked: undefined });
	const issues = $derived(field?.issues() ?? []);

	const mainName = $derived(attributes.name || name || '');
	const nonfalsey = $derived(context?.getValibotMetadata(mainName.replace('b:', ''))?.slc_nonfalsey === true ? true : false);

	const valueChanged = (value: boolean) => {
		field?.set(value);
		context?.form.validate({ preflightOnly: true });
	};

	let first = true;
	const proxy = {
		get value() {
			const currentValue = value;
			if (first) {
				first = false;
				valueChanged(currentValue);
			}
			return currentValue;
		},
		set value(v) {
			const currentValue = v;
			value = currentValue;
			valueChanged(currentValue);
		}
	};
</script>

<Field {issues} required={nonfalsey} {label} id={mainName || id}>
	{#snippet input(inputClass)}
		<input
			bind:checked={proxy.value}
			type="checkbox"
			id={mainName || id}
			name={mainName}
			aria-invalid={attributes['aria-invalid'] || ariaInvalid}
			{...rest}
			class="{classes} {inputClass}"
		/>
	{/snippet}
</Field>
