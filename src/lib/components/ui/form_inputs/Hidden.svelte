<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { getFormInputsContext } from './context.svelte';
	import { Hidden } from '#lib/components/ui/inputs/index.js';
	import type { HiddenProps, HiddenValueChangeArgs } from '#lib/components/ui/inputs/type.js';
	import { parseNamePath } from './utils.js';

	type Props = HiddenProps & {
		field: RemoteFormField<string>;
	};

	let { field, ...restProps }: Props = $props();

	const context = getFormInputsContext();

	let attributes = $derived(field.as('hidden', restProps.value !== undefined ? String(restProps.value) : ''));
	let { pathFieldName } = $derived(parseNamePath(attributes.name));
	let cleanAttrName = $derived(pathFieldName);
	let attrName = $derived(attributes.name || restProps.name);

	const onValueChange = (args: HiddenValueChangeArgs) => {
		if (args.initial && cleanAttrName) context.initialData.set(cleanAttrName, args.value);
		if (cleanAttrName) context.currentData.set(cleanAttrName, args.value);

		field.set(String(args.value));
		restProps?.onValueChange?.(args);
	};
</script>

<Hidden name={attrName} {onValueChange} {...restProps} />
