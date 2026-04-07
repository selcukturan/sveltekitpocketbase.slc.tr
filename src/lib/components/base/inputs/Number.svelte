<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { RemoteFormField } from '@sveltejs/kit';
	import Field from './Field.svelte';
	import { getFormInputsContext } from './context.svelte';
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	// import { watch } from 'runed';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<SvelteHTMLElements['input'], 'type' | 'id' | 'value' | 'name' | 'aria-invalid'> & {
		id?: string;
		value?: number;
		name?: string;
		'aria-invalid'?: SvelteHTMLElements['input']['aria-invalid'];
		field?: RemoteFormField<number>;
		label?: string;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(0), label, field, class: classes, id, name, 'aria-invalid': ariaInvalid, ...rest }: Props = $props();
	const context = getFormInputsContext();

	const attributes = $derived({ ...field?.as('number'), value: undefined });
	const issues = $derived(field?.issues() ?? []);

	const mainName = $derived(attributes.name || name || '');
	const required = $derived(context?.getValibotMetadata(mainName.replace('n:', ''))?.slc_required === true ? true : false);

	const valueChanged = (value: number) => {
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
	const watch: Attachment = (node) => {
		if (!(node instanceof HTMLElement)) return;

		proxy.value;

		const cleanup = untrack(() => {
			if (!context?.initialValidate && !initialValidate) {
				initialValidate = true;
				return;
			}
			context?.form.validate({ preflightOnly: true, includeUntouched: true });

			return () => {
				// cleanup code
			};
		});

		return cleanup;
	};
	/* watch(
		() => proxy.value,
		() => {
			if (!context?.initialValidate && !initialValidate) {
				initialValidate = true;
				return;
			}
			context?.form.validate({ preflightOnly: true, includeUntouched: true });
		}
	); */
</script>

<Field {issues} {required} {label} id={mainName || id}>
	{#snippet input(inputClass)}
		<input
			bind:value={proxy.value}
			type={attributes.type || 'number'}
			id={mainName || id}
			name={mainName}
			aria-invalid={attributes['aria-invalid'] || ariaInvalid}
			{...rest}
			class="{classes} {inputClass}"
			{@attach watch}
		/>
	{/snippet}
</Field>
