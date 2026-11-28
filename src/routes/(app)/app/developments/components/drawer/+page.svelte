<script lang="ts">
	import { Drawer } from '#lib/components/ui/drawer/index.js';
	import { confirm } from '#lib/components/ui/confirm/index.js';
	import { Page } from '#lib/components/templates/index.js';

	let drawer1: Drawer;
	let drawer2: Drawer;
</script>

<!-- Sayfa içeriği -->
<Page>
	<Page.Header><Page.Header.Title /></Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<main class="p-8">
				<div class="flex gap-4">
					<button
						onclick={() => {
							drawer1.open();
						}}
						class="bg-surface-300 hover:bg-surface-200 bg-info-500 rounded px-4 py-2"
					>
						Open Panel (html dialog)
					</button>
				</div>
			</main>
		</Page.Main.Panel>
	</Page.Main>
</Page>

<Drawer bind:this={drawer1}>
	<Page>
		<Page.Header class="flex items-center justify-between border-b p-4">
			<div class="flex w-full items-center justify-between">
				<h2 class="text-lg font-semibold">Panel</h2>
				<button onclick={() => drawer1.close()} class="bg-surface-500 text-surface-token-50 rounded px-4 py-2"> X </button>
			</div>
		</Page.Header>
		<Page.Main class="flex-1 overflow-y-auto p-4">
			<p>Bu, sağdan kayarak açılan bir panel!</p>
			<input type="text" class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 1" />
			<button class="bg-info-500 text-surface-token-50 mt-4 rounded p-2">Buton</button>
			<textarea class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 2"></textarea>
			<button
				onclick={() => {
					drawer2.open();
				}}
				class="bg-surface-300 hover:bg-surface-200 bg-info-500 rounded px-4 py-2"
			>
				Open Panel
			</button>

			<button
				onclick={() => {
					drawer1.toast({
						type: 'info',
						title: 'Silmek istediğinize emin misiniz?',
						description: crypto.randomUUID(),
						closable: true,
						action: {
							label: 'İptal',
							onClick: () => {
								console.log('onClick');
							}
						}
					});
				}}
				class="bg-surface-300 hover:bg-surface-200 bg-info-500 rounded px-4 py-2"
			>
				Toast Message
			</button>
		</Page.Main>
		<Page.Footer class="border-t p-4">
			<div class="flex justify-end">
				<button onclick={() => drawer1.close()} class="bg-surface-500 text-surface-token-50 rounded px-4 py-2"> Close 1 </button>
			</div>
		</Page.Footer>
	</Page>
</Drawer>

<Drawer
	bind:this={drawer2}
	onBeforeClose={async () => {
		// any custom logic before closing
		return await confirm({
			message: 'Bu paneli kapatmak istediğinize emin misiniz?',
			yes: 'Evet',
			no: 'Hayır'
		});
	}}
>
	<Page>
		<Page.Header class="flex items-center justify-between border-b p-4">
			<div class="flex w-full items-center justify-between">
				<h2 class="text-lg font-semibold">Panel</h2>
				<button onclick={() => drawer2.close()} class="bg-surface-500 text-surface-token-50 rounded px-4 py-2"> X </button>
			</div>
		</Page.Header>
		<Page.Main class="flex-1 overflow-y-auto p-4">
			<p>Bu, sağdan kayarak açılan bir panel!</p>
			<input type="text" class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 1" />
			<button class="bg-info-500 text-surface-token-50 mt-4 rounded p-2">Buton</button>
			<textarea class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 2"></textarea>
		</Page.Main>
		<Page.Footer class="border-t p-4">
			<div class="flex justify-end">
				<button onclick={() => drawer2.close()} class="bg-surface-500 text-surface-token-50 rounded px-4 py-2"> Close 22 </button>
			</div>
		</Page.Footer>
	</Page>
</Drawer>
