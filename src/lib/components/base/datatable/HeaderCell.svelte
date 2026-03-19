<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, HeaderRowType, HeaderCellType } from './types';
	import { getTableContext } from './context.svelte';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		hr: HeaderRowType<TData>;
		hc: HeaderCellType<TData>;
	};
	const { children, class: classes, hr, hc, ...attributes }: Props = $props();

	const context = getTableContext<TData>();

	const gridRowStart = 1;
	const gridColumn = $derived(`${hc.colVisibleIndex + 1} / ${hc.colVisibleIndex + 2}`);
</script>

<div
	class:slc-table-headercell={true}
	role="columnheader"
	style:position="sticky"
	style:top={0}
	style:background="var(--color-surface-200)"
	style:grid-row-start={gridRowStart}
	style:grid-column={gridColumn}
	class={classes}
	{...attributes}
>
	{@render children?.()}
</div>
