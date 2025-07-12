<script lang="ts">
	import { Drawer } from '$lib/components/base/drawer';
	import { Page } from '$lib/components/templates';

	let drawer: Drawer;
	let drawer2: Drawer;
</script>

<!-- Sayfa içeriği -->
<main class="p-8">
	<h1 class="mb-4 text-2xl font-bold">Svelte 5 Drawer</h1>

	<div class="flex gap-4">
		<button
			onclick={() => {
				drawer.open();
			}}
			class="rounded bg-blue-500 px-4 py-2 text-white"
		>
			Paneli Aç
		</button>
	</div>
</main>

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
				class="rounded bg-blue-500 px-4 py-2 text-white"
			>
				Paneli Aç
			</button>
		</Page.Main>
		<Page.Footer class="border-t p-4">
			<div class="flex justify-end">
				<button onclick={() => drawer.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> Kapat </button>
			</div>
		</Page.Footer>
	</Page>
</Drawer>

<Drawer bind:this={drawer2} onOpen={() => console.log('Drawer 2 opened')} onClose={() => console.log('Drawer 2 closed')}>
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
				<button onclick={() => drawer2.close()} class="rounded bg-gray-500 px-4 py-2 text-white"> Kapat 2 </button>
			</div>
		</Page.Footer>
	</Page>
</Drawer>
