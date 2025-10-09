<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, VisibleColumn, Footer } from './types';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		footerRow: Footer<TData>;
		columns: VisibleColumn<TData>[];
		footerIndex: number;
		dataLength: number;
		footerHeight: number;
		footerLength: number;
		headersCount: number;
	};

	const {
		children,
		class: classes,
		footerRow,
		columns,
		footerIndex,
		dataLength,
		footerHeight,
		footerLength,
		headersCount,
		...attributes
	}: Props = $props();
</script>

<div data-slc-table-footerrow role="row" style:display="contents" class={classes} {...attributes}>
	{@render children?.()}
</div>
