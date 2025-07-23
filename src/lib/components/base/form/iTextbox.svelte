<script lang="ts">
	import { getForm } from './forms.svelte';
	import type { Attachment } from 'svelte/attachments';

	let { name, class: classes }: { name: string; class?: string } = $props();

	const ctx = getForm();
	console.log('iTextbox', ctx.test);

	const inputAttach = (name: string): Attachment => {
		return (inputNode) => {
			if (!(inputNode instanceof HTMLInputElement)) return;

			const onblur = (e: Event) => {
				console.log('before-tanstack-onblur');
				// tanstackField.setValue('1985-10-26T00:00');
				// tanstackField.handleBlur;
			};

			const oninput = (e: Event) => {
				console.log('before-tanstack-oninput');
				// tanstackField.handleChange((e.target as HTMLInputElement).value);
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

<div style:display="contents">
	<label for={name}>{name}</label>
	<input id={name} {name} value={ctx.test} {@attach inputAttach(name)} class={classes} />
	<!-- {#if field.state.meta.isTouched}
		{#each field.state.meta.errors as error}
			<em>{JSON.stringify(error)}</em>
		{/each}
		{field.state.meta.isValidating ? 'Validating...' : ''}
	{/if} -->
</div>
