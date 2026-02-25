<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { RemoteFormField } from '@sveltejs/kit';
	import Field from './Field.svelte';
	import { getFormInputsContext } from './context.svelte';
	import { watch } from 'runed';
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

	const attributes = $derived({ ...field?.as('url'), value: undefined });
	const issues = $derived(field?.issues() ?? []);

	const mainName = $derived(attributes.name || name);
	const required = $derived(context?.getValibotMetadata(mainName)?.slc_required === true ? true : false);

	const valueChanged = (value: string) => {
		field?.set(value);
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

	let initialValidate = false;
	watch(
		() => proxy.value,
		() => {
			if (!context?.initialValidate && !initialValidate) {
				initialValidate = true;
				return;
			}
			context?.form.validate({ preflightOnly: true, includeUntouched: true });
		}
	);
</script>

<Field {issues} {required} {label} id={mainName || id}>
	{#snippet input(inputClass)}
		<input
			bind:value={proxy.value}
			type={attributes.type || 'url'}
			id={mainName || id}
			name={mainName}
			aria-invalid={attributes['aria-invalid'] || ariaInvalid}
			{...rest}
			class="{classes} {inputClass}"
		/>
	{/snippet}
</Field>
