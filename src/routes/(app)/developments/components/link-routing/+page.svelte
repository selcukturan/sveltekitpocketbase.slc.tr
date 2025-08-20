<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let href = $derived.by(() => {
		return new URLSearchParams(page.url.hash.replace('#', ''));
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
			<p>href: {href.get('sort') || 'null'}</p>

			<p>page.url.pathname: {page.url.pathname}</p>
			<p>page.url.hash: {page.url.hash}</p>
			<p>page.url.host: {page.url.host}</p>
			<p>page.url.search: {page.url.search}</p>
			<p>
				page.url.searchParams: {page.url.searchParams.get('sort') || 'null'}
			</p>
			<p>page.url.origin: {page.url.origin}</p>
			<p>page.url.href: {page.url.href}</p>
			<div class="inline-flex flex-col">
				<p>1</p>
				<a href={page.url.pathname} class="bg-error-300 cursor-pointer">
					Link [root]
				</a>
				<a
					href="{page.url.pathname}?sort=price-1&order=ascending-1"
					class="bg-success-300 cursor-pointer"
				>
					Link [a]
				</a>

				<button
					onclick={() => goto('?sort=price-2&order=ascending-2')}
					class="bg-info-300 cursor-pointer"
				>
					Button [goto]
				</button>

				<form method="GET">
					<input hidden name="sort" value="price-3" />
					<input hidden name="order" value="ascending-3" />
					<button type="submit" class="bg-warning-300 cursor-pointer"
						>Button [form]</button
					>
				</form>
				<p>2</p>
				<a
					href="{page.url.pathname}#sort=price-4&order=ascending-4"
					class="bg-error-300 cursor-pointer"
				>
					Link [hash4]
				</a>
				<a
					href="{page.url.pathname}#sort=price-5&order=ascending-5"
					class="bg-error-300 cursor-pointer"
				>
					Link [hash5]
				</a>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>link-routing Page Footer</p>
	</Page.Footer>
</Page>
