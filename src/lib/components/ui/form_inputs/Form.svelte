<script lang="ts" generics="TInput extends RemoteFormInput, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>">
	import type { RemoteFormInput } from '$app/server';
	import { createFormInputsContext, type MainProps } from '#lib/components/ui/form_inputs/context.svelte.js';
	import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';
	import { t } from '#lib/app/localization/index.js';
	import { beforeNavigate, goto } from '$app/navigation';
	import { confirm } from '#lib/components/ui/confirm/index.js';

	let props: MainProps<TInput, TOutput, TSchema> = $props();

	// svelte-ignore state_referenced_locally
	const context = createFormInputsContext<TInput, TOutput, TSchema>(props); // init

	// Belirli bir alana ait olmayan hatalar (örn: sunucuda `invalid('...')` ya da formda karşılığı olmayan PocketBase alanı)
	const formIssues = $derived((context.props.form.fields.issues() ?? []).map((issue) => t(issue.message, undefined, issue.message)));

	// ######### BEGIN: kaydedilmemiş değişiklik uyarısı #########
	// - Sayfa yenileme, sekme kapatma, dış siteye gitme (willUnload): cancel() → tarayıcının kendi dialogu
	// - Uygulama içi geçiş (link, geri tuşu): cancel() → confirm → onaylanırsa goto
	// - Aynı sayfa içindeki hash değişiklikleri (drawer aç/kapa) atlanır; onları drawer'ın onBeforeClose'u ele alır
	let leaveConfirmed = false;
	beforeNavigate(({ from, to, willUnload, cancel }) => {
		if (leaveConfirmed || context.props.confirmLeave === false || !context.isChanged) return;
		if (!willUnload && from && to && from.url.pathname === to.url.pathname) return;

		cancel();
		if (willUnload || !to) return;

		confirm({ message: t('unsaved_changes_confirm'), yes: t('yes'), no: t('no') }).then((ok) => {
			if (!ok) return;
			leaveConfirmed = true;
			goto(to.url);
		});
	});
	// ######### END: kaydedilmemiş değişiklik uyarısı ###########
</script>

<form class="flex flex-1 flex-col overflow-hidden {context.props.formClass || ''}" {...context.formAttributes} {@attach context.watchIsChanged}>
	<div class="flex-1 overflow-x-hidden overflow-y-auto px-6 pb-6">
		{@render context.props.inputs?.({ isChanged: context.isChanged })}

		{#if formIssues.length > 0}
			<div class="bg-error-50 text-error-700 border-error-200 mt-2 rounded-sm border px-3 py-2 text-xs font-medium">
				{#each formIssues as message, i (i)}
					<p>{message}</p>
				{/each}
			</div>
		{/if}
	</div>
	<div class="bg-surface-50 flex justify-end border-t p-4">
		{@render context.props.buttons?.({ isChanged: context.isChanged })}
	</div>
	{@render context.props.children?.({ isChanged: context.isChanged })}
</form>
