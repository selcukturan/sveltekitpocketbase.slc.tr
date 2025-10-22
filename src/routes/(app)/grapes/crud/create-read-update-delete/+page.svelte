<script lang="ts">
	/* import PageDataTable from './PageDataTable.svelte'; */
	import * as s from '$lib/components/base/datatable';
	import { getFullList } from './page.remote';
	import { Page, Head } from '$lib/components/templates';
	import { Boundary } from '$lib/components/base/boundary';

	let filter = $state('');
	let items = $derived((await getFullList(filter)).items);
	let dataTable: s.DataTable<ItemsType> | undefined = $state(undefined);

	type ItemsType = (typeof items)[number];

	let columns = $state<s.Column<ItemsType>[]>([
		{ field: 'id', label: 'id', width: 'minmax(50px,1fr)' },
		{ field: 'title', label: 'title', width: 'minmax(50px,1fr)' },
		{ field: 'caption', label: 'caption', width: 'minmax(50px,1fr)' },
		{ field: 'price', label: 'price', width: 'minmax(50px,1fr)' },
		{ field: 'kn', label: 'kn', width: 'minmax(50px,1fr)' }
	]);
	let footers = $state<s.Footer<ItemsType>[]>([{ caption: 'x1' }, { price: 'x2' }]);

	/* $effect(() => {
		goto(`?${params.toURLSearchParams().toString()}`, { keepFocus: true });
		getFullList(filter).refresh();
	}); */
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Header</p>
		<input
			type="text"
			placeholder="Filter..."
			value={filter}
			onkeydown={/* async */ (e) => {
				if (e.key === 'Enter') {
					/* items = (await getFullList(params.filter)).items; */
					filter = (e.target as HTMLInputElement).value;
					/* getFullList(filter).refresh(); */
				}
			}}
		/>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<!-- <Boundary><PageDrawer /></Boundary> add ve edit için -->
			<Boundary>
				<!-- <PageDataTable filter={params.filter} {onselect} /> -->

				<div class="s" style:display="contents">
					<s.DataTable bind:this={dataTable} {items} {columns} {footers}>
						{#snippet toolbar()}
							<button onclick={() => dataTable?.test()}>Test 4</button>
						{/snippet}
						{#snippet headerRow(hr)}
							<s.HeaderRow {hr}>
								{#snippet headerCell(hc)}
									<s.HeaderCell {hr} {hc}>
										{hc.label}
									</s.HeaderCell>
								{/snippet}
							</s.HeaderRow>
						{/snippet}

						{#snippet dataRow(dr)}
							<s.DataRow {dr}>
								{#snippet dataCell(dc)}
									<s.DataCell {dr} {dc}>
										{dc.value}
									</s.DataCell>
								{/snippet}
							</s.DataRow>
						{/snippet}

						{#snippet footerRow(fr)}
							<s.FooterRow {fr}>
								{#snippet footerCell(fc)}
									<s.FooterCell {fr} {fc}>
										{fc.value}
									</s.FooterCell>
								{/snippet}
							</s.FooterRow>
						{/snippet}
					</s.DataTable>
				</div>
			</Boundary>
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
