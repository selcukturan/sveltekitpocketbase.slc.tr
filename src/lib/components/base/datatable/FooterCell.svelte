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
		col: VisibleColumn<TData>;
		colVisibleIndex: number;
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
		col,
		colVisibleIndex,
		dataLength,
		footerHeight,
		footerLength,
		headersCount,
		...attributes
	}: Props = $props();

	const rowStart = dataLength + headersCount + footerIndex + 1;

	const bottom = `${(footerLength - footerIndex - 1) * footerHeight}px`;
</script>

<div
	data-slc-table-footercell
	role="columnheader"
	style:position="sticky"
	style:bottom
	style:background="var(--color-surface-200)"
	style:grid-row-start={rowStart}
	style:grid-column={`${colVisibleIndex + 1} / ${colVisibleIndex + 2}`}
	class={classes}
	{...attributes}
>
	{@render children?.()}
</div>
