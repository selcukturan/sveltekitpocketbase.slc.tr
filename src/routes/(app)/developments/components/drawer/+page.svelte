<script lang="ts">
	import { Drawer } from '$lib/components/base/drawer';
	import { DrawerHtmlDialog } from '$lib/components/base/drawer';
	import { confirm } from '$lib/components/base/confirm';
	import { Page, Head } from '$lib/components/templates';

	let drawer: Drawer;
	let drawer2: Drawer;
	let drawerHtmlDialog1: DrawerHtmlDialog;
	let drawerHtmlDialog2: DrawerHtmlDialog;
</script>

<Head>
	<title>Drawer - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<DrawerHtmlDialog bind:this={drawerHtmlDialog1}>
	<Page>
		<Page.Header class="flex items-center justify-between border-b p-4">
			<div class="flex w-full items-center justify-between">
				<h2 class="text-lg font-semibold">Panel</h2>
				<button onclick={() => drawerHtmlDialog1.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> X </button>
			</div>
		</Page.Header>
		<Page.Main class="flex-1 overflow-y-auto p-4">
			<p>Bu, sağdan kayarak açılan bir panel!</p>
			<input type="text" class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 1" />
			<button class="mt-4 rounded bg-blue-500 p-2 text-white">Buton</button>
			<textarea class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 2"></textarea>
			<button
				onclick={() => {
					drawerHtmlDialog2.open();
				}}
				class="bg-surface-300 hover:bg-surface-200 rounded bg-blue-500 px-4 py-2"
			>
				Open Panel
			</button>
		</Page.Main>
		<Page.Footer class="border-t p-4">
			<div class="flex justify-end">
				<button onclick={() => drawerHtmlDialog1.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> Close 1 </button>
			</div>
		</Page.Footer>
	</Page>
</DrawerHtmlDialog>

<DrawerHtmlDialog
	bind:this={drawerHtmlDialog2}
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
				<button onclick={() => drawerHtmlDialog2.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> X </button>
			</div>
		</Page.Header>
		<Page.Main class="flex-1 overflow-y-auto p-4">
			<p>Bu, sağdan kayarak açılan bir panel!</p>
			<input type="text" class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 1" />
			<button class="mt-4 rounded bg-blue-500 p-2 text-white">Buton</button>
			<textarea class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 2"></textarea>
		</Page.Main>
		<Page.Footer class="border-t p-4">
			<div class="flex justify-end">
				<button onclick={() => drawerHtmlDialog2.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> Close 22 </button>
			</div>
		</Page.Footer>
	</Page>
</DrawerHtmlDialog>

<!-- Sayfa içeriği -->
<Page>
	<Page.Header>
		<p>Drawer Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<main class="p-8">
				<div class="m-1 flex gap-4">
					<button
						onclick={() => {
							drawer.open();
						}}
						class="bg-surface-300 hover:bg-surface-200 rounded bg-blue-500 px-4 py-2"
					>
						Open Panel (html div)
					</button>
				</div>
				<div class="flex gap-4">
					<button
						onclick={() => {
							drawerHtmlDialog1.open();
						}}
						class="bg-surface-300 hover:bg-surface-200 rounded bg-blue-500 px-4 py-2"
					>
						Open Panel (html dialog)
					</button>
				</div>
			</main>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Drawer Footer</p>
	</Page.Footer>
</Page>

<Drawer bind:this={drawer} onOpen={() => console.log('Drawer opened')} onClose={() => console.log('Drawer closed')}>
	<Page>
		<Page.Header class="flex items-center justify-between border-b p-4">
			<div class="flex w-full items-center justify-between">
				<h2 class="text-lg font-semibold">Panel</h2>
				<button onclick={() => drawer.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> X </button>
			</div>
		</Page.Header>
		<Page.Main class="flex-1 overflow-y-auto p-4">
			<p>Bu, sağdan kayarak açılan bir panel!</p>
			<input type="text" class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 1" />
			<button class="mt-4 rounded bg-blue-500 p-2 text-white">Buton</button>
			<textarea class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 2"></textarea>
			<button
				onclick={() => {
					drawer2.open();
				}}
				class="bg-surface-300 hover:bg-surface-200 rounded bg-blue-500 px-4 py-2"
			>
				Open Panel
			</button>
		</Page.Main>
		<Page.Footer class="border-t p-4">
			<div class="flex justify-end">
				<button onclick={() => drawer.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> Close 1 </button>
			</div>
		</Page.Footer>
	</Page>
</Drawer>

<Drawer
	bind:this={drawer2}
	onOpen={() => console.log('Drawer 2 opened')}
	onClose={() => console.log('Drawer 2 closed')}
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
				<button onclick={() => drawer2.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> X </button>
			</div>
		</Page.Header>
		<Page.Main class="flex-1 overflow-y-auto p-4">
			<p>Bu, sağdan kayarak açılan bir panel!</p>
			<input type="text" class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 1" />
			<button class="mt-4 rounded bg-blue-500 p-2 text-white">Buton</button>
			<textarea class="mt-4 w-full rounded border bg-transparent p-2" placeholder="Odaklanılabilir alan 2"></textarea>
		</Page.Main>
		<Page.Footer class="border-t p-4">
			<div class="flex justify-end">
				<button onclick={() => drawer2.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> Close 2 </button>
			</div>
		</Page.Footer>
	</Page>
</Drawer>
