<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head } from '#lib/components/templates/index.js';
	import * as formInput from '#lib/components/ui/form_inputs/index.js';
	import { Toasts, createToaster } from '#lib/components/ui/toast/index.js';
	import { settingsFormSchema } from './page.shared';
	import { getSettings, updateSettings } from './page.remote';

	const toaster = createToaster({ name: 'settings-toaster', position: 'bottom-center' });

	// Kaydetme: gönderim, ayarları tazeleme, bildirim (form sayfada açık kalır; drawer yok)
	const save = formInput.createFormSave({ updates: () => [getSettings()], onSuccess: toaster.success, onError: toaster.error });
</script>

<Head>
	<title>{t('settings_application')} - SLC Web Applications</title>
</Head>

<Toasts toasterName="settings-toaster" />

<Page>
	<Page.Header class="p-4">
		<h1 class="text-lg font-semibold">{t('settings_application')}</h1>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel boundary>
			{@const settings = await getSettings()}
			{#if settings}
				<!-- Drawer'daki formla aynı bileşen; burada sayfa içinde açık kalır. Kayıttan sonra "değişiklik yok" durumuna döner. -->
				<formInput.Form schema={settingsFormSchema} form={updateSettings} formClass="overflow-visible!" {...updateSettings.preflight(settingsFormSchema).enhance(save)}>
					{#snippet inputs()}
						<formInput.Hidden field={updateSettings.fields.id} value={settings.id} />
						<formInput.Text label={t('settings_application_name')} field={updateSettings.fields.application_name} value={settings.application_name} />
					{/snippet}
					{#snippet buttons({ isChanged } = {})}
						<formInput.Button type="reset" variant="ghost" color="surface" label={t('form_reset')} disabled={!isChanged} />
						<formInput.Button type="submit" label={t('update')} disabled={Boolean(updateSettings.pending) || !isChanged} />
					{/snippet}
				</formInput.Form>
			{:else}
				<p class="text-surface-600 text-sm">{t('settings_not_found')}</p>
			{/if}
		</Page.Main.Panel>
	</Page.Main>
</Page>
