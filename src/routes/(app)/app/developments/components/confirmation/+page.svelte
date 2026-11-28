<script lang="ts">
	import { confirm } from '#lib/components/ui/confirm/index.js';
	import { Page } from '#lib/components/templates/index.js';

	let answer = $state('init');
</script>

<!-- Sayfa içeriği -->
<Page>
	<Page.Header><Page.Header.Title /></Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<main class="p-8">
				<div class="flex flex-col gap-4">
					<button
						onclick={async () => {
							answer = 'waiting';
							const isConfirmed = await confirm({ animationDuration: 150 });
							if (isConfirmed) {
								answer = 'true';
							} else {
								answer = 'false';
							}
						}}
						class="bg-surface-300 hover:bg-surface-200 bg-info-500 rounded px-4 py-2"
					>
						Confirmation (html dialog)
					</button>

					<p>{answer}</p>
				</div>
			</main>
		</Page.Main.Panel>
	</Page.Main>
</Page>
