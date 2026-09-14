<script lang="ts" generics="Tmultiple extends boolean = false">
	import type { RemoteFormField } from '$app/server';
	import { getFormInputsContext } from './context.svelte';
	import { File as FileInput } from '#lib/components/ui/inputs/index.js';
	import type { FileValueChangeArgs, FilePropsType, FileValueTypeChoice } from '#lib/components/ui/inputs/type.js';
	import Field from './Field.svelte';
	import { parseNamePath } from './utils.js';

	type Props = FilePropsType<Tmultiple> & {
		field: RemoteFormField<Tmultiple extends true ? string[] : string>;
		label?: string;
	};

	let { label: componentLabel, field, multiple = false as Tmultiple, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	// svelte-ignore state_referenced_locally
	let deletedFileNames = $state<FileValueTypeChoice<Tmultiple>>((multiple ? [] : '') as unknown as FileValueTypeChoice<Tmultiple>);

	// ######### BEGIN: Remote Form `field` attributes #########
	const attributes = $derived.by(() => {
		if (multiple) {
			return (field as RemoteFormField<string[]>).as('select multiple');
		} else {
			return (field as RemoteFormField<string>).as('select');
		}
	});

	let { pathFieldName, pathRemoteId, pathFormFunction } = $derived(parseNamePath(attributes.name));

	let attrName = $derived(pathFieldName || restProps.name);
	let cleanAttrName = $derived(attrName ? attrName.replace('[]', '') : '');
	let plusName = $derived((multiple ? cleanAttrName + '_Plus[]' : cleanAttrName + '_Plus') + '/' + pathRemoteId + '/' + pathFormFunction);
	let minusName = $derived((multiple ? cleanAttrName + '_Minus[]' : cleanAttrName + '_Minus') + '/' + pathRemoteId + '/' + pathFormFunction);
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
	const onValueChange = (args: FileValueChangeArgs<Tmultiple>) => {
		// Set Context Data
		if (args.initial && cleanAttrName) context.initialData.set(cleanAttrName, args.value);
		if (cleanAttrName) context.currentData.set(cleanAttrName, args.value);

		// Value Change Callback
		deletedFileNames = args.deletedFileNames;
		if (multiple) {
			(field as RemoteFormField<string[]>).set(args.value as string[]);
		} else {
			(field as RemoteFormField<string>).set(args.value as string);
		}
		restProps?.onValueChange?.(args);

		// Validate Form
		context?.props.form.validate({ preflightOnly: true, all: false });
	};
	// ######### END: handle value change #####################
</script>

<Field {issues} {required} {label}>
	<FileInput name={plusName} {onValueChange} {multiple} {...restProps} />
</Field>

<!--Hidden Area-->

<select {...attributes} class="sr-only" tabindex={-1} aria-hidden={true}>
	{#if multiple}
		{#each field.value() as item, i (i)}
			<option value={item} selected>{item}</option>
		{/each}
	{:else}
		<option value={field.value()} selected>{field.value()}</option>
	{/if}
</select>

<select {multiple} name={minusName} value={deletedFileNames} class="sr-only" tabindex={-1} aria-hidden={true}>
	{#if multiple}
		{#each deletedFileNames as option (option)}
			<option value={option} selected>{option}</option>
		{/each}
	{:else}
		<option value={deletedFileNames} selected>{deletedFileNames}</option>
	{/if}
</select>
