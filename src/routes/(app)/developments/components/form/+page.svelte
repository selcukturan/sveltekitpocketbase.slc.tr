<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { formSchema } from './schema';
	import SuperDebug from 'sveltekit-superforms';

	let { data } = $props();

	// Client API:
	let { form, enhance, message, errors, constraints, submitting, delayed, timeout, formId } = superForm(data.form, {
		dataType: 'json',
		validators: valibot(formSchema),
		validationMethod: 'auto',
		customValidity: false,
		autoFocusOnError: 'detect',
		resetForm: false,
		delayMs: 500,
		timeoutMs: 2000
	});
</script>

<Head>
	<title>Form - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Form Page Header</p>
	</Page.Header>
	<Page.Main>
		<form method="POST" use:enhance>
			<input type="text" name="__superform_id" bind:value={$formId} />
			<label for="text_optional">text_optional</label>
			<input
				type="text"
				name="text_optional"
				aria-invalid={$errors.text_optional ? 'true' : undefined}
				bind:value={$form.text_optional}
				{...$constraints.text_optional}
			/>
			{#if $errors.text_optional}<span class="invalid">{$errors.text_optional}</span>{/if}

			<div><button>Submit</button></div>
			{#if $delayed}<span class="animate-spin">D</span>{/if}
			{#if $submitting}<span class="animate-spin">S</span>{/if}
			{#if $timeout}<span class="animate-spin">T</span>{/if}
			{#if $message}<p>{$message}</p>{/if}
		</form>
	</Page.Main>
	<Page.Footer>
		<SuperDebug data={$form} />
	</Page.Footer>
</Page>

<style>
	.invalid {
		color: red;
	}
</style>
