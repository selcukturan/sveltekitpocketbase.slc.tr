<script lang="ts">
	import { ThemeToggle } from '$lib/components/base/theme-toggle';
	import { config } from '$lib/app/config';
	import { Toasts, createToaster, getToaster } from '$lib/components/base/toast';
	import { getUser, login } from '$lib/remotes/guarded.remote';

	const loginPageToaster = createToaster({
		name: 'login-page-toaster',
		position: 'bottom-center'
	});

	let isLoading = false;
</script>

<!-- <span class="slc-screen-test bg-surface-900 text-surface-50 fixed top-28 left-1/2 z-50 block -translate-x-1/2 -translate-y-1/2 font-extrabold"></span> -->

<svelte:head>
	<title>{`Login - ${config.appName}`}</title>
	<meta name="description" content={`Login - ${config.appName}`} />
</svelte:head>

<Toasts toasterName="login-page-toaster" />

<!-- <button
	class="bg-info-400 text-info-50 rounded"
	onclick={() => {
		loginPageToaster.add({
			type: 'info',
			title: 'Bilgi',
			description:
				'Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit.',
			action: {
				label: 'Detay',
				onClick: () => {
					console.log('onClick');
				}
			}
		});
	}}
>
	Toast
</button> -->

<main class="flex min-h-dvh flex-row">
	<a href="/" class="contents">
		<div class="absolute top-0 left-0 z-10 m-4 inline-flex h-10 w-10 items-center md:m-10">
			<img class="h-full w-full select-none" src="/images/logo/logo_512.png" alt="SLC Web logo" />
		</div>
	</a>
	<span class="absolute top-0 right-0 z-10 m-4 inline-flex h-10 w-10 items-center md:m-10">
		<div>
			<ThemeToggle />
		</div>
	</span>
	<div
		class="sm:bg-surface-300/20
		hidden
		sm:flex
		sm:grow
		sm:flex-col
		sm:items-center
		sm:justify-center
		sm:gap-10
		sm:bg-position-[center_center]"
	>
		<h3
			class="m-0
			max-w-md
			text-center
			text-base
			font-bold
			sm:text-lg
			md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl"
		>
			Merhaba, Hoşgeldiniz
		</h3>
		<img
			class="inline-block
			max-w-full
			align-bottom
			sm:max-w-sm
			md:max-w-md
			lg:max-w-lg
			xl:max-w-xl
			2xl:max-w-2xl"
			alt="auth"
			src="{import.meta.env.BASE_URL}images/ui/illustrations/illustration_dashboard.png"
		/>
		<div class="flex flex-row gap-4">
			<div class="flex flex-col items-center justify-center gap-1">
				<p class="text-surface-500">{`${config.appName} | ${config.version}`}</p>
				<img class="object-fit inset-0 h-6 w-6 brightness-85 grayscale" src="/images/logo/logo_512.png" alt="SLC Web logo" />
			</div>
		</div>
	</div>

	<div
		class="md:bg-surface-100/20
		mx-auto
		flex
		w-full
		max-w-md
		grow
		flex-col
		items-center
		justify-center
		bg-transparent
		dark:bg-transparent"
	>
		<form
			{...login.enhance(async ({ submit }) => {
				try {
					if (await submit().updates(getUser())) {
						console.log('Successfully logged in!');
					} else {
						console.log('Invalid data!');
					}
				} catch (error) {
					console.log('Oh no! Something went wrong');
				}
			})}
		>
			<div class="flex flex-col gap-5">
				<label class="grid gap-1">
					<span class="select-none">E-Posta</span>
					<input
						{...login.fields.email.as('text', 'demo@slc.tr')}
						class="border-surface-300 bg-surface-100 h-10 w-full rounded-sm border pr-2 pl-2 text-base sm:text-sm"
					/>
				</label>

				<label class="grid gap-1">
					<span class="select-none">Şifre</span>
					<input
						{...login.fields._password.as('password', 'SLc1234567')}
						class="border-surface-300 bg-surface-100 h-10 w-full rounded-sm border pr-2 pl-2 text-base sm:text-sm"
					/>
				</label>

				<button
					class="bg-primary-400 hover:bg-primary-400/80 focus:ring-primary-500/50 text-surface-token-900 flex h-10 w-full cursor-pointer items-center justify-center rounded-sm text-base font-bold shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none *:disabled:opacity-50"
				>
					Giriş
				</button>
			</div>
		</form>
	</div>
</main>
