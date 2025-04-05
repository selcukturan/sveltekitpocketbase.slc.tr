<script lang="ts">
	import { getTable } from './tables.svelte';

	import type { Snippet } from 'svelte';
	const { children }: { children: Snippet } = $props();

	const table = getTable();
</script>

<div class="m-3 bg-lime-500 p-3">
	TABLE: {`src: ${table.src}, tbl: ${table.tbl}`}
	<button
		onclick={() => {
			table.src = 'src-10';
			table.tbl = 'tbl-10';
		}}>Button</button
	>
	{@render children()}
</div>
