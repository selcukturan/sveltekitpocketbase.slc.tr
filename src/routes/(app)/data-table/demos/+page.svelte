<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { getFullList } from '$lib/remotes/tabulator.remote';
	import { page } from '$app/state';
	import Tabulator from '$lib/components/base/tabulator/Tabulator.svelte';

	let promise = $derived(getFullList(page.url.hash));

	let filter = $derived(await promise);

	let data = $derived(filter.items);
</script>

<Head>
	<title>Data Table - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table boundary>
			<Tabulator {data} />
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
