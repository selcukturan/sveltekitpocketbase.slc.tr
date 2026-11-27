<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- kart href'leri menü verisinden (acl_resources) gelen uygulama içi tam yollar */
	import { onMount } from 'svelte';
	import { t, getSelectedLang } from '#lib/app/localization/index.js';
	import type { BaseTranslationKeys } from '#lib/app/localization/translations/index.js';
	import { config } from '#lib/app/config.js';
	import { Page, Head } from '#lib/components/templates/index.js';
	import { Icon, type IconKey } from '#lib/components/icons/index.js';
	import { can } from '#lib/app/acl/access.js';
	import { buildAppMenu } from '#lib/app/menu/menu.js';
	import { getMyAccess } from '#lib/remotes/acl.remote.js';
	import { getUser } from '#lib/remotes/guarded.remote.js';
	import { getGlobalContext } from '#lib/app/global.svelte.js';

	// Karşılama panosu: selamlama, kısa özet ve uygulamanın önemli bölümleri. Kartlar kaynak anahtarıyla menüye
	// bağlanır: kullanıcının erişemediği (ya da veritabanında olmayan) bölümün kartı görünmez, adres veritabanından gelir.

	type Feature = { key: string; icon: IconKey; title: BaseTranslationKeys; desc: BaseTranslationKeys; tone: string };

	// Tailwind sınıfları tam yazılmalı (dinamik birleştirme derlemede görünmez). Koyu temada tonlar kendiliğinden döner.
	const features: Feature[] = [
		{ key: 'grapes.crud.full', icon: 'grape', title: 'dash_f_crud_title', desc: 'dash_f_crud_desc', tone: 'bg-primary-100 text-primary-700' },
		{ key: 'data_table.demos.common', icon: 'data_table', title: 'dash_f_table_title', desc: 'dash_f_table_desc', tone: 'bg-info-100 text-info-700' },
		{ key: 'settings.system.permissions', icon: 'users', title: 'dash_f_acl_title', desc: 'dash_f_acl_desc', tone: 'bg-success-100 text-success-700' },
		{ key: 'settings.system.resources', icon: 'file_symlink', title: 'dash_f_resources_title', desc: 'dash_f_resources_desc', tone: 'bg-tertiary-100 text-tertiary-700' },
		{ key: 'developments.components.notifications', icon: 'bell', title: 'dash_f_notif_title', desc: 'dash_f_notif_desc', tone: 'bg-error-100 text-error-700' },
		{
			key: 'developments.components.form_slc',
			icon: 'square_code',
			title: 'dash_f_components_title',
			desc: 'dash_f_components_desc',
			tone: 'bg-secondary-100 text-secondary-800'
		}
	];

	// Menüde arama penceresi iskelette (app-layout); global bağlam üzerinden açılır (getContext: await'ten önce)
	const global = getGlobalContext();

	await getUser();
	await getMyAccess(); // ilk yükleme; tazelemeler .current ile (bkz. app-layout)
	const user = $derived(getUser().current);
	const acl = $derived(getMyAccess().current ?? { resources: [], access: {} });

	// Erişilebilen kartlar, adresleriyle
	const cards = $derived(
		features.flatMap((f) => {
			const resource = acl.resources.find((r) => r.key === f.key);
			return resource?.href && can(acl.access, f.key) ? [{ ...f, href: resource.href }] : [];
		})
	);

	const menu = $derived(buildAppMenu(acl.resources, acl.access));
	const pageCount = $derived(acl.resources.filter((r) => r.kind === 'page' && r.href && !r.hidden && can(acl.access, r.key)).length);

	// Saat ve tarih tarayıcıda hesaplanır (sunucunun saat dilimi farklı olabilir); o zamana kadar "Merhaba"
	let now = $state<Date | null>(null);
	onMount(() => (now = new Date()));
	const greetingKey = (h: number): BaseTranslationKeys =>
		h < 5 ? 'dash_greeting_night' : h < 12 ? 'dash_greeting_morning' : h < 18 ? 'dash_greeting_day' : h < 22 ? 'dash_greeting_evening' : 'dash_greeting_night';
	const greeting = $derived(t(now ? greetingKey(now.getHours()) : 'dash_greeting_hello'));
	const today = $derived(
		now?.toLocaleDateString(getSelectedLang() === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) ?? ''
	);

	const shortcuts = [
		{ keys: ['Ctrl', 'K'], label: 'dash_sc_search' },
		{ keys: ['↑', '↓'], label: 'dash_sc_navigate' },
		{ keys: ['Esc'], label: 'dash_sc_close' }
	] as const;
</script>

<Head>
	<title>{`${t('menu.home')} - ${t('app_name')}`}</title>
	<meta name="description" content={t('app_name')} />
</Head>

