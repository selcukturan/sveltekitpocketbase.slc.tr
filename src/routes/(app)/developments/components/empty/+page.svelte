<script lang="ts">
	import PageContent from './PageContent.svelte';
	import { Page, Head } from '$lib/components/templates';
</script>

<Head>
	<title>Remote [command] - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Remote [command]</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel boundary>
			<PageContent />
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Remote [command] Page Footer</p>
	</Page.Footer>
</Page>
