<script lang="ts">
	let { totalItems, pageSize, currentPage = $bindable(1) } = $props();

	let totalPages = $derived(Math.ceil(totalItems / pageSize));

	// Delta'yı dinamik yapıyoruz:
	// İstediğiniz kademeli delta mantığı:
	let delta = $derived.by(() => {
		// Baştaki sayfalar için
		if (currentPage === 1) return 3;
		if (currentPage === 2) return 2;
		if (currentPage === 3) return 1;

		// Sondaki sayfalar için
		if (currentPage === totalPages) return 3;
		if (currentPage === totalPages - 1) return 2;
		if (currentPage === totalPages - 2) return 1;

		// Orta sayfalar için standart komşu sayısı
		return 1;
	});

	let visiblePages = $derived.by(() => {
		const range: (number | string)[] = [];

		for (let i = 1; i <= totalPages; i++) {
			// Sayfa şu durumlarda gösterilecek:
			// 1. İlk sayfa
			// 2. Son sayfa
			// 3. Mevcut sayfanın delta kadar uzağındaki komşuları
			if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
				range.push(i);
			}
			// Ellipsis (...) ekleme mantığı
			else if ((i === currentPage - delta - 1 && i > 1) || (i === currentPage + delta + 1 && i < totalPages)) {
				range.push('...');
			}
		}

		// Üst üste binen "..." işaretlerini temizle
		return range.filter((item, index) => {
			return item !== '...' || range[index - 1] !== '...';
		});
	});

	function goToPage(page: number | string) {
		if (typeof page === 'number') currentPage = page;
	}
</script>

<nav class="pagination">
	<button onclick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}> Geri </button>

	{#each visiblePages as page}
		{#if page === '...'}
			<span class="ellipsis">...</span>
		{:else}
			<button onclick={() => goToPage(page)} class:active={currentPage === page}>
				{page}
			</button>
		{/if}
	{/each}

	<button onclick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}> İleri </button>
</nav>

<style>
	.pagination {
		display: flex;
		gap: 6px;
		align-items: center;
	}
	button {
		min-width: 40px;
		height: 40px;
		cursor: pointer;
		border: 1px solid #ddd;
		background: white;
		border-radius: 4px;
	}
	button.active {
		background: #007bff;
		color: white;
		border-color: #007bff;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.ellipsis {
		padding: 0 5px;
		color: #888;
	}
</style>