<Page>
	<Page.Main>
		<div class="mx-auto flex w-6xl max-w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
			<!-- Selamlama -->
			<section class="slc-card relative overflow-hidden p-6 sm:p-8" aria-labelledby="dash-greeting">
				<!-- Marka tonunda yumuşak vurgu -->
				<div
					class="from-primary-200/60 dark:from-primary-500/10 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-radial to-transparent blur-2xl"
					aria-hidden="true"
				></div>
				<div class="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
					<div class="max-w-2xl">
						<p class="text-surface-500 h-5 text-sm first-letter:uppercase">{today}</p>
						<h1 id="dash-greeting" class="text-surface-950 mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
							{greeting}{user?.name ? `, ${user.name}` : ''}
						</h1>
						<p class="text-surface-600 mt-2 text-sm sm:text-base">{t('dash_intro')}</p>
					</div>
					<div class="flex shrink-0 flex-wrap gap-2">
						<button
							type="button"
							onclick={() => global.openSearch()}
							class="bg-primary-500 text-surface-token-950 hover:bg-primary-400 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold"
						>
							<Icon name="search" size={18} />
							{t('dash_search')}
							<kbd class="border-surface-token-950/30 hidden rounded border px-1 font-sans text-[11px] sm:inline">Ctrl K</kbd>
						</button>
						<a
							href="https://github.com/selcukturan/sveltekitpocketbase.slc.tr"
							target="_blank"
							rel="noopener noreferrer"
							class="border-surface-300 text-surface-800 hover:bg-surface-100 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium"
						>
							<Icon name="square_code" size={18} />
							{t('dash_github')}
						</a>
					</div>
				</div>

				<!-- Özet -->
				<dl class="border-surface-200 relative mt-6 grid grid-cols-3 gap-4 border-t pt-5">
					<div>
						<dt class="text-surface-500 text-xs sm:text-sm">{t('dash_stat_modules')}</dt>
						<dd class="text-surface-950 text-xl font-semibold tabular-nums sm:text-2xl">{menu.length}</dd>
					</div>
					<div>
						<dt class="text-surface-500 text-xs sm:text-sm">{t('dash_stat_pages')}</dt>
						<dd class="text-surface-950 text-xl font-semibold tabular-nums sm:text-2xl">{pageCount}</dd>
					</div>
					<div class="min-w-0">
						<dt class="text-surface-500 text-xs sm:text-sm">{t('dash_stat_version')}</dt>
						<dd class="text-surface-950 truncate text-sm font-semibold tabular-nums sm:text-base">{config.version}</dd>
					</div>
				</dl>
			</section>

			<div class="grid gap-6 lg:grid-cols-[1fr_18rem]">
				<!-- Öne çıkanlar -->
				<section aria-labelledby="dash-features">
					<h2 id="dash-features" class="text-surface-950 text-lg font-semibold">{t('dash_features')}</h2>
					<p class="text-surface-500 mb-4 text-sm">{t('dash_features_desc')}</p>
					{#if cards.length}
						<ul class="grid gap-4 sm:grid-cols-2">
							{#each cards as card (card.key)}
								<li>
									<a href={card.href} class="slc-card group hover:border-primary-400 flex h-full gap-4 p-4 transition-colors">
										<span class="{card.tone} inline-flex size-11 shrink-0 items-center justify-center rounded-lg" aria-hidden="true">
											<Icon name={card.icon} size={22} />
										</span>
										<span class="min-w-0 flex-1">
											<span class="text-surface-950 flex items-center gap-1 font-semibold">
												{t(card.title)}
												<Icon name="chevron_right" size={16} class="text-surface-400 group-hover:text-primary-600 transition-transform group-hover:translate-x-0.5" />
											</span>
											<span class="text-surface-600 mt-1 block text-sm">{t(card.desc)}</span>
										</span>
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="slc-card text-surface-600 p-6 text-sm">{t('dash_empty')}</p>
					{/if}
				</section>

				<!-- Yan sütun -->
				<aside class="flex flex-col gap-4">
					<section class="slc-card p-4" aria-labelledby="dash-shortcuts">
						<h2 id="dash-shortcuts" class="text-surface-950 mb-3 text-sm font-semibold">{t('dash_shortcuts')}</h2>
						<ul class="flex flex-col gap-2.5">
							{#each shortcuts as sc (sc.label)}
								<li class="flex items-center justify-between gap-3 text-sm">
									<span class="text-surface-700">{t(sc.label)}</span>
									<span class="flex gap-1">
										{#each sc.keys as key (key)}
											<kbd class="border-surface-300 bg-surface-100 text-surface-700 min-w-6 rounded border px-1.5 py-0.5 text-center font-sans text-xs">{key}</kbd>
										{/each}
									</span>
								</li>
							{/each}
						</ul>
					</section>
					<section class="slc-card p-4" aria-labelledby="dash-tip">
						<h2 id="dash-tip" class="text-surface-950 mb-1 flex items-center gap-2 text-sm font-semibold">
							<Icon name="info" size={16} class="text-primary-600" />
							{t('dash_tip_title')}
						</h2>
						<p class="text-surface-600 text-sm">{t('dash_tip')}</p>
					</section>
				</aside>
			</div>
		</div>
	</Page.Main>
</Page>
