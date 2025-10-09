<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, VisibleColumn } from './types';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		columns: VisibleColumn<TData>[];
		col: VisibleColumn<TData>;
		colVisibleIndex: number;
	};
	const { children, class: classes, columns, col, colVisibleIndex, ...attributes }: Props = $props();
</script>

<div
	data-slc-table-headercell
	role="columnheader"
	style:position="sticky"
	style:top={0}
	style:background="var(--color-surface-200)"
	style:grid-row-start={1}
	style:grid-column={`${colVisibleIndex + 1} / ${colVisibleIndex + 2}`}
	class={classes}
	{...attributes}
>
	{@render children?.()}
</div>
