<script lang="ts">
	import { confirm } from '$lib/components/base/confirm';
	import { Page, Head } from '$lib/components/templates';

	let answer = $state('init');
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
				<div class="flex flex-col gap-4">
					<button
						onclick={async () => {
							answer = 'waiting';
							const isConfirmed = await confirm();
							if (isConfirmed) {
								answer = 'true';
							} else {
								answer = 'false';
							}
						}}
						class="bg-surface-300 hover:bg-surface-200 rounded bg-blue-500 px-4 py-2"
					>
						Confirmation (html dialog)
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
