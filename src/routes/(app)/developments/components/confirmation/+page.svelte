<script lang="ts">
	import { confirm } from '$lib/components/base/confirm';
	import { Page, Head } from '$lib/components/templates';

	let answer = $state('');
</script>

<Head>
	<title>Confirmation - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<!-- Sayfa içeriği -->
<Page>
	<Page.Header>
		<p>Confirmation Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<main class="p-8">
				<div class="flex gap-4">
					<button
						onclick={async () => {
							answer = '';
							const isConfirmed = await confirm();
							if (isConfirmed) {
								answer = 'onayladı';
							} else {
								answer = 'iptal edildi';
							}
						}}
						class="bg-surface-300 hover:bg-surface-200 rounded bg-blue-500 px-4 py-2"
					>
						Confirmation
					</button>
					<p>{answer}</p>
				</div>
			</main>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Confirmation Footer</p>
	</Page.Footer>
</Page>
