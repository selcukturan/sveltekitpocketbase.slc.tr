<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { getFormInputsContext } from './context.svelte';
	import { Date as DateInput } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { DateValueChangeArgs, DateProps } from '#lib/components/ui/inputs/type.js';
	import { parseNamePath } from './utils.js';

	type Props = DateProps & {
		field: RemoteFormField<string>;
		label?: string;
	};

	let { label: componentLabel, field, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived(field.as('date'));
	let { pathFieldName } = $derived(parseNamePath(attributes.name));
	let cleanAttrName = $derived(pathFieldName);
	let attrName = $derived(attributes.name || restProps.name);
	let attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: Remote Form `field.issues()` ###########
	let issues = $derived(field.issues() ?? []);
	// ######### END: Remote Form `field.issues()` #############

	// ######### BEGIN: Valibot metadata ######################
	let metadata = $derived(context?.getValibotMetadata(cleanAttrName));
	let required = $derived(metadata?.slc_required === true ? true : false);
	// ######### END: Valibot metadata ########################

	// ######### BEGIN: custom props variables #################
	let label = $derived(componentLabel || attrName || 'no_label');
	// ######### END: custom props variables ###################

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: DateValueChangeArgs) => {
		// Set Context Data
		if (args.initial && cleanAttrName) context.initialData.set(cleanAttrName, args.value);
		if (cleanAttrName) context.currentData.set(cleanAttrName, args.value);

		// Value Change Callback
		field.set(args.value);
		restProps?.onValueChange?.(args);

		// Validate Form
		context?.props.form.validate({ preflightOnly: true, all: false });
	};
	// ######### END: handle value change #####################
</script>

<Field {issues} {required} {label}>
	<DateInput name={attrName} aria-invalid={attrAriaInvalid} {onValueChange} {...restProps} />
</Field>
