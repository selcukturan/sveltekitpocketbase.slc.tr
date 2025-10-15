<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { generateProducedData2 } from '$lib/demo/produced-grapes-generate-data.js';
	const { data } = $props();

	console.log(crypto.randomUUID());
	console.log(generateProducedData2(5));
</script>

<Head>
	<title>Dashboard - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<!-- <Page.Header>
		<p>Form Page Header</p>
	</Page.Header> -->
	<Page.Main>
		<Page.Main.Panel>
			<div class="flex h-full w-full flex-col overflow-hidden">
				<a
					href="https://github.com/selcukturan/sveltekitpocketbase.slc.tr"
					class=" bg-primary-200 text-primary-800 hover:bg-primary-300 active:bg-primary-400 rounded-md p-3 text-center"
					target="_blank"
					rel="noopener noreferrer"
				>
					Go to project github page
				</a>
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<!-- <Page.Footer>Footer</Page.Footer> -->
</Page>
