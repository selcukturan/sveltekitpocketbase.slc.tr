<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { RemoteFormField } from '@sveltejs/kit';
	import Popup from './Popup.svelte';
	import { getFormInputsContext } from './context.svelte';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<SvelteHTMLElements['textarea'], 'type' | 'id' | 'value' | 'name' | 'aria-invalid'> & {
		id?: string;
		value?: string;
		name?: string;
		'aria-invalid'?: SvelteHTMLElements['textarea']['aria-invalid'];
		field?: RemoteFormField<string>;
		label?: string;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), label, field, class: classes, id, name, 'aria-invalid': ariaInvalid, ...rest }: Props = $props();
	const context = getFormInputsContext();

	const attributes = $derived({ ...field?.as('text'), value: undefined });
	const issues = $derived(field?.issues() ?? []);

	const valueChange = (value: string) => {
		field?.set(value);
		context?.form.validate({ preflightOnly: true });
	};

	let first = true;
	const proxy = {
		get value() {
			const currentValue = value;
			if (first) {
				first = false;
				valueChange(currentValue);
			}
			return currentValue;
		},
		set value(v) {
			const currentValue = v;
			value = currentValue;
			valueChange(currentValue);
		}
	};
</script>

<div style:position="relative">
	<label>
		<h2>{label}</h2>

		<textarea
			bind:value={proxy.value}
			id={attributes.name || id}
			name={attributes.name || name}
			aria-invalid={attributes['aria-invalid'] || ariaInvalid}
			{...rest}
			class={classes}
		></textarea>
	</label>
	<Popup {issues} />
</div>
