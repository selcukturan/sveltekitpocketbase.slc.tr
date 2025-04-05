<script lang="ts" generics="TData">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLTableAttributes & {
		data?: TData[];
		toolbar?: Snippet;
		thead?: Snippet;
		tbody?: Snippet<[TData, number]>;
		tfoot?: Snippet;
		statusbar?: Snippet;
		class?: string;
		tableContainerClass?: string;
		containerClass?: string;
	};
	const {
		data,
		toolbar,
		thead,
		tbody,
		tfoot,
		statusbar,
		class: tableClass = '',
		tableContainerClass = '',
		containerClass = '',
		...attributes
	}: Props = $props();

	const table = getTable<TData>();
</script>

<div>table.svelte</div>
