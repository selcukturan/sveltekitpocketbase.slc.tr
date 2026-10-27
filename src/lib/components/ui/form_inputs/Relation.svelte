<script lang="ts" generics="T extends string | string[] = string">
	import type { RemoteFormField } from '$app/server';
	import { Relation } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { RelationValueChangeArgs, RelationPropsType, CollectionName } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	// `multiple` ve `collection` şemadan (metadata) gelir; tip `field` üzerinden çıkarılır.
	type Tmultiple = T extends string[] ? true : false;
	type Props = Omit<RelationPropsType<Tmultiple>, 'multiple' | 'collection'> & {
		field: RemoteFormField<T>;
		collection?: CollectionName; // verilmezse şemadaki `collection` kullanılır
		label?: string;
	};

	let { label: componentLabel, field, collection: componentCollection, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);

	// ######### BEGIN: form field (metadata, issues, label) ####
	// Şema anahtarı `multiple` bilinmeden okunur: 'select' ve 'select multiple' adları yalnızca '[]' ile ayrılır.
	const formField = useFormField(() => ({ name: (field as RemoteFormField<string>).as('select').name, issues: field.issues(), label: componentLabel }));
	// ######### END: form field (metadata, issues, label) ######

	let multiple = $derived(formField.meta.multiple === true);
	let collection = $derived(componentCollection ?? (formField.meta.collection as CollectionName));

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived.by(() => {
		if (multiple) {
			return (field as RemoteFormField<string[]>).as('select multiple');
		} else {
			return (field as RemoteFormField<string>).as('select');
		}
	});
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: RelationValueChangeArgs<Tmultiple>) => {
		formField.track(args.value, args.initial);
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
	<Relation multiple={multiple as Tmultiple} {collection} {onValueChange} {...restProps} {id} inform />

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
</Field>
