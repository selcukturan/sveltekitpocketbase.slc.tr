<script lang="ts">
	import { type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { createFormInputsContext } from '$lib/components/base/inputs/context.svelte';
	import type { RemoteForm } from '@sveltejs/kit';
	import type { SchemaProp } from '$lib/app/schemas/schema-prop';
	import { Context } from 'runed';

	type ValidateFunction = RemoteForm<any, any>['validate'];

	type Props = HTMLFormAttributes & {
		inputs?: Snippet;
		children?: Snippet;
		buttons?: Snippet;
		validate?: ValidateFunction;
		schema?: SchemaProp;
	};

	let { children, class: classes, inputs, buttons, validate, schema, ...attributes }: Props = $props();
	// svelte-ignore state_referenced_locally
	const context = createFormInputsContext(validate, schema); // init
	// console.log(context.schema);

	const internalClasses = 'flex flex-1 flex-col overflow-hidden';
</script>

<form class="{classes} {internalClasses}" {...attributes}>
	<div class="flex-1 overflow-y-auto" tabindex="-1">
		{@render inputs?.()}
	</div>
	<div class="bg-surface-100/80 flex justify-end border-t p-4">
		{@render buttons?.()}
	</div>
	{@render children?.()}
</form>
