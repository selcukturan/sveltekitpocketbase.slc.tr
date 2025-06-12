<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import MyFirstForm from './MyFirstForm.svelte';

	let { data } = $props();
</script>

<Head>
	<title>Form - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Form Page Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<MyFirstForm data={data.myFirstForm} />
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>Footer</Page.Footer>
</Page>
