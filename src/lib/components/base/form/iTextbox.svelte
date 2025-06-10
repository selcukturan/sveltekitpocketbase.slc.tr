<script lang="ts">
	import { getForm } from './forms.svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { AnyFieldApi } from '@tanstack/svelte-form';

	let { name, class: classes }: { name: string; class?: string } = $props();

	const ctx = getForm();
	console.log('iTextbox', ctx.test);

	const inputAttach = (tanstackField: AnyFieldApi): Attachment => {
		return (inputNode) => {
			if (!(inputNode instanceof HTMLInputElement)) return;

			const onblur = (e: Event) => {
				console.log('before-tanstack-onblur');
				// tanstackField.setValue('1985-10-26T00:00');
				tanstackField.handleBlur;
			};

			const oninput = (e: Event) => {
				console.log('before-tanstack-oninput');
				tanstackField.handleChange((e.target as HTMLInputElement).value);
			};

			inputNode.addEventListener('blur', onblur);
			inputNode.addEventListener('input', oninput);

			return () => {
				inputNode.removeEventListener('blur', onblur);
				inputNode.removeEventListener('input', oninput);
			};
		};
	};
</script>

<ctx.tanstackForm.Field {name}>
	{#snippet children(field)}
		<div style:display="contents">
			<label for={field.name}>{field.name}</label>
			<input id={field.name} name={field.name} value={field.state.value} {@attach inputAttach(field)} class={classes} />
			{#if field.state.meta.isTouched}
				{#each field.state.meta.errors as error}
					<em>{JSON.stringify(error)}</em>
				{/each}
				{field.state.meta.isValidating ? 'Validating...' : ''}
			{/if}
		</div>
	{/snippet}
</ctx.tanstackForm.Field>
