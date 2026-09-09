<script lang="ts">
	import { resolve } from '$app/paths';
	import Notification from './Notification.svelte';

	let show = $state(true);
</script>

<div class="fixed top-24 right-4 z-50">
	<button
		onclick={() => (show = !show)}
		class="cursor-pointer rounded-lg border border-indigo-500 bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-indigo-500 active:scale-95"
	>
		{show ? 'Bileşeni Kaldır (Disconnect)' : 'Bileşeni Yükle (Connect)'}
	</button>

	<a href={resolve('app/grapes/crud/simple')}>Grapes CRUD</a>
</div>

{#if show}
	<Notification />
{:else}
	<div class="flex min-h-[50vh] items-center justify-center font-medium text-zinc-500">Bileşen kaldırıldı. Bağlantının kesildiğini kontrol edin.</div>
{/if}
