<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { tooltip } from '#lib/attachments/index.js';
	import { browser } from '$app/env';
	import { Icon } from '#lib/components/icons/index.js';

	type ThemeStateType = {
		preference: string;
		current: string;
	};
	let theme: ThemeStateType = $state({
		preference: 'system',
		current: browser ? JSON.parse(localStorage.getItem('slc:theme') as string)?.current || 'light' : 'light'
	});

	function getMediaTheme(): string {
		return browser ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 'light';
	}

	function toggle() {
		const upcoming_theme = theme.current === 'light' ? 'dark' : 'light';
		if (upcoming_theme === getMediaTheme()) {
			theme.preference = 'system';
		} else {
			theme.preference = upcoming_theme;
		}
		theme.current = upcoming_theme;
	}

	$effect(() => {
		// setInitialMode
		document.documentElement.classList.toggle('dark', theme.current === 'dark');
		// Mobil tarayıcı çubuğu: surface-50 (app.html ile aynı değerler)
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.current === 'dark' ? '#0d121a' : '#f8fafc');
		localStorage.setItem('slc:theme', JSON.stringify(theme));
	});
</script>

<!-- İkon düğmesi: geçerli temanın ikonu (güneş / ay) -->
<button type="button" onclick={toggle} aria-label={t('change_theme')} class="slc-icon-button" {@attach tooltip(t('change_theme'))}>
	<Icon name={theme.current === 'dark' ? 'moon' : 'sun'} size={20} />
</button>
