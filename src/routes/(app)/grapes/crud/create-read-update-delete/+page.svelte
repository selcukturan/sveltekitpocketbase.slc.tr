<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import DataTable from '$lib/components/base/DataTable.svelte';
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
			<DataTable />
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
