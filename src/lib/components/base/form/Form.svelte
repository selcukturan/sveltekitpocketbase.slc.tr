<script lang="ts" generics="TInput = unknown, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>">
	import { type Snippet } from 'svelte';
	import { type BaseSchema, type BaseIssue } from 'valibot';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance, applyAction } from '$app/forms';

	import { createForm } from './forms.svelte';

	let {
		children,
		class: classes,
		schema,
		defaultValues
	}: { children?: Snippet; class?: string; schema: BaseSchema<TInput, TOutput, TIssue>; defaultValues: TInput } = $props();

	// Set Context
	const ctx = createForm(schema, defaultValues);
	console.log('Page', ctx.test);

	const svelteForm = (): SubmitFunction => {
		return async ({ formElement, formData, action, cancel }) => {
			ctx.tanstackForm.handleSubmit();
			const formErrors = ctx.tanstackForm.getAllErrors();

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

<form method="POST" action="?/update" use:enhance={svelteForm()} class={classes}>
	{#if children}
		{@render children()}
	{:else}
		<span>İçerik yok.</span>
	{/if}
</form>
