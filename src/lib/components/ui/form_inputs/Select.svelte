<script lang="ts" generics="T extends string | string[] = string">
	import type { RemoteFormField } from '$app/server';
	import { Select } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { SelectValueChangeArgs, SelectPropsType } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	// `multiple` ve seçenekler şemadan (metadata) gelir; tip `field` üzerinden çıkarılır.
	type Tmultiple = T extends string[] ? true : false;
	type Props = Omit<SelectPropsType<Tmultiple>, 'multiple' | 'options'> & {
		field: RemoteFormField<T>;
		options?: SelectPropsType<Tmultiple>['options']; // verilmezse şemadaki `values` kullanılır
		label?: string;
	};

	let { label: componentLabel, field, options: componentOptions, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	// ######### BEGIN: form field (metadata, issues, label) ####
	// Şema anahtarı `multiple` bilinmeden okunur: 'select' ve 'select multiple' adları yalnızca '[]' ile ayrılır.
	const formField = useFormField(() => ({ name: (field as RemoteFormField<string>).as('select').name, issues: field.issues(), label: componentLabel }));
	// ######### END: form field (metadata, issues, label) ######

	let multiple = $derived(formField.meta.multiple === true);
	let options = $derived(componentOptions ?? (formField.meta.values ?? []).map((value) => ({ label: value, value })));

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
	const onValueChange = (args: SelectValueChangeArgs<Tmultiple>) => {
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

	let slct = $state<ReturnType<typeof Select> | null>(null);

	const id = $derived(slct?.data.toggler_id || 'no_id');
</script>

<Field issues={formField.issues} required={formField.required} label={formField.label} {id}>
	<Select
		bind:this={slct}
		multiple={multiple as Tmultiple}
		{options}
		{onValueChange}
		{...restProps}
		required={formField.required}
		status="with-field"
		size="sm"
		inform={true}
	/>

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
