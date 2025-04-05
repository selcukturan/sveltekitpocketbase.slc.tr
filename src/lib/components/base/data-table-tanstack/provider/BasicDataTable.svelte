<script lang="ts" generics="TData">
	import { type ColumnDef, FlexRender } from '../tanstack';
	import type { SettingsType } from '../types';
	import { setTable } from '../tables.svelte';

	const { data, columns, settings }: { data: TData[]; columns: ColumnDef<TData>[]; settings?: SettingsType } = $props();

	const table = setTable<TData>(data, columns, settings);

	$effect(() => {
		if (data) table.setData = data;
		if (columns) table.setColumns = columns;
		if (settings) table.setSettings = settings;
	});
</script>

<div class="slc-table-main">
	<div class="slc-table-container">
		<table
			bind:this={table.element}
			class="slc-table"
			style:grid-template-rows={table.getGridTemplateRows()}
			style:grid-template-columns={table.getGridTemplateColumns()}
		>
			<thead class="contents">
				{#each table.tanstack.getHeaderGroups() as headerGroup}
					<tr class="contents" style:--slc-grid-row-start="1">
						{#each headerGroup.headers as header}
							<th colspan={header.colSpan} class="slc-table-th" style:grid-row-start="var(--slc-grid-row-start)">
								{#if !header.isPlaceholder}
									<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div class="resizer" onmousedown={header.getResizeHandler()} ontouchstart={header.getResizeHandler()}></div>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody class="contents">
				{#each table.virtualizer.getVirtualItems() as row, idx (row.index)}
					<tr
						class="contents"
						aria-rowindex={row.index}
						data-index={`${idx}`}
						data-rowindex={`${row.index}`}
						style:--slc-grid-row-start={row.index !== null && row.index !== undefined ? +row.index + 2 : undefined}
					>
						{#each table.rows[row.index].getVisibleCells() as cell, idx (cell.id)}
							<td
								class="slc-table-td"
								aria-colindex={idx}
								data-index={`${idx}`}
								data-cellid={`${cell.id}`}
								style:grid-row-start="var(--slc-grid-row-start)"
							>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
			<tfoot class="contents">
				{#each table.tanstack.getFooterGroups() as footerGroup}
					<tr class="contents" style:--slc-grid-row-start={table.rows && table.rows.length > 0 ? table.rows.length + 2 : 2}>
						{#each footerGroup.headers as footer}
							<th class="slc-table-tf" style:grid-row-start="var(--slc-grid-row-start)">
								{#if !footer.isPlaceholder}
									<FlexRender content={footer.column.columnDef.footer} context={footer.getContext()} />
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</tfoot>
		</table>
	</div>
</div>

<style lang="postcss">
	/* ################################ */
	.slc-table-main {
		@apply flex h-full w-full flex-col overflow-hidden;
	}
	.slc-table-container {
		@apply relative flex-1 overflow-hidden;
	}
	.slc-table {
		@apply grid h-full w-full overflow-auto bg-surface-50;
	}
	/* ################################ */
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
	/* .slc-table-th-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[5];
	} */
	/* .slc-table-th-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[5];
	} */
	/* ################################ */
	.slc-table-td {
		@apply relative z-[2] overflow-hidden border-b border-r bg-inherit p-0 px-2 outline-none slc-select-none focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-500 [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0;
	}
	/* .slc-table-td-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[3];
	} */
	/* .slc-table-td-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[3];
	} */
	/* ################################ */
	.slc-table-tf {
		@apply sticky bottom-0 z-[4] overflow-hidden border-b border-r border-solid border-surface-300 bg-surface-100 px-2 outline-none slc-select-none [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0;
	}
	/* .slc-table-tf-columnSelect {
		@apply [&:nth-child(1)]:sticky [&:nth-child(1)]:left-0 [&:nth-child(1)]:z-[5];
	} */
	/* .slc-table-tf-columnAction {
		@apply [&:nth-last-child(1)]:sticky [&:nth-last-child(1)]:right-0 [&:nth-last-child(1)]:z-[5];
	} */
	/* ################################ */

	.resizer {
		@apply bg-surface-900;
		right: 0;
		position: absolute;
		top: 0;
		height: 100%;
		width: 5px;
		background-color: transparent;
		cursor: col-resize;
		user-select: none;
		touch-action: none;
	}
</style>
