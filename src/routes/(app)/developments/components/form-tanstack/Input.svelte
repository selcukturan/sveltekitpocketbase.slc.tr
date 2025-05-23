<script lang="ts" generics="TField">
	import type { AnyFieldApi } from '@tanstack/svelte-form';

	let { field }: { field: AnyFieldApi } = $props();
</script>

<div>
	<label for={field.name}>{field.name}</label>
	<input
		id={field.name}
		name={field.name}
		value={field.state.value}
		onblur={field.handleBlur}
		oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
	/>
	{#if field.state.meta.isTouched}
		{#each field.state.meta.errors as error}
			<em>{JSON.stringify(error)}</em>
		{/each}
		{field.state.meta.isValidating ? 'Validating...' : ''}
	{/if}
</div>
