<script lang="ts" generics="Tmultiple extends boolean = false">
	import type { RemoteFormField } from '@sveltejs/kit';
	import { getFormInputsContext } from './context.svelte';
	import { Select as SelectInput } from '$lib/components/ui/inputs';
	import Field from './Field.svelte';
	import type { SelectValueChangeArgs, SelectPropsType } from '$lib/components/ui/inputs/type';

	type Props = SelectPropsType<Tmultiple> & {
		field: RemoteFormField<Tmultiple extends true ? string[] : string>;
		label?: string;
	};

	let { label: componentLabel, field, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	// ######### BEGIN: Remote Form `field` attributes #########
	const attributes = $derived.by(() => {
		if (restProps.multiple) {
			return (field as RemoteFormField<string[]>).as('select multiple');
		} else {
			return (field as RemoteFormField<string>).as('select');
		}
	});
	const attrName = $derived(attributes.name || restProps.name);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: Remote Form `field.issues()` ###########
	const issues = $derived(field.issues() ?? []);
	// ######### END: Remote Form `field.issues()` #############

	// ######### BEGIN: Valibot metadata ######################
	const cleanAttrName = $derived(attrName ? attrName.replace('[]', '') : '');
	const metadata = $derived(context?.getValibotMetadata(cleanAttrName));
	const required = $derived(metadata?.slc_required === true ? true : false);
	// ######### END: Valibot metadata ########################

	// ######### BEGIN: custom props variables #################
	const label = $derived(componentLabel || cleanAttrName || 'no_label');
	// ######### END: custom props variables ###################

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: SelectValueChangeArgs<Tmultiple>) => {
		// Set Context Data
		if (args.initial && attrName) context.initialData.set(cleanAttrName, args.value);
		if (attrName) context.currentData.set(cleanAttrName, args.value);

		// Value Change Callback
		if (restProps.multiple) {
			(field as RemoteFormField<string[]>).set(args.value as string[]);
		} else {
			(field as RemoteFormField<string>).set(args.value as string);
		}
		restProps?.onValueChange?.(args);

		// Validate Form
		context?.props.form.validate({ preflightOnly: true, includeUntouched: false });
	};
	// ######### END: handle value change #####################
</script>

<Field {issues} {required} {label}>
	<SelectInput {onValueChange} {...restProps} {required} />

	<!--Hidden Area-->
	<select {...attributes} class="sr-only" tabindex={-1} aria-hidden={true}>
		{#if restProps.multiple}
			{#each field.value() as item, i (i)}
				<option value={item} selected>{item}</option>
			{/each}
		{:else}
			<option value={field.value()} selected>{field.value()}</option>
		{/if}
	</select>
</Field>
