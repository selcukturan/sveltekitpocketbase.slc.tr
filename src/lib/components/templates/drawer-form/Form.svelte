<script
	lang="ts"
	generics="TInput extends RemoteFormInput | void, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>"
>
	import { type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { createFormInputsContext } from '$lib/components/base/inputs/context.svelte';
	import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
	import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';

	type Props = HTMLFormAttributes & {
		form: RemoteForm<TInput, TOutput>;
		schema: TSchema;
		inputs?: Snippet;
		children?: Snippet;
		buttons?: Snippet;
		class?: string;
	};

	let { children, class: classes, inputs, buttons, form, schema, ...attributes }: Props = $props();

	// svelte-ignore state_referenced_locally
	const context = createFormInputsContext<TInput, TOutput, TSchema>(form, schema); // init

	$inspect('DrawerFormContent.Content.Form -> context.schema', context.schema);

	const internalClasses = 'flex flex-1 flex-col overflow-hidden';
</script>

<form class="{classes || ''} {internalClasses}" {...attributes}>
	<div class="flex-1 overflow-x-hidden overflow-y-auto px-6 pb-6">
		{@render inputs?.()}
	</div>
	<div class="bg-surface-100/80 flex justify-end border-t p-4">
		{@render buttons?.()}
	</div>
	{@render children?.()}
</form>
