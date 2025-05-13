<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { schema, type Schema } from './schema';
	import { zodError } from '$lib/client/utils';
	import { Page, Head } from '$lib/components/templates';

	let { data, form }: PageProps = $props();
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
		<form
			method="POST"
			action="?/update"
			use:enhance={({ formData, cancel }) => {
				try {
					// Valid Client FormData
					schema.parse(formData);
				} catch (error) {
					// Invalid Client FormData
					const { status, errors } = zodError(error);
					console.error(status, { success: false, errors });
					cancel(); // Form gönderimini iptal et
					return; // enhance callback'inden çık
				}

				return async ({ result, update }) => {
					await applyAction(result); // applyAction, form prop'unu otomatik güncelleyerek sunucu hatalarını (result.type === 'failure') veya başarı durumunu (result.type === 'success') yansıtır.

					if (result.type === 'success') {
						console.log('result.success', result);
					} else if (result.type === 'redirect') {
						await goto(result.location, { invalidateAll: true }); // applyAction bunu zaten ele alabilir. Kullanmaya gerek yoktur. invalidateAll ile load fonksiyonu tekrar tetiklenir.
					} else if (result.type === 'error') {
						console.log('result.error', result);
					} else if (result.type === 'failure') {
						console.log('result.failure', result);
					} else {
						console.log('result', result);
					}
				};
			}}
		>
			{#if form?.success}<p class="error">success</p>{/if}
			<label>
				text_optional
				<input name="text_optional" type="text" value={form?.text_optional ?? data?.form?.text_optional ?? ''} />
				<!-- <InputText name="text_optional" {form} dataForm={data?.form} /> -->
			</label>
			<button>Submit</button>
		</form>
	</Page.Main>
	<Page.Footer>
		<p>Form Page Footer</p>
	</Page.Footer>
</Page>
