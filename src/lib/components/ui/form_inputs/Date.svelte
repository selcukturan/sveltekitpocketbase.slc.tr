<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { Date as DateInput } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { DateValueChangeArgs, DateProps } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	type Props = DateProps & {
		field: RemoteFormField<string>;
		label?: string;
	};

	let { label: componentLabel, field, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived(field.as('date'));
	let attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: form field (metadata, issues, label) ####
	const formField = useFormField(() => ({ name: attributes.name, issues: field.issues(), label: componentLabel }));
	// ######### END: form field (metadata, issues, label) ######

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: DateValueChangeArgs) => {
		formField.track(args.value, args.initial);
		field.set(args.value);
		userOnValueChange?.(args);
		formField.validate();
	};
	// ######### END: handle value change #####################
</script>

<Field issues={formField.issues} required={formField.required} label={formField.label} {id}>
	<DateInput
		{id}
		name={attributes.name}
		min={formField.meta.minDate}
		max={formField.meta.maxDate}
		aria-invalid={attrAriaInvalid}
		{onValueChange}
		{...restProps}
		status="with-field"
		size="sm"
	/>
</Field>
