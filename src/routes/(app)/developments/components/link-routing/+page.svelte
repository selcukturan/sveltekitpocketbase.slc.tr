<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { Pagination } from '$lib/components/base/pagination';

	// Örnek veri seti
	const allItems = Array.from({ length: 50 }, (_, i) => `Ürün #${i + 1}`);

	let pageSize = 5;
	let currentPage = $state(1); // Mevcut sayfayı $state ile takip ediyoruz

	// Mevcut sayfada gösterilecek öğeleri $derived ile hesaplıyoruz
	let paginatedItems = $derived(allItems.slice((currentPage - 1) * pageSize, currentPage * pageSize));
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
			<main>
				<h1>Ürün Listesi</h1>

				<ul>
					{#each paginatedItems as item}
						<li>{item}</li>
					{/each}
				</ul>

				<hr />

				<!-- Pagination bileşenini çağırıyoruz -->
				<!-- bind:currentPage ile iki yönlü bağlama yapıyoruz -->
				<Pagination totalItems={allItems.length} {pageSize} bind:currentPage />

				<p>Şu anki sayfa: {currentPage}</p>
			</main>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Page Footer Text</p>
	</Page.Footer>
</Page>
