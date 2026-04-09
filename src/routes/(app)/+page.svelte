<script lang="ts">
	import { t } from '$lib/app/localization.svelte';
	import { Page, Head } from '$lib/components/templates';
	import { getUser } from '$lib/remotes/guarded.remote';

	import { goto } from '$app/navigation';

	let user = getUser();

	function onclick() {
		goto('/grapes/crud/create-read-update-delete#cmd=create&id=ogakwsw3aeym0u9');
	}
</script>

<Head>
	<title>Dashboard - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<button onclick={() => user.refresh()}> Check getUser() {user.current?.email}</button>

		<p>{t('hello_world')}</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<div class="flex h-full w-full flex-col gap-1 overflow-hidden">
				<a
					href="https://github.com/selcukturan/sveltekitpocketbase.slc.tr"
					class="bg-primary-200 text-primary-800 hover:bg-primary-300 active:bg-primary-400 rounded-md p-3 text-center"
					target="_blank"
					rel="noopener noreferrer"
				>
					Go to project github page
				</a>

				<h1>1 - FancyInput'ların içinde orjinal input değerlerini değiştirirken `field?.set('new value');` kullan.</h1>
				<!-- <pre>{JSON.stringify(user, null, 2)}</pre> -->
				<button
					{onclick}
					class=" bg-primary-200 text-primary-800 hover:bg-primary-300 active:bg-primary-400 rounded-md p-3 text-center"
				>
					BUTTON: Go DataTable with filter and recordId in hash
				</button>
				<a
					href="/grapes/crud/create-read-update-delete#cmd=create&id=ogakwsw3aeym0u9"
					class=" bg-primary-200 text-primary-800 hover:bg-primary-300 active:bg-primary-400 rounded-md p-3 text-center"
					target="_blank"
					rel="noopener noreferrer"
				>
					LINK: Go DataTable with filter and recordId in hash
				</a>

				<a
					href="/login"
					class="bg-primary-200 text-primary-800 hover:bg-primary-300 active:bg-primary-400 rounded-md p-3 text-center"
					rel="noopener noreferrer"
				>
					Go to Login Page
				</a>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<!-- <Page.Footer>Footer</Page.Footer> -->
</Page>
