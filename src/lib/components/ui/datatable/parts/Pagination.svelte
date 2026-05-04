<script lang="ts">
	import Toggler from './Toggler.svelte';

	type Props = {
		totalItems: number;
		perPage: number;
		totalPages: number;
		page: number;
		onChange?: ({ page, perPage }: { page: number; perPage: number }) => void;
	};
	let { totalItems, perPage, totalPages, page, onChange }: Props = $props();

	// let totalPages = $derived(Math.ceil(totalItems / pageSize));

	// Delta'yı dinamik yapıyoruz:
	// İstediğiniz kademeli delta mantığı:
	let delta = $derived.by(() => {
		// Baştaki sayfalar için
		if (page === 1) return 3;
		if (page === 2) return 2;
		if (page === 3) return 1;

		// Sondaki sayfalar için
		if (page === totalPages) return 3;
		if (page === totalPages - 1) return 2;
		if (page === totalPages - 2) return 1;

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
			if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
				range.push(i);
			}
			// Ellipsis (...) ekleme mantığı
			else if ((i === page - delta - 1 && i > 1) || (i === page + delta + 1 && i < totalPages)) {
				range.push('...');
			}
		}

		// Üst üste binen "..." işaretlerini temizle
		return range.filter((item, index) => {
			return item !== '...' || range[index - 1] !== '...';
		});
	});

	function goToPage(currentPage: number | string) {
		if (typeof currentPage === 'number') {
			page = currentPage;
			onChange?.({ page: currentPage, perPage });
		}
	}

	function changePerPage(currentPerPage: number | string) {
		if (typeof currentPerPage === 'number') {
			perPage = currentPerPage;
			onChange?.({ page, perPage: currentPerPage });
		}
	}
</script>

<Toggler placement="top-start" contentClasses="border border-red-500 bg-warning-100 shadow-lg z-50">
	{#snippet trigger({ toggle })}
		<button onclick={toggle}>{perPage}</button>
	{/snippet}
	{#snippet children({ close })}
		<div class="menu">
			<button
				onclick={() => {
					changePerPage(30);
					close();
				}}>30</button
			>
			<button
				onclick={() => {
					changePerPage(50);
					close();
				}}>50</button
			>
			<button
				onclick={() => {
					changePerPage(100);
					close();
				}}>100</button
			>
			<button
				onclick={() => {
					changePerPage(200);
					close();
				}}>200</button
			>
			<button
				onclick={() => {
					changePerPage(500);
					close();
				}}>500</button
			>
			<button
				onclick={() => {
					changePerPage(1000);
					close();
				}}>1000</button
			>
		</div>
	{/snippet}
</Toggler>

<nav class="pagination">
	<button onclick={() => goToPage(page - 1)} disabled={page === 1}> Geri </button>

	{#each visiblePages as currentPage, index (index)}
		{#if currentPage === '...'}
			<span class="ellipsis">...</span>
		{:else}
			<button onclick={() => goToPage(currentPage)} class:active={currentPage === page}>
				{currentPage}
			</button>
		{/if}
	{/each}

	<button onclick={() => goToPage(page + 1)} disabled={page === totalPages}> İleri </button>
</nav>

<style>
	/* Pagination */
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

	/* Toggler */

	.menu {
		display: flex;
		flex-direction: column;
		min-width: 120px;
	}
	.menu button {
		padding: 10px;
		border: none;
		background: none;
		text-align: left;
		cursor: pointer;
	}
	.menu button:hover {
		background: var(--color-surface-400);
	}
</style>
