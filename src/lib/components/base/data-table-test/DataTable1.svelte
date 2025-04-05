<script lang="ts">
	import { setTable } from './tables.svelte';

	import Table from './Table.svelte';
	import Tr from './Tr.svelte';
	import Td from './Td.svelte';

	let { src, tbl }: { src: string; tbl: string } = $props();

	const table = setTable();

	$effect(() => {
		table.src = src;
		table.tbl = tbl;
	});

	console.log(table);
</script>

<Table>
	<Tr>
		<Td>1</Td>
	</Tr>
</Table>
