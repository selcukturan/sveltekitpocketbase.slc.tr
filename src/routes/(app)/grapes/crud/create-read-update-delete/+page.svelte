<script lang="ts">
	/* import PageDataTable from './PageDataTable.svelte'; */
	import * as s from '$lib/components/base/datatable';
	import { getFullList } from './page.remote';
	import { Page, Head } from '$lib/components/templates';
	import { Boundary } from '$lib/components/base/boundary';
	import { page } from '$app/state';
	import { Navigator } from '$lib/app/navigator.svelte';
	import { type PageQuerySchemaType, pageQuerySchema } from './types';
	import { watch } from 'runed';

	const navigator = new Navigator(page.url.hash, pageQuerySchema);

	let promise = $derived(getFullList(navigator.getFilter));
	let results = $derived(await promise);

	let items = $derived(results.items);
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

	watch(
		() => navigator.params.recordId,
		(recordId) => {
			if (!recordId) return;

			console.log('Selected Record ID:', recordId);
		}
	);
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<input
			type="text"
			bind:value={navigator.params.filter.title}
			placeholder="Search - Title contains..."
			class="border"
			onkeydown={(e) => e.key === 'Enter' && navigator.setFilter()}
		/>
		<button
			onclick={() => navigator.setFilter()}
			disabled={$effect.pending() > 0}
			class="bg-warning-300 p-3 disabled:opacity-50">Search</button
		>
		<span> | </span>
		<button
			onclick={() => getFullList(navigator.getFilter).refresh()}
			disabled={$effect.pending() > 0}
			class="bg-warning-300 p-3 disabled:opacity-50"
		>
			Refresh
		</button>
		<button
			onclick={() => navigator.setParams({ recordId: `${Math.floor(Math.random() * 100 + 1)}` })}
			disabled={$effect.pending() > 0}
			class="bg-warning-300 p-3 disabled:opacity-50">Set RecordID</button
		>
		<button
			onclick={() => navigator.setParams({ recordId: undefined })}
			disabled={$effect.pending() > 0}
			class="bg-warning-300 p-3 disabled:opacity-50">Remove RecordID</button
		>
		<p>
			pending promises:
			{#if $effect.pending()}
				{$effect.pending()}
			{:else}
				0
			{/if}
		</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<!-- <Boundary><PageDrawer /></Boundary> add ve edit için -->
			<Boundary>
				<!-- <PageDataTable filter={params.filter} {onselect} /> -->

				<div class="s" style:display="contents">
					<s.DataTable bind:this={dataTable} {items} {columns} {footers}>
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
