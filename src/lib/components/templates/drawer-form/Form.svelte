<script
	lang="ts"
	generics="T1 extends Record<string, any>, T2 extends Record<string, any>, Schema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>"
>
	import { type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { createFormInputsContext } from '$lib/components/base/inputs/context.svelte';
	import type { RemoteForm } from '@sveltejs/kit';
	import type { ErrorMessage, ObjectEntries, ObjectIssue, ObjectSchema } from 'valibot';

	type Props = HTMLFormAttributes & {
		inputs?: Snippet;
		children?: Snippet;
		buttons?: Snippet;
		form: RemoteForm<T1, T2>;
		schema: Schema;
		class?: string;
	};

	let { children, class: classes, inputs, buttons, form, schema, ...attributes }: Props = $props();
	// svelte-ignore state_referenced_locally
	const context = createFormInputsContext<T1, T2, Schema>(form, schema); // init
	$inspect('DrawerFormContent.Content.Form -> context.schema', context.schema);

	const internalClasses = 'flex flex-1 flex-col overflow-hidden';
</script>

<form class="{classes || ''} {internalClasses}" {...attributes}>
	<div class="flex-1 overflow-y-auto" tabindex="-1">
		{@render inputs?.()}
	</div>
	<div class="bg-surface-100/80 flex justify-end border-t p-4">
		{@render buttons?.()}
	</div>
	{@render children?.()}
</form>
