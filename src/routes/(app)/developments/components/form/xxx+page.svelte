<script lang="ts">
	import { Head, Page, Header, Main, Footer } from '$lib/components/base/templates';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { schema, type Schema } from './schema';
	import { ZodError } from 'zod';

	let { data, form }: PageProps = $props();
</script>

<Head>
	<title>Form - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Header><p>Form Page Header</p></Header>
	<Main>
		<form
			method="POST"
			action="?/update"
			use:enhance={({ formData, cancel }) => {
				try {
					// Valid Client FormData
					const updateData = schema.parse(formData);
					console.log('updateData', updateData);
				} catch (error) {
					// Invalid Client FormData
					if (error instanceof ZodError) {
						let message = error.issues.map((issue) => `${issue.path[0]}: ${issue.message}`).join(', ');
						console.error('ZodError', { message, missing: true });
					} else {
						console.error('UnknownError', { error, missing: true });
					}
					cancel();
				}

				return async ({ result, update }) => {
					if (result.type === 'success') {
						console.log('result.success', result);
					} else if (result.type === 'redirect') {
						console.log('result.redirect', result);
						goto(result.location);
					} else if (result.type === 'error') {
						console.log('result.error', result);
					} else if (result.type === 'failure') {
						console.log('result.failure', result);
					} else {
						console.log('result', result);
					}
					await applyAction(result);
				};
			}}
		>
			{#if form?.missing}<p class="error">The email field is required</p>{/if}
			{#if form?.success}<p class="error">success</p>{/if}
			<label>
				text_optional
				<input name="text_optional" type="text" value={form?.text_optional ?? data.form.text_optional ?? ''} />
			</label>
			<button>Submit</button>
		</form>
	</Main>
	<Footer><p>Form Page Footer</p></Footer>
</Page>
