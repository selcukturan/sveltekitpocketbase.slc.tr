<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { Text } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { TextValueChangeArgs, TextProps } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	type Props = Omit<TextProps, 'type'> & {
		field: RemoteFormField<string>;
		label?: string;
	};

	let { label: componentLabel, field, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived(field.as('email'));
	let attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: form field (metadata, issues, label) ####
	const formField = useFormField(() => ({ name: attributes.name, issues: field.issues(), label: componentLabel }));
	// ######### END: form field (metadata, issues, label) ######

	// ######### BEGIN: handle value change ###################
	const onValueChange = (args: TextValueChangeArgs) => {
		formField.track(args.value, args.initial);
		field.set(args.value);
		userOnValueChange?.(args);
		formField.validate();
	};
	// ######### END: handle value change #####################
</script>

<Field issues={formField.issues} required={formField.required} label={formField.label} {id}>
	<Text type="email" {id} name={attributes.name} aria-invalid={attrAriaInvalid} {onValueChange} {...restProps} status="with-field" size="sm" />
</Field>
