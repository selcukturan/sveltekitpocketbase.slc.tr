<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	const deleteHash = (currentHash: string, keys: string[]) => {
		const currentSearchParams = new URLSearchParams(currentHash.replace('#', ''));
		keys.forEach((key) => currentSearchParams.delete(key));

		if (currentSearchParams.size === 0) {
			return '';
		}
		return `#${currentSearchParams.toString()}`;
	};

	const addHash = (currentHash: string, values: Record<string, string>) => {
		const currentSearchParams = new URLSearchParams(currentHash.replace('#', ''));
		Object.entries(values).forEach(([key, value]) => {
			currentSearchParams.set(key, value);
		});

		return `#${currentSearchParams.toString()}`;
	};

	let hashSearchParamsDerived = $derived(new URLSearchParams(page.url.hash.replace('#', '')));

	$effect(() => {
		console.log('hashSearchParamsDerived', hashSearchParamsDerived.get('sort'));
		console.log('convert string', hashSearchParamsDerived.toString());

		// HASH DEĞİŞİNCE YAPILACAK İŞLEMLER BURADA
		// CODE

		return () => {
			// destroy
		};
	});
</script>

<Head>
	<title>link-routing - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>link-routing</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<p>
				hashSearchParamsDerived - sort: {hashSearchParamsDerived.get('sort') || 'null'}
			</p>
			<div class="inline-flex flex-col">
				<a
					data-sveltekit-replacestate
					data-sveltekit-noscroll
					data-sveltekit-preload-data="false"
					href="{page.url.pathname}{addHash(page.url.hash, {
						sort: 'price-4',
						order: 'ascending-4'
					})}"
					class="bg-error-300 cursor-pointer"
				>
					Link [hash4]
				</a>
				<a
					data-sveltekit-replacestate
					data-sveltekit-noscroll
					data-sveltekit-preload-data="false"
					href="{page.url.pathname}{addHash(page.url.hash, {
						sort: 'price-5',
						order: 'ascending-5'
					})}"
					class="bg-error-300 cursor-pointer"
				>
					Link [hash5]
				</a>

				<a
					data-sveltekit-replacestate
					data-sveltekit-noscroll
					data-sveltekit-preload-data="false"
					href="{page.url.pathname}{addHash(page.url.hash, {
						modal: 'open'
					})}"
					class="bg-error-300 cursor-pointer"
				>
					Open Modal
				</a>
				{#if hashSearchParamsDerived.get('modal') === 'open'}
					<a
						data-sveltekit-noscroll
						data-sveltekit-preload-data="false"
						href="{page.url.pathname}{deleteHash(page.url.hash, ['modal'])}"
						class="bg-error-300 cursor-pointer"
					>
						Close Modal
					</a>
					<button
						onclick={() => {
							goto(page.url.pathname + deleteHash(page.url.hash, ['modal']), {
								noScroll: true
							});
						}}
					>
						Close Modal 2
					</button>
				{/if}
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>link-routing Page Footer</p>
	</Page.Footer>
</Page>
