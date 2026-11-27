<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { isHttpError } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';

	// Şablonların (Page, Page.Main.Panel, DrawerFormContent.Content…) `boundary` özelliği bunu kullanır:
	// - pending: ilk yüklemede "Yükleniyor"
	// - failed: içerideki bir await hata verirse (ör. requirePermission → 403, silinmiş kayıt → 404) hata yalnızca bu
	//   alanda gösterilir; sayfanın tamamı hata sayfasına düşmez. "Tekrar dene" içeriği yeniden kurar.
	let { children }: { children?: Snippet } = $props();

	// Sunucu mesajı (çeviri anahtarı olabilir: 'error_forbidden'), değilse genel hata metni. Remote fonksiyon hataları
	// boundary'ye SvelteKit'in App.Error biçiminde gelir ({ status, type, errorId, message }), HttpError olarak değil.
	const isAppError = (error: unknown): error is App.Error => typeof error === 'object' && error !== null && 'errorId' in error && 'message' in error;
	const messageOf = (error: unknown) => {
		const message = isHttpError(error) ? error.body.message : isAppError(error) ? error.message : undefined;
		return message ? t(message, undefined, message) : t('error_generic');
	};
</script>

<svelte:boundary>
	{@render children?.()}

	{#snippet pending()}
		<p>{t('loading')}</p>
	{/snippet}

	{#snippet failed(error, reset)}
		<div role="alert" class="flex flex-col items-start gap-2 p-4">
			<p class="text-error-700">{messageOf(error)}</p>
			<button type="button" class="text-primary-700 cursor-pointer underline" onclick={reset}>{t('retry')}</button>
		</div>
	{/snippet}
</svelte:boundary>
