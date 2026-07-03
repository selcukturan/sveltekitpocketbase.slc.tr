<script lang="ts">
	import type { RemoteFormField } from '@sveltejs/kit';
	import { getFormInputsContext } from './context.svelte';
	import { Text } from '$lib/components/ui/inputs';
	import Field from './Field.svelte';
	import type { TextValueChangeArgs, TextProps } from '$lib/components/ui/inputs/type';

	type Props = TextProps & {
		field: RemoteFormField<string>;
		label?: string;
	};

	let { label: componentLabel, field, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	// ######### BEGIN: Remote Form `field` attributes #########
	const attributes = $derived(field.as('text'));
	const attrName = $derived(attributes.name || restProps.name);
	const attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: Remote Form `field.issues()` ###########
	const issues = $derived(field.issues() ?? []);
	// ######### END: Remote Form `field.issues()` #############

	// ######### BEGIN: Valibot metadata ######################
	const metadata = $derived(context?.getValibotMetadata(attrName));
	const required = $derived(metadata?.slc_required === true ? true : false);
	// ######### END: Valibot metadata ########################

	// ######### BEGIN: custom props variables #################
	const label = $derived(componentLabel || attrName || 'no_label');
	// ######### END: custom props variables ###################

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: TextValueChangeArgs) => {
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

<Field {issues} {required} {label}>
	<Text name={attrName} aria-invalid={attrAriaInvalid} {onValueChange} {...restProps} />
</Field>
