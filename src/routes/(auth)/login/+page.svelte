<script lang="ts">
	import { enhance } from '$app/forms';
	import { ThemeToggle } from '$lib/components/base/theme-toggle';
	import { config } from '$lib/client/app';

	let isLoading = false;
</script>

<!-- <span class="slc-screen-test bg-surface-900 text-surface-50 fixed top-28 left-1/2 z-50 block -translate-x-1/2 -translate-y-1/2 font-extrabold"></span> -->

<svelte:head>
	<title>{`Login - ${config.appName}`}</title>
	<meta name="description" content={`Login - ${config.appName}`} />
</svelte:head>

<main class="flex min-h-[100dvh] flex-row">
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
		sm:bg-[center_center]"
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
			method="POST"
			use:enhance
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
						placeholder="E-Posta"
						type="email"
						autocapitalize="none"
						autocomplete="email"
						autocorrect="off"
						disabled={isLoading}
						value="demo@slc.tr"
						class="h-input rounded-10px border-border-input bg-background text-foreground w-full border pr-2 pl-2 text-base sm:text-sm"
					/>
				</label>

				<label class="grid gap-1">
					<span class="select-none">Şifre</span>
					<input
						id="password"
						name="password"
						placeholder="Şifre"
						type="password"
						autocapitalize="none"
						autocorrect="off"
						disabled={isLoading}
						value="SLc1234567"
						class="h-input rounded-10px border-border-input bg-background text-foreground w-full border pr-2 pl-2 text-base sm:text-sm"
					/>
				</label>

				<button
					type="submit"
					disabled={isLoading}
					class="rounded-10px bg-primary-400 hover:bg-primary-400/80 focus:ring-primary-500/50 flex h-10 w-full cursor-pointer items-center justify-center text-base font-bold text-gray-900 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none *:disabled:opacity-50"
				>
					{#if isLoading}
						<span class="animate-spin">♠</span>
					{/if}
					Giriş Yap
				</button>
			</div>
		</form>
	</div>
</main>
