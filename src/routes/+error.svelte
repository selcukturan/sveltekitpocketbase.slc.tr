<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { page } from '$app/state';

	const emojis = {
		404: '😮‍💨',
		500: '😮‍💨'
	} as const;
</script>

<h1>{page.status} {page.error?.message ? t(page.error.message, undefined, page.error.message) : t('error_generic')}</h1>
<span style="font-size: 10em">
	{emojis[page.status as keyof typeof emojis] ?? emojis[500]}
</span>
