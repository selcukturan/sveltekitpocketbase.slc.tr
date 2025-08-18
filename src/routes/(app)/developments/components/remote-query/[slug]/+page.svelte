<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { getLog } from '$lib/remotes/testQuery.remote';

	let { params } = $props();

	// Şu anda, await'i yalnızca <svelte:boundary> içinde pending bir snippet ile kullanılabilir.
	/* const details = $derived(await getLog(params.slug)); */
	/* let details = $state(await getLog(params.slug)); */
</script>

<Head>
	<title>Remote [query] - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Remote [query]</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<svelte:boundary>
				<h1>TITLE: {(await getLog(params.slug)).title}</h1>
				<div>CONTENT: {@html (await getLog(params.slug)).content}</div>

				{#snippet pending()}
					<p>loading...</p>
				{/snippet}
				{#snippet failed(error, reset)}
					<button onclick={reset} class="bg-error-400"> failed! reset.</button>
				{/snippet}
			</svelte:boundary>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Remote [query] Page Footer</p>
	</Page.Footer>
</Page>
