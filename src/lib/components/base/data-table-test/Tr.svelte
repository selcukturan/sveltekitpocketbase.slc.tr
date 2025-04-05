<script lang="ts">
	import { getTable } from './tables.svelte';

	import type { Snippet } from 'svelte';
	const { children }: { children: Snippet } = $props();

	const table = getTable();
</script>

<div class="bg-cyan-500 p-3">
	TR {`src: ${table.src}, tbl: ${table.tbl}`}
	<button
		onclick={() => {
			table.src = 'src-12';
			table.tbl = 'tbl-12';
		}}>Button</button
	>
	{@render children()}
</div>
