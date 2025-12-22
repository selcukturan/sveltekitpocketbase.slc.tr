<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { ThemeToggle } from '$lib/components/base/theme-toggle';
	import { config } from '$lib/app/config';
	import { Toasts, createToaster, getToaster } from '$lib/components/base/toast';
	import { getUser } from '$lib/remotes/guarded.remote';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const loginPageToaster = createToaster({
		name: 'login-page-toaster',
		position: 'bottom-center'
	});

	let isLoading = $state(false);

	let error = $state('');

	async function login(e: Event) {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const email = form.email.value;
		const password = form.password.value;

		console.log('object');

		if (!email || !password) {
			error = 'All fields are required';
			return;
		}

		const response = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		const result = await response.json();
		console.log(result);

		if (result.type === 'success') {
			getUser().refresh();
			goto(resolve('/'));
		} else {
			// Hata durumunu opsiyonel olarak göster
			error = result.message;
		}
	}
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
			onsubmit={login}
			class="flex w-full flex-col
				px-2
				pb-4
				sm:px-4
				md:px-6
				lg:px-8
				xl:px-10
				2xl:px-12"
		>
			<div class="flex flex-col gap-5">
				<label class="grid gap-1">
					<span class="select-none">E-Posta</span>
					<input
						id="email"
						name="email"
						required
						placeholder="E-Posta"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						disabled={isLoading}
						value="demo@slc.tr"
						class="border-surface-300 bg-surface-100 h-10 w-full rounded-sm border pr-2 pl-2 text-base sm:text-sm"
					/>
				</label>

				<label class="grid gap-1">
					<span class="select-none">Şifre</span>
					<input
						id="password"
						name="password"
						required
						placeholder="Şifre"
						type="password"
						autocapitalize="none"
						autocorrect="off"
						disabled={isLoading}
						value="SLc1234567"
						class="border-surface-300 bg-surface-100 h-10 w-full rounded-sm border pr-2 pl-2 text-base sm:text-sm"
					/>
				</label>

				<button
					type="submit"
					disabled={isLoading}
					class="bg-primary-400 hover:bg-primary-400/80 focus:ring-primary-500/50 text-surface-token-900 flex h-10 w-full cursor-pointer items-center justify-center rounded-sm text-base font-bold shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none *:disabled:opacity-50"
				>
					{#if isLoading}
						<!-- Dönen spinner ikonu -->
						<svg class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					{:else}
						Giriş Yap
					{/if}
				</button>
			</div>
		</form>
	</div>
</main>
