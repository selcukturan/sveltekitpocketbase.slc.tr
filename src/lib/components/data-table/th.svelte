<script lang="ts" generics="TData extends Row">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Column, Row, Sources } from './types';
	import { type Snippet } from 'svelte';
	import { getTable } from './tables.svelte';

	type OnColResizeEventType = {
		event: string;
		detail: {
			ci: number;
			column: Column<TData>;
		};
	};

	type Props = HTMLAttributes<HTMLDivElement> & {
		src: Sources<TData>;
		children: Snippet;
		ci: number;
		col: Column<TData>;
		onColResize?: (params: OnColResizeEventType) => void;
		class?: string;
	};

	const { src, children, ci, col, class: classes, onColResize, ...attributes }: Props = $props();

	const minWidth = 50;

	const table = getTable<TData>(src.id);

	const gridColumn = $derived.by(() => {
		if (table.get.rowSelection !== 'none') {
			return col.field === '_selection' ? '1 / 2' : `${ci + 2} / ${ci + 3}`;
		} else {
			return `${ci + 1} / ${ci + 2}`;
		}
	});
	let selection = $derived(col.field === '_selection');
	let left = $derived(selection ? '0px' : undefined);

	let action = $derived(col.field === '_action');
	let right = $derived(action ? '0px' : undefined);

	// ############################################################################################
	let dragging = $state(false);
	let pointerDownClientX: number;
	let pointerDownWidth: number;
	const colResizePointerAction = (node: HTMLElement, callback: (event: PointerEvent) => void) => {
		const pointerdown = (event: PointerEvent) => {
			if ((event.pointerType === 'mouse' && event.button === 2) || (event.pointerType !== 'mouse' && !event.isPrimary)) return;

			pointerDownClientX = event.clientX;
			pointerDownWidth = (node.parentNode as HTMLElement).getBoundingClientRect().width;

			node.setPointerCapture(event.pointerId);
			event.preventDefault();
			dragging = true;

			const onpointerup = () => {
				dragging = false;
				node.setPointerCapture(event.pointerId);
				window.removeEventListener('pointermove', callback, false);
				window.removeEventListener('pointerup', onpointerup, false);
			};

			window.addEventListener('pointermove', callback, false);
			window.addEventListener('pointerup', onpointerup, false);
		};

		node.addEventListener('pointerdown', pointerdown, { capture: true, passive: false });

		return {
			destroy() {
				node.removeEventListener('pointerdown', pointerdown);
			}
		};
	};

	const colResizeUpdate = (event: PointerEvent) => {
		if (col.oi == null) return;

		const width = pointerDownWidth + (event.clientX - pointerDownClientX);
		table.setColumnWidth(col.oi, minWidth, width);

		table.get.columns.forEach((column, index) => {
			if (index !== col.oi && column?.width?.startsWith('minmax')) {
				const width = table.element?.querySelector(`div[role="columnheader"][data-oi="${index}"]`)?.getBoundingClientRect().width || 100;
				table.setColumnWidth(index, minWidth, width - 1); // margin-right=-1px
			}
		});

		// `Th` component'ine ait `onColResize` event'i tetiklenir.
		// Bu event'i dinleyen `Th` component'leri, kolon genisliginin degistigini anlayabilirler.
		// <Th onColResize={({ event, detail }) => { console.log(event, detail.column); }}> any value </Th>
		if (onColResize) thisOnColResize({ event: 'colresize', detail: { ci, column: col } });
	};

	// `Th` component'ine ait `onColResize` event'inin, tetiklenmesinden onceki islemler ve
	// tetiklenmesinden sonraki islemler bu fonksiyonda yapilabilir.
	const thisOnColResize = (params: OnColResizeEventType): void => {
		const { event, detail } = params;
		// console.log('`onColResize` event'inin tetiklenmesinden onceki kodlar');
		if (onColResize) onColResize({ event, detail });
		// console.log('`onColResize` event'inin tetiklenmesinden sonraki kodlar');
	};
</script>

<div
	role="columnheader"
	style:grid-row={`${table.headerRowsCount} / ${table.headerRowsCount + 1}`}
	style:grid-column={gridColumn}
	data-scope="th"
	data-freezed={selection ? 'selection' : action ? 'action' : undefined}
	data-freezed-action-before-cell={table.get.rowAction && ci === table.visibleColumns.length - 1 ? '' : undefined}
	style:left
	style:right
	style:margin-right={!selection && !action ? '-1px' : undefined}
	class={classes}
	class:group={true}
	aria-colindex={ci + 1}
	data-col={ci}
	data-oi={col.oi}
	{...attributes}
>
	<div style="display: flex; height: 100%; width: 100%; justify-content: space-between;">
		<div style="display: none; align-items: center;">x</div>
		<div
			style="display: flex; min-width: 0px; flex: 1 1 0%; align-items: center;"
			style:justify-content={col.alignHeader
				? col.alignHeader === 'center'
					? 'center'
					: col.alignHeader === 'right'
						? 'flex-end'
						: 'flex-start'
				: col.align === 'center'
					? 'center'
					: col.align === 'right'
						? 'flex-end'
						: 'flex-start'}
		>
			<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
				{@render children?.()}
			</span>
		</div>
		<div style="display: none; align-items: center;">x</div>
	</div>
	{#if !selection && !action && col.resizeable}
		<div
			data-scope="th-resize"
			use:colResizePointerAction={(e) => colResizeUpdate(e)}
			class={`absolute top-0 right-0 bottom-0 mt-1.5 mr-0.5 mb-1.5 w-1 cursor-ew-resize !touch-none rounded-full opacity-0 duration-150 group-hover:opacity-60 hover:opacity-80`}
		></div>
	{/if}
</div>

<style>
	[data-scope='th'] {
		border-width: 0px;
		position: sticky;
		top: 0px;
		z-index: 2;
		padding: 0px;
		padding-left: 0.5rem; /* 8px */
		padding-right: 0.5rem; /* 8px */
		outline: none;
		user-select: none;
	}

	[data-scope='th'][data-freezed='selection'],
	[data-scope='th'][data-freezed='action'] {
		z-index: 3;
	}
</style>
