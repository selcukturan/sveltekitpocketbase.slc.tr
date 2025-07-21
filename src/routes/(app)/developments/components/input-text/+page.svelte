<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { Select } from '$lib/components/base/select';
</script>

<Head>
	<title>SLC Select - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Page Header Text</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<Select />
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Page Footer Text</p>
	</Page.Footer>
</Page>
