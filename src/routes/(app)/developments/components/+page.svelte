<script lang="ts">
	import { Head, Page } from '$lib/components/templates';
	import { setContext } from 'svelte';
	import Child from './Child.svelte';

	let counter = $state({
		count: 0
	});

	setContext('counter', counter);
</script>

<Head>
	<title>Components Root - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>Components Header</Page.Header>
	<Page.Main>
		<button onclick={() => (counter.count += 1)}> increment </button>

		<Child />
		<Child />
		<Child />

		<button onclick={() => (counter.count = 0)}> reset </button>
	</Page.Main>
	<Page.Footer>Components Footer</Page.Footer>
</Page>
