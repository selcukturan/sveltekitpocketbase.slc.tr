<script lang="ts">
	import PageContent from './PageContent.svelte';
	import { Page, Head } from '$lib/components/templates';
</script>

<Head>
	<title>Data Table - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page boundary>
	<!-- <Page.Header>
		<p>Header</p>
	</Page.Header> -->
	<Page.Main>
		<Page.Main.Table>
			<PageContent />
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>
			pending promises:
			{#if $effect.pending()}
				{$effect.pending()}
			{:else}
				0
			{/if}
		</p>
	</Page.Footer>
</Page>
