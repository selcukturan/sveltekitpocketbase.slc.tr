<script lang="ts">
	import PageDataTable from './PageDataTable.svelte';
	import { Page, Head } from '$lib/components/templates';
	// import { watch } from 'runed';
	import { Boundary } from '$lib/components/base/boundary';

	let filter = $state('Uğur');

	const onselect = (id: string) => {
		console.log('maybe open drawer', id);
	};
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Header</p>
		<button onclick={() => 'pageDataTable.test()'}>Test</button>
		<input
			type="text"
			placeholder="Filter..."
			bind:value={filter}
			onchange={() => console.log('Filter changed:', filter)}
		/>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<!-- <Boundary><PageDrawer /></Boundary> add ve edit için -->
			<Boundary>
				<PageDataTable {filter} {onselect} />
			</Boundary>
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
