<script lang="ts">
	import { t } from '$lib/app/localization.svelte';
	import { tooltip } from '$lib/attachments';
	import { browser } from '$app/environment';
	import { Icon } from '$lib/components/icons';

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
		if (theme.current === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.setItem('slc:theme', JSON.stringify(theme));
	});
</script>

<button
	onclick={toggle}
	aria-pressed={theme.current === 'dark' ? 'true' : 'false'}
	aria-label="Theme mode"
	class="bg-surface-50 hover:border-surface-400 relative block h-5.5 w-10 rounded-xl border hover:cursor-pointer"
	{@attach tooltip(t('change_theme'))}
>
	<span
		class="bg-surface-300 pointer-events-none absolute top-px left-px flex h-4.5 w-4.5 items-center justify-center overflow-hidden rounded-full p-0.5 shadow transition-transform"
		class:translate-x-4.5={theme.current === 'dark'}
	>
		<Icon name={theme.current === 'dark' ? 'moon' : 'sun'} size="100%" />
	</span>
</button>
