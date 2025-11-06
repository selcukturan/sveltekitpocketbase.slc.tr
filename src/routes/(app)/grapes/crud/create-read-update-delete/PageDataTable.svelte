<script lang="ts" generics="TData">
	import type { AppActionFailure, AppErrorData } from '$lib/types';
	import type { ListResult } from 'pocketbase';
	import { isActionFailure } from '@sveltejs/kit';

	import type { TestDatatableResponse } from '$lib/types/pocketbase-types';

	const {
		records,
		onselect,
		filter = ''
	}: {
		records: TestDatatableResponse[] | ListResult<TestDatatableResponse> | AppActionFailure;
		onselect?: (id: string) => void;
		filter?: string;
	} = $props();

	// 1. ActionFailure olup olmadığını kontrol eden reaktif değişken
	const isFailure = $derived(isActionFailure(records));

	// 2. ListResult olup olmadığını kontrol eden reaktif değişken
	//    Hata olmadığını ve ListResult'a özgü alanların olduğunu kontrol ederiz.
	const isListResult = $derived(
		!isFailure && records && typeof records === 'object' && 'items' in records && 'totalItems' in records
	);

	// 3. Basit bir dizi (TData[]) olup olmadığını kontrol eden reaktif değişken
	const isSimpleArray = $derived(!isFailure && Array.isArray(records));
</script>

<div>
	<p>pending promises: {$effect.pending()}</p>
</div>

<pre>
	<!-- {#if isActionFailure(records)}
		<p>Bir hata oluştu: records.message</p>
	{:else}
		{JSON.stringify(records, null, 2)}
	{/if} -->

	{#if isFailure}
		<!-- DURUM 1: Veri bir AppActionFailure -->
	<div class="error-message">
		<p><strong>Bir hata oluştu:</strong></p>
		<!-- TypeScript'e bunun bir hata olduğunu bildirmek için 'as' kullanabiliriz -->
		<p>{((records as AppActionFailure).data as AppErrorData)?.message}</p>
	</div>
	{:else if isListResult}
		<!-- DURUM 2: Veri bir ListResult<TData> -->
	<!-- PocketBase'den gelen sayfalama bilgisi olan nesne -->
	<div>
		<p>Toplam {(records as ListResult<TestDatatableResponse>).totalItems} kayıt bulundu. Sayfa {(
					records as ListResult<TestDatatableResponse>
				).page}/{(records as ListResult<TestDatatableResponse>).totalPages}.</p>
		<ul>
			{#each (records as ListResult<TestDatatableResponse>).items as item}
					<li>{item.caption}</li>
				{/each}
		</ul>
	</div>
	{:else if isSimpleArray}
		<!-- DURUM 3: Veri basit bir TData[] dizisi -->
	<div>
		<p>Toplam {(records as TestDatatableResponse[]).length} kayıt listeleniyor.</p>
		<ul>
			{#each records as TestDatatableResponse[] as item}
					<li>{item.caption}</li>
				{/each}
		</ul>
	</div>
	{:else}
		<!-- Hiçbir koşul karşılanmazsa (örneğin records null veya undefined ise) -->
	<p>Veri yükleniyor veya mevcut değil...</p>
	{/if}
</pre>

<!-- <DataTableWrapper results={items} /> -->

<div class="s" style:display="contents">
	<!-- <s.DataTable bind:this={dataTable} {items} {columns} {footers}>
		{#snippet toolbar()}
			<div class="flex gap-0.5">
				<button onclick={() => onselect?.(`${new Date().getTime()}`)}>Test 2</button>
				<button onclick={() => dataTable?.test()}>Test 4</button>
				<input
					type="text"
					bind:value={params.filter.title}
					placeholder="Search - Title contains..."
					class="border"
					onkeydown={(e) => e.key === 'Enter' && console.log('xxx')}
				/>
				<button
					onclick={() => console.log('xxx')}
					disabled={$effect.pending() > 0}
					class="bg-warning-300 p-3 disabled:opacity-50">Search</button
				>
				<span> | </span>
				<button
					onclick={() => console.log('xxx')}
					disabled={$effect.pending() > 0}
					class="bg-warning-300 p-3 disabled:opacity-50"
				>
					Refresh
				</button>
				<button
					onclick={() => console.log('xxx')}
					disabled={$effect.pending() > 0}
					class="bg-warning-300 p-3 disabled:opacity-50">Set RecordID</button
				>
				<button
					onclick={() => console.log('xxx')}
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
			</div>
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
	</s.DataTable> -->
</div>

<style>
	/* .s:global(.s [data-slc-table]) {
		background-color: red;
	} */
</style>
