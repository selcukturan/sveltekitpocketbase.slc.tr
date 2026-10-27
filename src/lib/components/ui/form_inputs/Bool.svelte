<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { Bool } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { BoolValueChangeArgs, BoolProps } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	type Props = BoolProps & {
		field: RemoteFormField<boolean>;
		label?: string;
	};

	let { label: componentLabel, field, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived(field.as('checkbox'));
	let attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: form field (metadata, issues, label) ####
	const formField = useFormField(() => ({ name: attributes.name, issues: field.issues(), label: componentLabel }));
	// ######### END: form field (metadata, issues, label) ######

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: BoolValueChangeArgs) => {
		formField.track(args.value, args.initial);
		field.set(args.value);
		userOnValueChange?.(args);
		formField.validate();
	};
	// ######### END: handle value change #####################
</script>

<Field issues={formField.issues} required={formField.required} label={formField.label} {id} fieldClasses="group-focus-within:bg-surface-200!">
	<Bool {id} name={attributes.name} aria-invalid={attrAriaInvalid} {onValueChange} {...restProps} class="px-3 pt-1" />
</Field>

<!-- Hidden Area -->
<input {...attributes} class="sr-only" tabindex={-1} aria-hidden={true} />
