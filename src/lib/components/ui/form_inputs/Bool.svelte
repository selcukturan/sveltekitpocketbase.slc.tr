<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { getFormInputsContext } from './context.svelte';
	import { Bool } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { BoolValueChangeArgs, BoolProps } from '#lib/components/ui/inputs/type.js';
	import { parseNamePath } from './utils.js';

	type Props = BoolProps & {
		field: RemoteFormField<boolean>;
		label?: string;
	};

	let { label: componentLabel, field, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);
	const context = getFormInputsContext();

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived(field.as('checkbox'));
	let { pathFieldName } = $derived(parseNamePath(attributes.name));
	let attrName = $derived(attributes.name || restProps.name);
	let attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: Remote Form `field.issues()` ###########
	let issues = $derived(field.issues() ?? []);
	// ######### END: Remote Form `field.issues()` #############

	// ######### BEGIN: Valibot metadata ######################
	let cleanAttrName = $derived(pathFieldName?.replace('b:', ''));
	let metadata = $derived(context?.getValibotMetadata(cleanAttrName));
	let required = $derived(metadata?.slc_nonfalsey === true ? true : false);
	// ######### END: Valibot metadata ########################

	// ######### BEGIN: custom props variables #################
	let label = $derived(componentLabel || cleanAttrName || 'no_label');
	// ######### END: custom props variables ###################

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: BoolValueChangeArgs) => {
		// Set Context Data
		if (args.initial && cleanAttrName) context.initialData.set(cleanAttrName, args.value);
		if (cleanAttrName) context.currentData.set(cleanAttrName, args.value);

		// Value Change Callback
		field.set(args.value);
		userOnValueChange?.(args);

		// Validate Form
		context?.props.form.validate({ preflightOnly: true, all: false });
	};
	// ######### END: handle value change #####################
</script>

<Field {issues} {required} {label} {id} fieldClasses="group-focus-within:bg-surface-200!">
	<Bool {id} name={attrName} aria-invalid={attrAriaInvalid} {onValueChange} {...restProps} class="px-3 pt-1" />
</Field>

<!-- Hidden Area -->
<input {...attributes} class="sr-only" tabindex={-1} aria-hidden={true} />
