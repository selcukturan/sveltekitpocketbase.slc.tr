<script lang="ts">
	import { getFormInputsContext } from './context.svelte';
	import { Hidden } from '$lib/components/ui/inputs';
	import type { HiddenProps, HiddenValueChangeArgs } from '$lib/components/ui/inputs/type';
	import type { RemoteFormField } from '@sveltejs/kit';

	type Props = HiddenProps & {
		field: RemoteFormField<string>;
	};

	let { field, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	const attributes = $derived(field.as('hidden', restProps.value !== undefined ? String(restProps.value) : ''));
	const attrName = $derived(attributes.name || restProps.name);

	const onValueChange = (args: HiddenValueChangeArgs) => {
		if (args.initial && attrName) context.initialData.set(attrName, args.value);
		if (attrName) context.currentData.set(attrName, args.value);

		field.set(String(args.value));
		restProps?.onValueChange?.(args);
	};
</script>

<Hidden name={attrName} {onValueChange} {...restProps} />
