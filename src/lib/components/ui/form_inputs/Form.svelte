<script lang="ts" generics="TInput extends RemoteFormInput, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>">
	import type { RemoteFormInput } from '$app/server';
	import { createFormInputsContext, type MainProps } from '#lib/components/ui/form_inputs/context.svelte.js';
	import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';
	import { t } from '#lib/app/localization/index.js';
	import { beforeNavigate, goto } from '$app/navigation';
	import { confirm } from '#lib/components/ui/confirm/index.js';
	import { tick, untrack } from 'svelte';
	import { on } from 'svelte/events';
	import type { Attachment } from 'svelte/attachments';

	let props: MainProps<TInput, TOutput, TSchema> = $props();

	// svelte-ignore state_referenced_locally
	const context = createFormInputsContext<TInput, TOutput, TSchema>(props); // init

	// Belirli bir alana ait olmayan hatalar (örn: sunucuda `invalid('...')` ya da formda karşılığı olmayan PocketBase alanı)
	const formIssues = $derived((context.props.form.fields.issues() ?? []).map((issue) => t(issue.message, undefined, issue.message)));

	// ######### BEGIN: kaydedilmemiş değişiklik uyarısı #########
	// - Sayfa yenileme, sekme kapatma, dış siteye gitme (willUnload): cancel() → tarayıcının kendi dialogu
	// - Uygulama içi geçiş (link): cancel() → confirm → onaylanırsa goto
	// - Geri/ileri tuşu (popstate): cancel() → confirm → onaylanırsa history.go(delta); goto geçmişe yeni kayıt ekleyip geçmişi bozardı
	// - Aynı sayfa içindeki hash değişiklikleri (drawer aç/kapa) atlanır; onları drawer'ın onBeforeClose'u ele alır
	let leaveConfirmed = false;
	beforeNavigate((navigation) => {
		const { from, to, willUnload, cancel } = navigation;
		if (leaveConfirmed || context.props.confirmLeave === false || !context.isChanged) return;
		if (!willUnload && from && to && from.url.pathname === to.url.pathname) return;

		cancel();
		if (willUnload || !to) return;

		const delta = navigation.type === 'popstate' ? navigation.delta : 0;

		confirm({ message: t('unsaved_changes_confirm'), yes: t('yes'), no: t('no') }).then((ok) => {
			if (!ok) return;
			leaveConfirmed = true;
			if (delta) return history.go(delta);
			// eslint-disable-next-line svelte/no-navigation-without-resolve -- to.url SvelteKit'ten gelen, base path'i içeren tam URL
			goto(to.url);
		});
	});
	// ######### END: kaydedilmemiş değişiklik uyarısı ###########

	// ######### BEGIN: formu sıfırla (<button type="reset">) #########
	// Tarayıcının reset'i yalnızca yerel <input>'ları boşaltır; özel bileşenleri (Select, Relation, File...) bilmez.
	// SvelteKit reset olayında hataları/touched durumunu temizler. Ardından inputlar {#key} ile yeniden kurulur ve
	// her biri ilk değerini (create: boş, update: veritabanı değeri) tekrar yazar.
	let resetKey = $state(0);
	const resetAttach: Attachment<HTMLFormElement> = (node) =>
		on(node, 'reset', async () => {
			await tick(); // SvelteKit'in reset işleyicisi (bir tick bekler) önce çalışsın
			await tick();
			context.initialData.clear();
			context.currentData.clear();
			resetKey++;
		});

	// Başarılı gönderimden sonra (form.result değişir) güncel değerler yeni ilk değer kabul edilir.
	// Açık kalan formlarda (ör. ayarlar sayfası) "değişiklik var" durumu kendiliğinden temizlenir.
	// Koşul: sunucudaki form fonksiyonu başarıda bir değer döndürmeli; döndürmezse result hep undefined kalır ve bu
	// çalışmaz. Kalıcı çözüm (ertelendi): enhance'i Form üstlenir (onsave prop'u), başarıda doğrudan markClean çağrılır.
	$effect(() => {
		if (context.props.form.result !== undefined) untrack(() => context.markClean());
	});
	// ######### END: formu sıfırla ###################################
</script>

<form class="flex flex-1 flex-col overflow-hidden {context.props.formClass || ''}" {...context.formAttributes} {@attach context.watchIsChanged} {@attach resetAttach}>
	<div class="flex-1 overflow-x-hidden overflow-y-auto px-6 pb-6">
		{#key resetKey}
			{@render context.props.inputs?.({ isChanged: context.isChanged })}
		{/key}

		{#if formIssues.length > 0}
			<div role="alert" class="bg-error-50 text-error-700 border-error-200 mt-2 rounded-sm border px-3 py-2 text-xs font-medium">
				{#each formIssues as message, i (i)}
					<p>{message}</p>
				{/each}
			</div>
		{/if}
	</div>
	<div class="border-surface-200 flex border-t p-4 {context.props.buttonsClass ?? 'justify-between'}">
		{@render context.props.buttons?.({ isChanged: context.isChanged })}
	</div>
	{@render context.props.children?.({ isChanged: context.isChanged })}
</form>
