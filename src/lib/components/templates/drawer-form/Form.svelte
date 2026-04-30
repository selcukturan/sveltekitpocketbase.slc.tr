<script
	lang="ts"
	generics="TData extends Record<string, unknown>,TInput extends RemoteFormInput | void, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>"
>
	import { type Snippet } from 'svelte';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import { createFormInputsContext } from '$lib/components/ui/inputs/context.svelte';
	import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
	import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';
	import type { RemoteQuery } from '@sveltejs/kit';

	type Props = HTMLFormAttributes & {
		form: RemoteForm<TInput, TOutput>;
		query?: RemoteQuery<TData>;
		schema: TSchema;
		inputs?: Snippet<[{ data: TData }]>;
		children?: Snippet;
		buttons?: Snippet;
		class?: string;
		initialValidate?: boolean;
	};

	let { children, class: classes, inputs, buttons, form, query, schema, initialValidate = false, ...attributes }: Props = $props();

	// svelte-ignore state_referenced_locally
	const context = createFormInputsContext<TInput, TOutput, TSchema>(form, schema, initialValidate); // init

	// $inspect('Form - allIssues()', context.form.fields.allIssues());

	const internalClasses = 'flex flex-1 flex-col overflow-hidden';
</script>

{#if query}
	{#if query.error}
		<p>oops!</p>
	{:else if query.loading}
		<p>loading......</p>
	{:else if query.current}
		{@render formSnippet(query.current)}
	{:else}
		<!-- no current -->
		{@render formSnippet({} as TData)}
	{/if}
{:else}
	<!-- no query -->
	{@render formSnippet({} as TData)}
{/if}

{#snippet formSnippet(data: TData)}
	<form class="{classes || ''} {internalClasses}" {...attributes}>
		<div class="flex-1 overflow-x-hidden overflow-y-auto px-6 pb-6">
			{@render inputs?.({ data })}
		</div>
		<div class="bg-surface-100/80 flex justify-end border-t p-4">
			{@render buttons?.()}
		</div>
		{@render children?.()}
	</form>
{/snippet}
