<script lang="ts">
	import { Page, Head } from '#lib/components/templates/index.js';
	import type { PageProps } from './$types';
	const props: PageProps = $props();
</script>

<Head>
	<title>DASHBOARD - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<!-- <Page.Header>
		<p>Form Page Header</p>
	</Page.Header> -->
	<Page.Main>
		<Page.Main.Panel>
			<div class="flex h-full w-full flex-col overflow-hidden">
				<h6>LOGS PAGE PROPS</h6>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<!-- <Page.Footer>Footer</Page.Footer> -->
</Page>
