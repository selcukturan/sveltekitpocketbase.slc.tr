<script lang="ts">
	import { resolve } from '$app/paths';
	import Notification from './Notification.svelte';

	let show = $state(true);
</script>

<div class="fixed top-24 right-4 z-50">
	<button
		onclick={() => (show = !show)}
		class="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white text-xs font-bold rounded-lg shadow-lg border border-indigo-500"
	>
		{show ? 'Bileşeni Kaldır (Disconnect)' : 'Bileşeni Yükle (Connect)'}
	</button>

	<a href={resolve('/app/grapes/crud/simple')}>Grapes CRUD</a>
</div>

{#if show}
	<Notification />
{:else}
	<div class="flex items-center justify-center min-h-[50vh] text-zinc-500 font-medium">Bileşen kaldırıldı. Bağlantının kesildiğini kontrol edin.</div>
{/if}
