<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, HeaderRowType, HeaderCellType } from './types';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		hr: HeaderRowType<TData>;
		hc: HeaderCellType<TData>;
	};
	const { children, class: classes, hr, hc, ...attributes }: Props = $props();
</script>

<div
	class:slc-table-headercell={true}
	role="columnheader"
	style:position="sticky"
	style:top={0}
	style:background="var(--color-surface-200)"
	style:grid-row-start={1}
	style:grid-column={`${hc.colVisibleIndex + 1} / ${hc.colVisibleIndex + 2}`}
	class={classes}
	{...attributes}
>
	{@render children?.()}
</div>
