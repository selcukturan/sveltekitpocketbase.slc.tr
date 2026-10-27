<script lang="ts" generics="T extends string | string[] = string">
	import type { RemoteFormField } from '$app/server';
	import { File as FileInput } from '#lib/components/ui/inputs/index.js';
	import type { FileValueChangeArgs, FilePropsType } from '#lib/components/ui/inputs/type.js';
	import Field from './Field.svelte';
	import { parseNamePath } from './utils.js';
	import { useFormField } from './form-field.svelte.js';

	// `multiple`, `accept`, `maxSize` ve `maxCount` şemadan (metadata) gelir; tip `field` üzerinden çıkarılır.
	// Prop olarak verilen `accept`, `maxSize`, `maxCount` şemadakini ezer.
	type Tmultiple = T extends string[] ? true : false;
	type Props = Omit<FilePropsType<Tmultiple>, 'multiple'> & {
		field: RemoteFormField<T>;
		label?: string;
	};

	let { label: componentLabel, field, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);

	// ######### BEGIN: form field (metadata, issues, label) ####
	// Şema anahtarı `multiple` bilinmeden okunur: 'select' ve 'select multiple' adları yalnızca '[]' ile ayrılır.
	// `_Plus` (boyut, tür) ve `_Minus` hataları da bu alanın altında gösterilir.
	const formField = useFormField(() => ({
		name: (field as RemoteFormField<string>).as('select').name,
		issues: field.issues(),
		label: componentLabel,
		shadowSuffixes: ['_Plus', '_Minus']
	}));
	// ######### END: form field (metadata, issues, label) ######

	let multiple = $derived(formField.meta.multiple === true);
	let accept = $derived(formField.meta.mimeTypes?.length ? formField.meta.mimeTypes.join(',') : undefined);
	let maxCount = $derived(multiple ? formField.meta.maxSelect : undefined);

	// Silinecek kayıtlı dosya adları (`_Minus`); tekli modda en fazla bir eleman
	let deletedFileNames = $state<string[]>([]);

	// ######### BEGIN: Remote Form `field` attributes #########
	const attributes = $derived.by(() => {
		if (multiple) {
			return (field as RemoteFormField<string[]>).as('select multiple');
		} else {
			return (field as RemoteFormField<string>).as('select');
		}
	});

	let { pathRemoteId, pathFormFunction } = $derived(parseNamePath(attributes.name));

	let plusName = $derived((multiple ? formField.key + '_Plus[]' : formField.key + '_Plus') + '/' + pathRemoteId + '/' + pathFormFunction);
	let minusName = $derived((multiple ? formField.key + '_Minus[]' : formField.key + '_Minus') + '/' + pathRemoteId + '/' + pathFormFunction);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: FileValueChangeArgs<Tmultiple>) => {
		formField.track(args.value, args.initial);
		deletedFileNames = Array.isArray(args.deletedFileNames) ? args.deletedFileNames : args.deletedFileNames ? [args.deletedFileNames] : [];
		if (multiple) {
			(field as RemoteFormField<string[]>).set(args.value as string[]);
		} else {
			(field as RemoteFormField<string>).set(args.value as string);
		}
		userOnValueChange?.(args);

		formField.validate();
	};
	// ######### END: handle value change #####################
</script>

<Field issues={formField.issues} required={formField.required} label={formField.label} {id} fieldClasses="group-focus-within:bg-surface-200!">
	<FileInput name={plusName} {id} {onValueChange} multiple={multiple as Tmultiple} {accept} maxSize={formField.meta.maxSize} {maxCount} inform {...restProps} />
</Field>

<!--Hidden Area-->

<select {...attributes} class="sr-only" tabindex={-1} aria-hidden={true}>
	{#if multiple}
		{#each field.value() as string[] as item, i (i)}
			<option value={item} selected>{item}</option>
		{/each}
	{:else}
		<option value={field.value()} selected>{field.value()}</option>
	{/if}
</select>

<select {multiple} name={minusName} class="sr-only" tabindex={-1} aria-hidden={true}>
	{#each deletedFileNames as option (option)}
		<option value={option} selected>{option}</option>
	{/each}
</select>
