<script lang="ts" generics="TInput extends RemoteFormInput, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>">
	import type { RemoteFormInput } from '$app/server';
	import type { MainProps } from '#lib/components/ui/form_inputs/context.svelte.js';
	import { Form } from '#lib/components/ui/form_inputs/index.js';
	import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';

	let props: MainProps<TInput, TOutput, TSchema> = $props();
</script>

<Form {...props} />
