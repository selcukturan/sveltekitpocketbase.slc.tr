<script lang="ts">
	import { getTable } from './tables.svelte';

	import type { Snippet } from 'svelte';
	const { children }: { children: Snippet } = $props();

	const table = getTable();
</script>

<div class="bg-amber-500 p-3">
	TD {`src: ${table.src}, tbl: ${table.tbl}`}
	<button
		onclick={() => {
			table.src = 'src-13';
			table.tbl = 'tbl-13';
		}}>Button</button
	>
	{@render children()}
</div>
