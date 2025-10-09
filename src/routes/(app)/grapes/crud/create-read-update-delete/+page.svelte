<script lang="ts">
	import PageDataTable from './PageDataTable.svelte';
	import { Page, Head } from '$lib/components/templates';
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table boundary>
			<PageDataTable />
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
