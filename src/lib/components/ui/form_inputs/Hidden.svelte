<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { getFormInputsContext } from './context.svelte';
	import { Hidden } from '#lib/components/ui/inputs/index.js';
	import type { HiddenProps, HiddenValueChangeArgs } from '#lib/components/ui/inputs/type';

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
