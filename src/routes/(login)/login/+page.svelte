<script lang="ts">
	import { ThemeToggle } from '#lib/components/ui/theme-toggle/index.js';
	import { LangToggle } from '#lib/components/ui/lang-toggle/index.js';
	import { config } from '#lib/app/config.js';
	import { features } from '#lib/app/features.js';
	import { getToaster } from '#lib/components/ui/toast/index.js';
	import { login } from '#lib/remotes/guarded.remote.js';
	import { loginSchema } from '#lib/app/schemas/login.js';
	import { t } from '#lib/app/localization/index.js';
	import { resolve } from '$app/paths';
	import { getUser } from '#lib/remotes/guarded.remote.js';
	import { Icon } from '#lib/components/icons/index.js';

	// Giriş: geniş ekranda solda marka paneli (öne çıkan üç bölüm, illüstrasyon), sağda form kartı; dar ekranda yalnızca form.
	const loginPageToaster = getToaster('app-toaster');

	let isLoading = $state('init');

	const highlights = features.filter((f) => ['settings.system.permissions', 'data_table.demos.common', 'developments.components.notifications'].includes(f.key));

	const inputClass =
		'border-surface-300 bg-surface-50 text-surface-950 placeholder:text-surface-400 hover:border-surface-400 focus-visible:border-primary-500 h-11 w-full rounded-lg border px-3 text-base sm:text-sm';
</script>

<svelte:head>
	<title>{`${t('login_page_title')} - ${t('app_name')}`}</title>
	<meta name="description" content={`${t('login_page_title')} - ${t('app_name')}`} />
</svelte:head>

<!-- body overflow: hidden (uygulama iskeleti için); sayfa kendi içinde kayar -->
<div class="bg-surface-100 grid h-dvh overflow-y-auto lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
	<!-- Marka paneli (≥ 1140 px) -->
	<aside class="bg-surface-50 relative hidden flex-col overflow-hidden border-r p-10 lg:flex">
		<div
			class="from-primary-200/70 dark:from-primary-500/10 pointer-events-none absolute -top-40 -left-40 size-[32rem] rounded-full bg-radial to-transparent blur-2xl"
			aria-hidden="true"
		></div>

		<a href={resolve('/(site)')} class="relative flex items-center gap-3 self-start">
			<img class="size-10 select-none" src="/images/logo/logo_512.png" alt="" />
			<span class="text-surface-950 font-semibold">{t('app_name')}</span>
		</a>

		<div class="relative my-auto flex flex-col gap-8 py-10">
			<div>
				<h1 class="text-surface-950 text-3xl font-bold tracking-tight xl:text-4xl">{t('login_page_welcome_message')}</h1>
				<p class="text-surface-600 mt-3 max-w-md">{t('login_brand_desc')}</p>
			</div>
			<ul class="flex flex-col gap-4">
				{#each highlights as f (f.key)}
					<li class="flex items-center gap-3">
						<span class="{f.tone} inline-flex size-9 shrink-0 items-center justify-center rounded-lg" aria-hidden="true"><Icon name={f.icon} size={18} /></span>
						<span class="text-surface-800 text-sm font-medium">{t(f.title)}</span>
					</li>
				{/each}
			</ul>
			<img class="max-w-md select-none xl:max-w-lg" alt="" src="/images/ui/illustrations/illustration_dashboard.png" />
		</div>

		<p class="text-surface-500 relative text-xs tabular-nums">{config.version}</p>
	</aside>

	<!-- Form -->
	<main class="flex min-h-dvh flex-col p-4 sm:p-6">
		<div class="flex items-center justify-between">
			<a href={resolve('/(site)')} class="text-surface-600 hover:text-surface-950 inline-flex items-center gap-1 text-sm">
				<Icon name="chevron_left" size={16} />
				{t('login_back_home')}
			</a>
			<div class="flex items-center gap-1">
				<ThemeToggle />
				<LangToggle />
			</div>
		</div>

		<div class="flex flex-1 items-center justify-center py-8">
			<div class="slc-card w-full max-w-sm p-6 sm:p-8">
				<img class="mb-6 size-10 select-none lg:hidden" src="/images/logo/logo_512.png" alt={t('app_name')} />
				<h2 class="text-surface-950 text-2xl font-bold tracking-tight">{t('login_title')}</h2>
				<p class="text-surface-600 mt-1 text-sm">{t('login_subtitle')}</p>

				<p class="border-info-200 bg-info-50 text-info-800 mt-5 flex gap-2 rounded-lg border p-3 text-xs">
					<Icon name="info" size={16} class="mt-px" />
					<span>{t('login_demo_hint')}</span>
				</p>

				<form
					class="mt-5 flex flex-col gap-4"
					{...login.preflight(loginSchema).enhance(async ({ submit }) => {
						if (isLoading === 'loading') return;
						isLoading = 'loading';

						try {
							if (await submit().updates(getUser)) {
								// user is logged in, do nothing.
								isLoading = 'success';
							} else {
								loginPageToaster.add({
									type: 'error',
									title: t('error'),
									description: t('invalid_data')
								});
								isLoading = 'fail';
							}
						} catch (e) {
							loginPageToaster.add({
								type: 'error',
								title: t('error'),
								description: t('error_user_or_password_incorrect')
							});
							isLoading = 'error';
						}
					})}
				>
					<label class="flex flex-col gap-1.5">
						<span class="text-surface-800 text-sm font-medium select-none">{t('login_page_email_label')}</span>
						<input {...login.fields.email.as('text', 'demo@slc.tr')} autocomplete="username" class={inputClass} />
						{#each login.fields.email.issues() ?? [] as issue, index (index)}
							<p class="text-error-600 text-xs">{t(issue.message)}</p>
						{/each}
					</label>

					<label class="flex flex-col gap-1.5">
						<span class="text-surface-800 text-sm font-medium select-none">{t('login_page_password_label')}</span>
						<input {...login.fields._password.as('password', 'SLc1234567')} autocomplete="current-password" class={inputClass} />
						{#each login.fields._password.issues() ?? [] as issue, index (index)}
							<p class="text-error-600 text-xs">{t(issue.message)}</p>
						{/each}
					</label>

					<button type="submit" class="slc-btn-primary mt-2 h-11 w-full" disabled={isLoading === 'loading'}>
						{#if isLoading === 'loading'}
							<Icon name="loader" size={18} class="animate-spin" />
						{:else if isLoading === 'success'}
							<Icon name="circle_check" size={18} />
						{:else if isLoading === 'error'}
							<Icon name="circle_x" size={18} />
						{:else}
							<Icon name="user" size={18} />
						{/if}
						{t('login_page_submit_button')}
					</button>
				</form>
			</div>
		</div>

		<p class="text-surface-500 text-center text-xs tabular-nums lg:hidden">{`${t('app_name')} · ${config.version}`}</p>
	</main>
</div>
