<script lang="ts">
	import { Toggler } from '#lib/components/base/toggler/index.js';

	let toggl = $state<ReturnType<typeof Toggler> | null>(null);
</script>

<Toggler
	bind:this={toggl}
	animation
	style="margin-inline: var(--gutter, 5px);"
	placement="bottom-center"
	--border="1px solid var(--color-surface-300)"
	--border-radius="10px"
	--background-color="var(--color-surface-50)"
	--box-shadow="0px 0px 16px -1px var(--color-surface-100)"
	--min-height="200px"
	--max-height="min(540px, 75dvh)"
	--min-width="400px"
	--max-width="450px"
	--display="flex"
	--overflow="hidden"
>
	{#snippet trigger({ active, toggle, attr })}
		<button {...attr} class="bg-error-300 cursor-pointer" class:bg-error-400={active}> Bildirimler (13) </button>
	{/snippet}

	{#snippet children({ close })}
		<div class="flex min-h-0 flex-auto flex-col">
			<header class="flex shrink-0 items-center justify-between p-2">
				<h3 class="text-lg font-semibold">Bildirimler</h3>
				<button class="btn-sm" onclick={close}>Kapat</button>
			</header>

			<div class="min-h-0 flex-auto overflow-y-auto">
				<ul class="my-select-menu">
					<li><button onclick={close}>İstanbul</button></li>
					<li><button onclick={close}>Ankara</button></li>
					<li><button onclick={close}>İzmir</button></li>
					<li><button onclick={close}>Bursa</button></li>
					<li><button onclick={close}>Antalya</button></li>
					<li><button onclick={close}>İstanbul</button></li>
					<li><button onclick={close}>Ankara</button></li>
					<li><button onclick={close}>İzmir</button></li>
					<li><button onclick={close}>Bursa</button></li>
					<li><button onclick={close}>Antalya</button></li>
					<li><button onclick={close}>İstanbul</button></li>
					<li><button onclick={close}>Ankara</button></li>
					<li><button onclick={close}>İzmir</button></li>
					<li><button onclick={close}>Bursa</button></li>
					<li><button onclick={close}>Antalya</button></li>
					<li><button onclick={close}>İstanbul</button></li>
					<li><button onclick={close}>Ankara</button></li>
					<li><button onclick={close}>İzmir</button></li>
					<li><button onclick={close}>Bursa</button></li>
					<li><button onclick={close}>Antalya</button></li>
					<li><button onclick={close}>İstanbul</button></li>
					<li><button onclick={close}>Ankara</button></li>
					<li><button onclick={close}>İzmir</button></li>
					<li><button onclick={close}>Bursa</button></li>
					<li><button onclick={close}>Antalya</button></li>
				</ul>
			</div>

			<footer class="flex shrink-0 items-center justify-between p-2">
				<button class="btn-sm" onclick={close}>Tümünü Oku</button>
				<button class="btn-sm" onclick={close}>Ayarlar</button>
			</footer>
		</div>
	{/snippet}
</Toggler>
