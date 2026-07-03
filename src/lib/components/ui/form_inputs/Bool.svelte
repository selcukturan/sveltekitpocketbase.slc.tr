<script lang="ts">
	import type { RemoteFormField } from '@sveltejs/kit';
	import { getFormInputsContext } from './context.svelte';
	import { Bool } from '$lib/components/ui/inputs';
	import Field from './Field.svelte';
	import type { BoolValueChangeArgs, BoolProps } from '$lib/components/ui/inputs/type';

	type Props = BoolProps & {
		field: RemoteFormField<boolean>;
		label?: string;
	};

	let { label: componentLabel, field, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	// ######### BEGIN: Remote Form `field` attributes #########
	const attributes = $derived(field.as('checkbox'));
	const attrName = $derived(attributes.name || restProps.name);
	const attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: Remote Form `field.issues()` ###########
	const issues = $derived(field.issues() ?? []);
	// ######### END: Remote Form `field.issues()` #############

	// ######### BEGIN: Valibot metadata ######################
	const cleanAttrName = $derived(attrName?.replace('b:', ''));
	const metadata = $derived(context?.getValibotMetadata(cleanAttrName));
	const required = $derived(metadata?.slc_nonfalsey === true ? true : false);
	// ######### END: Valibot metadata ########################

	// ######### BEGIN: custom props variables #################
	const label = $derived(componentLabel || attrName || 'no_label');
	// ######### END: custom props variables ###################

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: BoolValueChangeArgs) => {
		// Set Context Data
		if (args.initial && attrName) context.initialData.set(attrName, args.value);
		if (attrName) context.currentData.set(attrName, args.value);

		// Value Change Callback
		field.set(args.value);
		restProps?.onValueChange?.(args);

		// Validate Form
		context?.props.form.validate({ preflightOnly: true, includeUntouched: false });
	};
	// ######### END: handle value change #####################
</script>

<Field {issues} required={required} {label}>
	<Bool id={restProps.id || attrName} name={attrName} aria-invalid={attrAriaInvalid} {onValueChange} {...restProps} />
</Field>
