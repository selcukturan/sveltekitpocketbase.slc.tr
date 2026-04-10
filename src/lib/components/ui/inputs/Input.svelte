<script lang="ts" generics="V extends RemoteFormFieldValue">
	// https://gist.github.com/sillvva/06d350db98fb4bbf7454e5fc484a8afe
	import type { RemoteFormField, RemoteFormFieldType, RemoteFormFieldValue } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	type Props = {
		label?: string;
		field: RemoteFormField<V>;
		description?: string;
		warning?: string;
		hidden?: boolean;
	} & (V extends string[]
		? { type: 'checkbox'; value: string } | { type: 'select multiple'; value?: undefined }
		: V extends string
			?
					| { type: 'radio' | 'submit'; value: string }
					| { type: 'hidden'; value?: string }
					| { type: Exclude<RemoteFormFieldType<V>, 'radio' | 'hidden' | 'submit'>; value?: undefined }
			: { type: RemoteFormFieldType<V>; value?: undefined }) &
		Omit<HTMLInputAttributes, 'type' | 'id' | 'value' | 'name' | 'checked'>;

	let { label, field, type, value, description, warning, hidden, ...rest }: Props = $props();

	const attributes = $derived(
		field.as(
			// @ts-expect-error expected
			type,
			value ?? (['string', 'number'].includes(typeof field.value()) ? field.value() : undefined)
		)
	);
	const name = $derived(attributes.name);
	const issues = $derived(field.issues());
	const invalid = $derived(!!issues?.length || undefined);
</script>

{#if type === 'checkbox'}
	<label
		class={[
			'label flex cursor-pointer rounded-lg border p-4 text-sm',
			invalid ? 'border-error' : 'border-base-content/20',
			hidden ? 'hidden' : ''
		]}
	>
		<div class="flex flex-1 flex-col gap-0.5">
			<span>
				<span class="text-base-content">{label}</span>
				{#if rest.required}
					<span class="text-error">*</span>
				{/if}
			</span>
			{#if issues && issues[0]}
				<span class="text-error text-pretty">{issues[0].message}</span>
			{:else if warning}
				<span class="text-warning text-pretty">{warning}</span>
			{:else if description}
				<span class="text-pretty text-neutral-500">{description}</span>
			{/if}
		</div>
		<input {...attributes} {...rest} aria-invalid={invalid} id={name} type="checkbox" class="checkbox-primary checkbox" />
	</label>
{:else}
	{#if type !== 'hidden' && !hidden}
		<label for={name} class="fieldset-legend">
			<span>
				{label}
				{#if rest.required}
					<span class="text-error">*</span>
				{/if}
			</span>
		</label>
	{/if}
	<input
		{...attributes}
		{...rest}
		aria-invalid={invalid}
		id={name}
		class={[type !== 'hidden' && !hidden && 'input focus:border-primary w-full', hidden && 'hidden']}
	/>
	{#if type !== 'hidden' && !hidden && (issues?.length || warning || description)}
		<label for={name} class="fieldset-label">
			{#if issues && issues[0]}
				<span class="text-error text-pretty">{issues[0].message}</span>
			{:else if warning}
				<span class="text-warning text-pretty">{warning}</span>
			{:else}
				<span class="text-pretty text-neutral-500">{description}</span>
			{/if}
		</label>
	{/if}
{/if}
