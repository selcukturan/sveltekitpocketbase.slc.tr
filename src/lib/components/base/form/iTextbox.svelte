<script lang="ts">
	import { getForm } from './forms.svelte';

	let { name, class: classes }: { name: string; class?: string } = $props();

	const ctx = getForm();
	console.log('iTextbox', ctx.test);
</script>

<ctx.tanstackForm.Field {name}>
	{#snippet children(field)}
		<div>
			<label for={field.name}>{field.name}</label>
			<input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onblur={field.handleBlur}
				oninput={(e) => field.handleChange((e.target as HTMLInputElement).value)}
				class={classes}
			/>
			{#if field.state.meta.isTouched}
				{#each field.state.meta.errors as error}
					<em>{JSON.stringify(error)}</em>
				{/each}
				{field.state.meta.isValidating ? 'Validating...' : ''}
			{/if}
		</div>
	{/snippet}
</ctx.tanstackForm.Field>
