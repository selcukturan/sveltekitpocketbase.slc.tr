<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import type { Row, FooterRowType, FooterCellType } from './types';
	import { getContext } from './context.svelte';
</script>

<script lang="ts" generics="TData extends Row">
	type Props = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		class?: string;
		fr: FooterRowType<TData>;
		fc: FooterCellType<TData>;
	};
	const { children, class: classes, fr, fc, ...attributes }: Props = $props();

	const context = getContext<TData>();

	const gridRowStart = $derived(fr.dataLength + fr.headerCount + fr.footerIndex + 1);
	const gridColumn = $derived(`${fc.colVisibleIndex + 1} / ${fc.colVisibleIndex + 2}`);
	const bottom = $derived(`${(fr.footerLength - fr.footerIndex - 1) * fr.footerHeight}px`);
</script>

<div
	data-slc-table-footercell
	role="columnheader"
	style:position="sticky"
	style:bottom
	style:background="var(--color-surface-200)"
	style:grid-row-start={gridRowStart}
	style:grid-column={gridColumn}
	class={classes}
	{...attributes}
>
	{@render children?.()}
</div>
