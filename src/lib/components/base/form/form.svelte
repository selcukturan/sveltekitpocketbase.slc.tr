<script lang="ts" generics="Schema extends GenericValibotObject">
	import { type Snippet } from 'svelte';
	import type { GenericValibotObject } from './types';
	import * as v from 'valibot';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance, applyAction } from '$app/forms';
	import * as devalue from 'devalue';

	import { createForm } from './forms.svelte';

	import type { RemoteForm, RemoteFormInput, RemoteFormIssue } from '@sveltejs/kit';

	let {
		children,
		class: classes,
		schema,
		defaultValues
	}: { children?: Snippet; class?: string; schema: Schema; defaultValues: Partial<v.InferInput<Schema>> } = $props();

	// Set Context
	const ctx = createForm(schema, defaultValues);

	// $inspect('ctx.inputs', ctx.inputs);
	$inspect('ctx.data', ctx.data);

	const svelteForm = (): SubmitFunction => {
		return async ({ formElement, formData, action, cancel }) => {
			// const formdata: { [key: string]: FormDataEntryValue | File[] | File | undefined | null } = Object.fromEntries(formData.entries());
			for (const [key, value] of formData.entries()) {
				formData.delete(key);
			}

			const result = ctx.safeParse();
			const jsonPayload = devalue.stringify(result.output); // devalue.parse(jsonPayload);
			formData.set('_slc_json', jsonPayload);

			// if (0 > 0) {
			// Form verileri geçersizse, formu iptal et
			// cancel(); // Form gönderimini iptal et
			// return; // enhance callback'inden çık
			// }

			// yeni URL üret

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
