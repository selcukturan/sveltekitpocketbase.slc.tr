<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { Hidden } from '#lib/components/ui/inputs/index.js';
	import type { HiddenProps, HiddenValueChangeArgs } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	type Props = HiddenProps & {
		field: RemoteFormField<string>;
	};

	let { field, onValueChange: userOnValueChange, ...restProps }: Props = $props();

	let attributes = $derived(field.as('hidden', restProps.value !== undefined ? String(restProps.value) : ''));
	const formField = useFormField(() => ({ name: attributes.name }));

	const onValueChange = (args: HiddenValueChangeArgs) => {
		formField.track(args.value, args.initial);

		field.set(String(args.value));
		userOnValueChange?.(args);
	};
</script>

<Hidden name={attributes.name} {onValueChange} {...restProps} />
