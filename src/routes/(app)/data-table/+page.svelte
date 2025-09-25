<script lang="ts">
	import PageContent from './PageContent.svelte';
	import { Page, Head } from '$lib/components/templates';
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
			<PageContent />
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
