<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from '#lib/app/localization/index.js';
	import { config } from '#lib/app/config.js';
	import { features, GITHUB_URL } from '#lib/app/features.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { ThemeToggle } from '#lib/components/ui/theme-toggle/index.js';
	import { LangToggle } from '#lib/components/ui/lang-toggle/index.js';

	// Herkese açık tanıtım sayfası: üst çubuk, hero, özellikler, teknolojiler, çağrı, alt bilgi.
	let { data } = $props();

	const cta = $derived(data.loggedIn ? { href: resolve('/(app)/app'), label: t('landing_open_app') } : { href: resolve('/(login)/login'), label: t('landing_try_demo') });

	const tech = ['SvelteKit', 'Svelte 5', 'PocketBase', 'Tailwind CSS 4', 'TypeScript', 'Valibot', 'Playwright'];
</script>

<svelte:head>
	<title>{t('app_name')}</title>
	<meta name="description" content={t('landing_subtitle')} />
</svelte:head>

<!-- body overflow: hidden (uygulama iskeleti için); bu sayfa kendi içinde kayar -->
<div class="bg-surface-100 h-dvh overflow-y-auto">
	<!-- Üst çubuk -->
	<header class="bg-surface-50/85 sticky top-0 z-10 border-b backdrop-blur">
		<div class="mx-auto flex h-14 w-6xl max-w-full items-center gap-3 px-4 sm:px-6">
			<a href={resolve('/(site)')} class="flex min-w-0 items-center gap-2">
				<img class="size-8 select-none" src="/images/logo/logo_512.png" alt="" />
				<span class="text-surface-950 truncate font-semibold">{t('app_name')}</span>
			</a>
			<div class="ml-auto flex items-center gap-1">
				<ThemeToggle />
				<LangToggle />
				<a href={cta.href} class="slc-btn-primary ml-2 h-9 px-3">{data.loggedIn ? t('landing_open_app') : t('login_title')}</a>
			</div>
		</div>
	</header>

	<main>
		<!-- Hero -->
		<section class="relative overflow-hidden">
			<div
				class="from-primary-200/70 dark:from-primary-500/10 pointer-events-none absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-radial to-transparent blur-3xl"
				aria-hidden="true"
			></div>
			<div class="relative mx-auto grid w-6xl max-w-full items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2">
				<div>
					<p class="border-primary-300 bg-primary-50 text-primary-800 inline-flex rounded-full border px-3 py-1 text-xs font-medium">{t('landing_badge')}</p>
					<h1 class="text-surface-950 mt-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">{t('landing_title')}</h1>
					<p class="text-surface-600 mt-5 max-w-xl text-lg text-pretty">{t('landing_subtitle')}</p>
					<div class="mt-8 flex flex-wrap gap-3">
						<a href={cta.href} class="slc-btn-primary h-11 px-5">
							{cta.label}
							<Icon name="chevron_right" size={18} />
						</a>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- dış adres -->
						<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" class="slc-btn-outline bg-surface-50 h-11 px-5">
							<Icon name="square_code" size={18} />
							GitHub
						</a>
					</div>
				</div>
				<img class="mx-auto w-full max-w-lg select-none" src="/images/ui/illustrations/illustration_dashboard.png" alt="" />
			</div>
		</section>

		<!-- Özellikler -->
		<section class="mx-auto w-6xl max-w-full px-4 py-14 sm:px-6" aria-labelledby="landing-features">
			<div class="max-w-2xl">
				<h2 id="landing-features" class="text-surface-950 text-2xl font-bold tracking-tight sm:text-3xl">{t('landing_features_title')}</h2>
				<p class="text-surface-600 mt-2">{t('landing_features_desc')}</p>
			</div>
			<ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as f (f.key)}
					<li class="slc-card p-5">
						<span class="{f.tone} inline-flex size-11 items-center justify-center rounded-lg" aria-hidden="true"><Icon name={f.icon} size={22} /></span>
						<h3 class="text-surface-950 mt-4 font-semibold">{t(f.title)}</h3>
						<p class="text-surface-600 mt-1 text-sm">{t(f.desc)}</p>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Teknolojiler -->
		<section class="mx-auto w-6xl max-w-full px-4 pb-14 sm:px-6" aria-labelledby="landing-tech">
			<h2 id="landing-tech" class="text-surface-500 text-center text-sm font-medium">{t('landing_tech_title')}</h2>
			<ul class="mt-4 flex flex-wrap justify-center gap-2">
				{#each tech as name (name)}
					<li class="border-surface-300 bg-surface-50 text-surface-700 rounded-full border px-3 py-1 text-sm">{name}</li>
				{/each}
			</ul>
		</section>

		<!-- Çağrı -->
		<section class="mx-auto w-6xl max-w-full px-4 pb-16 sm:px-6">
			<div class="slc-card flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="text-surface-950 text-xl font-bold">{t('landing_cta_title')}</h2>
					<p class="text-surface-600 mt-1 text-sm">{t('landing_cta_desc')}</p>
				</div>
				<a href={cta.href} class="slc-btn-primary h-11 shrink-0 px-5">
					{cta.label}
					<Icon name="chevron_right" size={18} />
				</a>
			</div>
		</section>
	</main>

	<footer class="border-t">
		<div class="text-surface-500 mx-auto flex w-6xl max-w-full flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs sm:px-6">
			<p>© {new Date().getFullYear()} SLC · {t('landing_footer')}</p>
			<p class="tabular-nums">{config.version}</p>
		</div>
	</footer>
</div>
