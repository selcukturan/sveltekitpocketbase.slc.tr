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
	};
	const { children, class: classes, columns, ...attributes }: Props = $props();
</script>

<div data-slc-table-headerrow role="row" style:display="contents" class={classes} {...attributes}>
	{@render children?.()}
</div>
