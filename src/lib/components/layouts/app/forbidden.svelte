<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { resolve } from '$app/paths';
	import { Icon } from '#lib/components/icons/index.js';

	// Sayfaya erişim yoksa sayfanın yerine çizilir (app-layout). Sayfa bileşeni hiç kurulmaz: remote fonksiyonları
	// çağrılmaz. Asıl koruma yine sunucudadır (requirePermission).
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center" data-testid="forbidden">
	<Icon name="circle_alert" size={48} class="text-surface-400" />
	<h1 class="text-surface-800 text-xl font-semibold">{t('forbidden_title')}</h1>
	<p class="text-surface-500">{t('forbidden_description')}</p>
	<a href={resolve('/(app)/app')} class="text-primary-700 underline">{t('forbidden_back')}</a>
</div>
