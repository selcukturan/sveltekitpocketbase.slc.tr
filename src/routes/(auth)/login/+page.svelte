<svelte:options runes={true} />

<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let props: PageProps = $props();

	let isLoading = false;
</script>

<!-- <span class="slc-screen-test fixed left-1/2 top-28 z-50 block -translate-x-1/2 -translate-y-1/2 bg-surface-900 font-extrabold text-surface-50"></span> -->

<main class="flex min-h-[100dvh] flex-row">
	<a href="/" class="contents">
		<div class="absolute top-0 left-0 z-10 m-4 inline-flex h-10 w-10 items-center md:m-10">
			<img class="h-full w-full select-none" src="{import.meta.env.BASE_URL}images/logo/logo_512.png" alt="SLC Web logo" />
		</div>
	</a>
	<span class="absolute top-0 right-0 z-10 m-4 inline-flex h-10 w-10 items-center md:m-10">
		<div>
			<!-- <ThemeToggle /> -->
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
			<!-- <a href="/">Site</a>
			<a href="/app">Uygulama</a> -->
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
		<form method="POST" use:enhance>
			<div class="grid gap-2">
				<div class="grid gap-1">
					<label>
						E-Posta
						<input
							id="email"
							name="email"
							placeholder="E-Posta"
							type="email"
							autocapitalize="none"
							autocomplete="email"
							autocorrect="off"
							disabled={isLoading}
							value="user1@slcweb.app"
							class="h-input rounded-10px border-border-input bg-background text-foreground w-[219px] border pr-2 pl-2 text-base sm:text-sm"
						/>
					</label>
				</div>
				<div class="grid gap-1">
					<label>
						Şifre
						<input
							id="password"
							name="password"
							placeholder="Şifre"
							type="password"
							autocapitalize="none"
							autocorrect="off"
							disabled={isLoading}
							value="SLc2176317"
							class="h-input rounded-10px border-border-input bg-background text-foreground w-[219px] border pr-2 pl-2 text-base sm:text-sm"
						/>
					</label>
				</div>
				<button type="submit" disabled={isLoading}>
					{#if isLoading}
						<span class="animate-spin">♠</span>
					{/if}
					Giriş Yap
				</button>
			</div>
		</form>
	</div>
</main>
