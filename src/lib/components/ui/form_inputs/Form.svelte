<script lang="ts" generics="TInput extends RemoteFormInput, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>">
	import { createFormInputsContext, type MainProps } from '$lib/components/ui/form_inputs/context.svelte';
	import type { RemoteFormInput } from '@sveltejs/kit';
	import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';

	let props: MainProps<TInput, TOutput, TSchema> = $props();

	// svelte-ignore state_referenced_locally
	const context = createFormInputsContext<TInput, TOutput, TSchema>(props); // init
</script>

<form class="flex flex-1 flex-col overflow-hidden {context.props.formClass || ''}" {...context.formAttributes} {@attach context.watchIsChanged}>
	<div class="flex-1 overflow-x-hidden overflow-y-auto px-6 pb-6">
		{@render context.props.inputs?.({ isChanged: context.isChanged })}
	</div>
	<div class="bg-surface-50 flex justify-end border-t p-4">
		{@render context.props.buttons?.({ isChanged: context.isChanged })}
	</div>
	{@render context.props.children?.({ isChanged: context.isChanged })}
</form>
