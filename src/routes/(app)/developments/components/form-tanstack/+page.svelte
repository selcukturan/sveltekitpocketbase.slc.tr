<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageProps } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { createForm } from '@tanstack/svelte-form';
	import Input from './Input.svelte';
	import { formSchema } from './schema';

	let { data, form }: PageProps = $props();

	// Form Instance(Form Örneği), tek bir formu temsil eden ve formla çalışmak için yöntemler ve özellikler sağlayan bir nesnedir.
	const tanstackForm = createForm(() => ({
		defaultValues: data.formInitialData,
		validators: {
			onChange: formSchema
		}
	}));

	const svelteForm = (): SubmitFunction => {
		return async ({ formElement, formData, action, cancel }) => {
			tanstackForm.handleSubmit();
			const formErrors = tanstackForm.getAllErrors();

			if (formErrors.form.errors.length > 0) {
				// Form verileri geçersizse, formu iptal et
				console.error('Form validation errors:', formErrors.form.errors);
				cancel(); // Form gönderimini iptal et
				return; // enhance callback'inden çık
			}

			return async ({ result, update }) => {
				await applyAction(result); // applyAction, form prop'unu otomatik güncelleyerek sunucu hatalarını (result.type === 'failure') veya başarı durumunu (result.type === 'success') yansıtır.

				if (result.type === 'success') {
					console.log('result.success', result);
				} else if (result.type === 'redirect') {
					// await goto(result.location, { invalidateAll: true }); // applyAction bunu zaten ele alabilir. Kullanmaya gerek yoktur. invalidateAll ile load fonksiyonu tekrar tetiklenir.
				} else if (result.type === 'error') {
					console.log('result.error', result);
				} else if (result.type === 'failure') {
					console.log('result.failure', result);
				} else {
					console.log('result', result);
				}
			};
		};
	};
</script>

<form method="POST" action="?/update" use:enhance={svelteForm()}>
	<tanstackForm.Field name="text_optional">
		{#snippet children(field)}
			<Input {field} />
		{/snippet}
	</tanstackForm.Field>

	<button type="submit">Submit</button>
</form>
