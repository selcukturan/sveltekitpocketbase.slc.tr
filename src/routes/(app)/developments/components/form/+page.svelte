<script lang="ts">
	import { Head, Page, Header, Main, Footer } from '$lib/components/base/templates';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { enhance, applyAction } from '$app/forms';
	import { schema } from './schema'; // Schema hala gerekli
	import { ZodError } from 'zod';
	import { formatZodError, GENERAL_ERROR_KEY, type FieldErrors } from '$lib/client/formError'; // Hata formatlayıcıyı import et

	let { data, form }: PageProps = $props(); // form artık action'dan gelen sonucu içerir

	let clientErrors: FieldErrors = $state({}); // İstemci tarafı anlık hatalar için state
	let submitting = $state(false); // Form gönderim durumu

	// Formdan gelen hataları reaktif olarak izle
	let serverErrors = $derived(form?.errors ?? {});
	let isSuccess = $derived(form?.success ?? false); // Sunucudan gelen başarı durumu

	// Form prop'u değiştiğinde istemci hatalarını temizle (sunucu hatası geldiğinde)
	$effect(() => {
		if (form) {
			// form null değilse (bir action sonucu geldiyse)
			clientErrors = {}; // Sunucudan yanıt gelince istemci hatalarını sıfırla
			submitting = false; // Gönderim tamamlandı
		}
	});

	// Genel hata mesajlarını almak için bir yardımcı
	let generalServerErrors = $derived(serverErrors?.[GENERAL_ERROR_KEY] ?? []);

	// Alan bazlı hataları almak için fonksiyon
	function getFieldError(fieldName: string): string[] | undefined {
		// Önce istemci hatasına bak, yoksa sunucu hatasına bak
		return clientErrors[fieldName] ?? serverErrors?.[fieldName];
	}

	function clearClientErrors() {
		clientErrors = {};
	}
</script>

<Head>
	<title>Form - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Header><p>Form Page Header</p></Header>
	<Main>
		<h2>Form Example</h2>

		{#if isSuccess}
			<p class="success">İşlem başarıyla tamamlandı!</p>
		{/if}

		{#if generalServerErrors.length > 0}
			<div class="error-summary">
				<strong>Form gönderilemedi:</strong>
				<ul>
					{#each generalServerErrors as error}
						<li>{error}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<form
			method="POST"
			action="?/update"
			aria-busy={submitting}
			oninput={clearClientErrors}
			use:enhance={({ formData, cancel }) => {
				submitting = true; // Gönderim başladı
				clientErrors = {}; // Önceki istemci hatalarını temizle

				try {
					// Client-Side Validation (İsteğe Bağlı ama Önerilir)
					// Sunucuya göndermeden önce hızlı geri bildirim sağlar
					schema.parse(formData);
					console.log('Client validation passed.');
					// Doğrulama başarılı, gönderime izin ver
				} catch (error) {
					submitting = false; // Gönderim iptal edildi
					if (error instanceof ZodError) {
						clientErrors = formatZodError(error);
						console.warn('Client-side Zod Validation Error:', clientErrors);
					} else {
						console.error('Unknown Client Validation Error:', error);
						clientErrors = { [GENERAL_ERROR_KEY]: ['Beklenmedik bir hata oluştu.'] };
					}
					cancel(); // Form gönderimini iptal et
					return; // enhance callback'inden çık
				}

				// enhance'in sonuç işleyicisi
				return async ({ result, update }) => {
					// applyAction, form prop'unu otomatik güncelleyerek
					// sunucu hatalarını (result.type === 'failure') veya
					// başarı durumunu (result.type === 'success') yansıtır.
					await applyAction(result);

					// `form` prop'u applyAction tarafından güncellendiği için
					// `submitting` state'i $effect içinde zaten false yapılıyor.
					// İsterseniz burada da yapabilirsiniz: submitting = false;

					if (result.type === 'redirect') {
						// Yönlendirme varsa goto ile git
						// applyAction bunu zaten ele alabilir, ama manuel kontrol de iyidir.
						await goto(result.location, { invalidateAll: true }); // invalidateAll ile load fonksiyonunu tekrar tetikle
					} else if (result.type === 'error') {
						console.error('Enhance Action Error:', result.error);
						// İsterseniz burada genel bir hata gösterebilirsiniz
						clientErrors = { [GENERAL_ERROR_KEY]: ['Sunucu hatası: ' + (result.error?.message ?? 'Bilinmeyen hata')] };
					}

					// Başarı veya Başarısızlık durumunda ek mantık (isteğe bağlı)
					if (result.type === 'success') {
						console.log('Action successful (client)', result);
						// Formu sıfırlama veya başka işlemler burada yapılabilir.
						// Belki bir başarı mesajı göstermek için state güncellenebilir.
					} else if (result.type === 'failure') {
						console.warn('Action failed (client)', result.data);
						// Hatalar zaten `form.errors` içinde olacak (applyAction sayesinde)
					}
				};
			}}
		>
			{#if submitting}
				<p>Gönderiliyor...</p>
			{/if}

			<!-- Genel İstemci Hataları (Sunucu dışı) -->
			{#if clientErrors[GENERAL_ERROR_KEY]}
				<p class="error">{clientErrors[GENERAL_ERROR_KEY]?.[0]}</p>
			{/if}

			<label>
				Optional Text
				<input
					name="text_optional"
					type="text"
					value={form?.formData?.text_optional ?? data.form.text_optional ?? ''}
					aria-invalid={!!getFieldError('text_optional')}
					aria-describedby={getFieldError('text_optional') ? 'text_optional-error' : undefined}
				/>
				{#if getFieldError('text_optional')}
					<p class="error" id="text_optional-error">{getFieldError('text_optional')?.[0]}</p>
				{/if}
			</label>

			<button type="submit" disabled={submitting}>Submit</button>
		</form>
	</Main>
	<Footer><p>Form Page Footer</p></Footer>
</Page>

<style>
	.error {
		color: red;
		font-size: 0.9em;
		margin-top: 0.2em;
	}
	.success {
		color: green;
	}
	.error-summary {
		color: red;
		border: 1px solid red;
		padding: 10px;
		margin-bottom: 1em;
	}
	label {
		display: block;
		margin-bottom: 1em;
	}
	input[aria-invalid='true'] {
		border-color: red;
	}
	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
