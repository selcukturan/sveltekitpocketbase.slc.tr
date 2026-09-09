<script lang="ts">
	import { Page, Head } from '#lib/components/templates/index.js';
	import { AllIcons } from '#lib/components/icons/index.js';
</script>

<Head>
	<title>Components - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Components Page Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<AllIcons />
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Components Page Footer</p>
	</Page.Footer>
</Page>
