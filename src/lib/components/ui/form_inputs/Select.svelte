<script lang="ts" generics="Tmultiple extends boolean = false">
	import type { RemoteFormField } from '$app/server';
	import { getFormInputsContext } from './context.svelte';
	import { Select } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { SelectValueChangeArgs, SelectPropsType } from '#lib/components/ui/inputs/type.js';
	import { parseNamePath } from './utils.js';

	type Props = SelectPropsType<Tmultiple> & {
		field: RemoteFormField<Tmultiple extends true ? string[] : string>;
		label?: string;
	};

	let { label: componentLabel, field, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived.by(() => {
		if (restProps.multiple) {
			return (field as RemoteFormField<string[]>).as('select multiple');
		} else {
			return (field as RemoteFormField<string>).as('select');
		}
	});
	let { pathFieldName } = $derived(parseNamePath(attributes.name));

	let attrName = $derived(attributes.name);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: Remote Form `field.issues()` ###########
	let issues = $derived(field.issues() ?? []);
	// ######### END: Remote Form `field.issues()` #############

	// ######### BEGIN: Valibot metadata ######################
	let cleanAttrName = $derived(pathFieldName ? pathFieldName.replace('[]', '') : '');
	let metadata = $derived(context?.getValibotMetadata(cleanAttrName));
	let required = $derived(metadata?.slc_required === true ? true : false);
	// ######### END: Valibot metadata ########################

	// ######### BEGIN: custom props variables #################
	let label = $derived(componentLabel || cleanAttrName || 'no_label');
	// ######### END: custom props variables ###################

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: SelectValueChangeArgs<Tmultiple>) => {
		// Set Context Data
		if (args.initial && cleanAttrName) context.initialData.set(cleanAttrName, args.value);
		if (cleanAttrName) context.currentData.set(cleanAttrName, args.value);

		// Value Change Callback
		if (restProps.multiple) {
			(field as RemoteFormField<string[]>).set(args.value as string[]);
		} else {
			(field as RemoteFormField<string>).set(args.value as string);
		}
		restProps?.onValueChange?.(args);

		// Validate Form
		context?.props.form.validate({ preflightOnly: true, all: false });
	};
	// ######### END: handle value change #####################

	let slct = $state<ReturnType<typeof Select> | null>(null);

	const id = $derived(slct?.data.toggler_id || 'no_id');
</script>

<Field
	{issues}
	{required}
	{label}
	{id}
	onclick={(e) => {
		e.preventDefault();
	}}
	onpointerdown={(e) => {
		e.preventDefault();
		slct?.close();
	}}
	onpointerup={(e) => {
		e.preventDefault();
		slct?.open();
	}}
>
	<Select bind:this={slct} {onValueChange} {...restProps} {required} status="with-field" size="sm" inform={true} />

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
