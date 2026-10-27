<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { Number } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { NumberValueChangeArgs, NumberProps } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	type Props = NumberProps & {
		field: RemoteFormField<number>;
		label?: string;
	};

	let { label: componentLabel, field, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived(field.as('number'));
	let attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: form field (metadata, issues, label) ####
	const formField = useFormField(() => ({ name: attributes.name, issues: field.issues(), label: componentLabel }));
	// ######### END: form field (metadata, issues, label) ######

	// tam sayı → 1, ondalık sınırı → 0.01 gibi, aksi halde serbest
	let step = $derived(formField.meta.onlyInt ? 1 : formField.meta.decimals !== undefined ? 10 ** -formField.meta.decimals : 'any');

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: NumberValueChangeArgs) => {
		formField.track(args.value, args.initial);
		field.set(args.value);
		userOnValueChange?.(args);
		formField.validate();
	};
	// ######### END: handle value change #####################
</script>

<Field issues={formField.issues} required={formField.required} label={formField.label} {id}>
	<Number
		{id}
		name={attributes.name}
		min={formField.meta.min}
		max={formField.meta.max}
		{step}
		aria-invalid={attrAriaInvalid}
		{onValueChange}
		{...restProps}
		status="with-field"
		size="sm"
	/>
</Field>
