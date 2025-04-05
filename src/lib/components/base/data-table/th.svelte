<script lang="ts">
	import type { TableColumnType } from './types';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { type Snippet } from 'svelte';
	import { combineClasses } from './utils';
	import { getTable } from './tables.svelte';

	const table = getTable();

	type OnColResizeEventType = {
		event: string;
		detail: {
			ci: number;
			column: TableColumnType;
		};
	};

	type Props = HTMLThAttributes & {
		children: Snippet;
		ci?: number;
		col?: TableColumnType;
		onColResize?: (params: OnColResizeEventType) => void;
		class?: string;
	};

	const { children, ci = undefined, col = undefined, class: classes, onColResize, ...attributes }: Props = $props();
	const min = 50;

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
		const width = pointerDownWidth + (event.clientX - pointerDownClientX);
		if (table.columns && width >= min && ci !== undefined) {
			table.setColumnWidth(ci, min, width);
			// table.columns[ci].width = `${Math.max(min, width)}px`;
			// Sabit bir genislige sahip olmayan diger kolonlar, hesaplanan genisliklerine sabitlenirler.
			if (table.element) {
				table.element.querySelectorAll('thead th').forEach((column) => {
					const headerDataSet = (column as HTMLTableCellElement).dataset;
					const columnIndex = Number(headerDataSet.col);
					if (columnIndex && table.columns && table.columns[columnIndex].width?.startsWith('minmax')) {
						const width = column.getBoundingClientRect().width;
						table.setColumnWidth(columnIndex, min, width);
					}
				});
			}

			// `Th` component'ine ait `onColResize` event'i tetiklenir.
			// Bu event'i dinleyen `Th` component'leri, kolon genisliginin degistigini anlayabilirler.
			// <Th onColResize={({ event, detail }) => { console.log(event, detail.column); }}> any value </Th>
			if (onColResize) thisOnColResize({ event: 'colresize', detail: { ci, column: $state.snapshot(table.columns[ci]) } });
		}
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

<th
	data-type={table.columns?.[ci as number]?.type}
	data-col={ci}
	style:grid-row-start="var(--slc-grid-row-start)"
	class:group={true}
	class={combineClasses('slc-table-th', { 'slc-table-th-columnSelect': table.settings.columnSelect || false, 'slc-table-th-columnAction': table.settings.columnAction || false }, classes)}
	{...attributes}
>
	<div class="flex h-full w-full justify-between">
		<div class="hidden items-center">x-</div>
		<div
			style:justify-content={col?.alignHeader ? (col?.alignHeader === 'center' ? 'center' : col?.alignHeader === 'right' ? 'flex-end' : 'flex-start') : col?.align === 'center' ? 'center' : col?.align === 'right' ? 'flex-end' : 'flex-start'}
			class="flex min-w-0 flex-1 items-center"
		>
			<p class="overflow-hidden text-ellipsis whitespace-nowrap">
				{@render children()}
			</p>
		</div>
		<div class="hidden items-center">x</div>
	</div>
	{#if table.columns?.[ci as number]?.resizeable}
		<div use:colResizePointerAction={(e) => colResizeUpdate(e)} class="absolute bottom-0 right-0 top-0 mb-0.5 mr-0.5 mt-0.5 w-1 cursor-ew-resize !touch-none rounded-full bg-surface-500 opacity-0 duration-150 group-hover:opacity-40"></div>
	{/if}
</th>

<style lang="postcss">
	.slc-table-th {
		@apply sticky;
		@apply bg-surface-100;
		@apply hover:bg-surface-200;
		@apply top-0;
		@apply z-[4];
		@apply overflow-hidden;
		@apply duration-100;
		@apply px-2;
		@apply outline-none;
		@apply slc-select-none;
		@apply border-b;
		@apply border-r;
		/* columnSelectClass */
		/* columnActionClass */
		@apply [&:nth-last-child(1)]:border-l;
		@apply [&:nth-last-child(2)]:border-r-0;
	}
	.slc-table-th-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[5];
	}
	.slc-table-th-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[5];
	}
</style>
