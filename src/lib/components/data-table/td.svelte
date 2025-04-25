<script lang="ts" generics="TData extends Row">
	import type { Row, Column, Sources, FocucedCell, Field } from './types';
	import type { HTMLAttributes } from 'svelte/elements';
	import { tick, type Snippet } from 'svelte';
	import { getTable } from './tables.svelte';

	type Props = HTMLAttributes<HTMLDivElement> & {
		src: Sources<TData>;
		row: TData;
		children: Snippet;
		ri: number;
		ci: number;
		col: Column<TData>;
		class?: string;
	};
	const { src, row, children, ri, ci, col, class: classes = '', ...attributes }: Props = $props();

	const table = getTable<TData>(src.id);

	const row_oi = $derived(table.get.enableVirtualization === false ? ri : ri);
	const originalCell = $derived(`${row_oi}_${ci}`);
	const indexToRow = 1;
	const gridRowStart = $derived(typeof row_oi === 'number' ? row_oi + table.headerRowsCount + indexToRow : 0);

	const onmousedown = async (e: Event) => {
		if (row_oi == null) return;
		const cellToFocus: Required<FocucedCell> = { rowIndex: row_oi, colIndex: ci, originalCell: `${row_oi}_${ci}`, tabIndex: 0 };
		if (cellToFocus.originalCell === table.getFocusedCell?.originalCell) return;
		// await table.focusCell({ cellToFocus });
	};

	const onkeydown = (e: KeyboardEvent) => {
		// async artık throttled fonksiyon içinde
		const { key } = e;
		const typableNumber = '1234567890';
		const typableLower = 'abcdefghijklmnopqrstuvwxyz';
		const typableUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const typableOther = " =-`[\\]';,./ğüşıöçĞÜŞİÖÇ";

		// --- İzin Verilmeyen Tuşları Filtrele ---
		const isNavigationKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Enter', 'Tab'].includes(key);
		const isActionKey = ['F2', ' ', 'c', 'C', 'v', 'V', 'Escape'].includes(key); // Boşluk, F2, Kopyala/Yapıştır, Escape
		const isTypable = typableNumber.includes(key) || typableLower.includes(key) || typableUpper.includes(key) || typableOther.includes(key);

		// İzin verilmeyen tuşlar veya anlık eylemler önce ele alınır
		if (!isNavigationKey && !isActionKey && !isTypable) {
			if (!((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C' || key === 'v' || key === 'V'))) {
				// console.log('Key ignored:', key);
				return; // İzin verilmeyen tuş
			}
		}

		const { rowIndex, colIndex, originalCell } = table.getFocusedCell ?? {};
		if (rowIndex == null || colIndex == null || originalCell == null) {
			return; // Odak yoksa (şimdilik) çık
		}

		// --- Anlık Eylemler (Throttle EDİLMEZ) ---
		if (
			key === 'Escape' ||
			key === 'F2' ||
			((e.ctrlKey || e.metaKey) && (key === 'c' || key === 'C')) ||
			((e.ctrlKey || e.metaKey) && (key === 'v' || key === 'V')) ||
			(!e.ctrlKey && !e.metaKey && isTypable && key !== ' ') ||
			key === ' ' /* && özel koşul, örn: colIndex === -1 */
		) {
			if (key === 'Escape' && table.editingCell) {
				e.preventDefault();
				table.removeCellInput();
				const cellToFocus: Required<FocucedCell> = { rowIndex, colIndex, originalCell, tabIndex: 0 };
				table.throttledFocusLogic(cellToFocus, '');
			} else if (isTypable || key === 'F2') {
				if (table.editingCell || row_oi == null || col.oi == null || !table.visibleColumns[ci].editable) return;
				e.preventDefault();
				table.createCellInput(key, row_oi, col.oi, col.field);
			}

			// console.log('Immediate action key:', key);
			// İlgili anlık eylemleri buraya ekleyin (kopyala, yapıştır, F2, yazma, boşlukla seçme)
			// Örnek: if (key === 'F2') { createCellInput... }
			// Bu eylemler throttle edilmeden hemen çalışmalı ve navigasyonu tetiklememeli.
			// Gerekirse e.preventDefault() burada çağrılabilir.
			return; // Anlık eylemden sonra çık
		}

		// --- Sadece Navigasyon Tuşları İçin Devam Et ---
		if (isNavigationKey) {
			// Varsayılan davranışı HEMEN engelle
			e.preventDefault();

			// --- Navigasyon Hesaplamaları (HER ÇAĞRIDA YAPILIR) ---
			let cellToFocus: Required<FocucedCell> = { rowIndex, colIndex, originalCell, tabIndex: 0 };
			const initialOriginalCell = cellToFocus.originalCell; // Hesaplama *öncesi* hücre

			const rowFirstIndex = 0;
			const rowLastIndex = table.get.data.length - 1;
			const colFirstIndex = table.get.rowSelection !== 'none' ? -1 : 0;
			const colLastIndex = table.get.rowAction ? table.visibleColumns.length : table.visibleColumns.length - 1;

			let navigationHappened = false; // Hesaplama yapıldı mı?

			if (key === 'ArrowUp') {
				cellToFocus.rowIndex = Math.max(rowFirstIndex, cellToFocus.rowIndex - 1);
				navigationHappened = true;
			} else if (key === 'ArrowDown' || key === 'Enter') {
				cellToFocus.rowIndex = Math.min(rowLastIndex, cellToFocus.rowIndex + 1);
				navigationHappened = true;
			} else if (key === 'ArrowLeft' || (e.shiftKey && key === 'Tab')) {
				cellToFocus.colIndex = cellToFocus.colIndex - 1;
				if (key === 'Tab' && cellToFocus.colIndex < colFirstIndex) {
					cellToFocus.rowIndex = Math.max(rowFirstIndex, cellToFocus.rowIndex - 1);
					cellToFocus.colIndex = colLastIndex;
				} else {
					cellToFocus.colIndex = Math.max(colFirstIndex, cellToFocus.colIndex);
				}
				navigationHappened = true;
			} else if (key === 'ArrowRight' || (!e.shiftKey && key === 'Tab')) {
				cellToFocus.colIndex = cellToFocus.colIndex + 1;
				if (key === 'Tab' && cellToFocus.colIndex > colLastIndex) {
					cellToFocus.rowIndex = Math.min(rowLastIndex, cellToFocus.rowIndex + 1);
					cellToFocus.colIndex = colFirstIndex;
				} else {
					cellToFocus.colIndex = Math.min(colLastIndex, cellToFocus.colIndex);
				}
				navigationHappened = true;
			} else if (key === 'Home') {
				cellToFocus.colIndex = colFirstIndex;
				navigationHappened = true;
			} else if (key === 'End') {
				cellToFocus.colIndex = colLastIndex;
				navigationHappened = true;
			} else if (key === 'PageUp') {
				// cellToFocus.rowIndex = Math.max(rowFirstIndex, table.getPageUpRowIndex() || rowFirstIndex);
				navigationHappened = true;
			} else if (key === 'PageDown') {
				// cellToFocus.rowIndex = Math.min(rowLastIndex, table.getPageDownRowIndex() || rowLastIndex);
				navigationHappened = true;
			}

			// --- Throttled Fonksiyonu Çağır (Eğer Navigasyon Olduysa) ---
			if (navigationHappened) {
				// hesaplanan hedef hücreyi ve başlangıç hücresini ilet
				table.throttledFocusLogic(cellToFocus, initialOriginalCell);
			}
		}
	};

	const inputOnAction = (input: HTMLInputElement) => {
		input.focus();
		// input.select();

		const blur = (e: FocusEvent) => {
			if (row_oi == null || col.oi == null) return;

			const newValue = table.editingCellValue;
			const oldValue = table.editingCellOldValue;

			table.removeCellInput();

			if (newValue === oldValue) return;

			table.setCellValue(newValue, oldValue, row_oi, col.oi, col.field);
			/*
			// onCellEdit
			if (onCellEdit && table.columns)
					thisOnCellEdit({
						event: 'celledit',
						detail: { newValue, oldValue, rowIndex: inputrow, colIndex: inputcol, field: inputfield, column: $state.snapshot(table.columns[+inputcol]), row: $state.snapshot(table.data[+inputrow]) as TDataType }
					});
			*/
		};
		const click = (e: MouseEvent) => {
			e.stopPropagation();
		};
		const mousedown = (e: MouseEvent) => {
			e.stopPropagation();
		};

		input.addEventListener('blur', blur);
		input.addEventListener('click', click);
		input.addEventListener('mousedown', mousedown);

		return {
			destroy() {
				input.removeEventListener('blur', blur);
				input.removeEventListener('click', click);
				input.removeEventListener('mousedown', mousedown);
			}
		};
	};

	const gridColumn = $derived.by(() => {
		const offset = table.get.rowSelection !== 'none' ? 1 : 0;
		if (table.get.rowSelection !== 'none' && col.field === '_selection') {
			return '1 / 2';
		} else if (table.get.rowAction === true && col.field === '_action') {
			return `${table.visibleColumns.length + 1 + offset} / ${table.visibleColumns.length + 2 + offset}`;
		} else {
			return `${ci + 1 + offset} / ${ci + 2 + offset}`;
		}
	});

	let selection = $derived(col.field === '_selection');
	let left = $derived(selection ? '0px' : undefined);

	let action = $derived(col.field === '_action');
	let right = $derived(action ? '0px' : undefined);

	const cellEvenOrOdd = $derived(typeof row_oi === 'number' ? row_oi % 2 : undefined);
</script>

<div
	role="gridcell"
	{onmousedown}
	{onkeydown}
	style:grid-row={`${gridRowStart} / ${gridRowStart + 1}`}
	style:grid-column={gridColumn}
	data-scope="td"
	data-freezed={selection ? 'selection' : action ? 'action' : undefined}
	data-freezed-action-before-cell={table.get.rowAction && ci === table.visibleColumns.length - 1 ? '' : undefined}
	style:left
	style:right
	class={`${classes} ${cellEvenOrOdd === 1 ? 'slc-cell-odd' : 'slc-cell-even'}`}
	data-cell={originalCell}
	tabindex={table.getFocusedCell?.originalCell === originalCell && typeof table.getFocusedCell?.tabIndex !== 'undefined' ? table.getFocusedCell?.tabIndex : -1}
	aria-selected={table.getFocusedCell?.originalCell === originalCell ? 'true' : 'false'}
	data-focused={table.getFocusedCell?.originalCell === originalCell ? '' : undefined}
	aria-colindex={ci + 1}
	spellcheck="false"
	translate="no"
	{...attributes}
>
	<!-- Metin içerik kapsayıcısı -->

	<div style="display: flex; height: 100%; width: 100%; justify-content: space-between;">
		<div style="display: none; align-items: center;">x</div>
		<div
			style="display: flex; min-width: 0px; flex: 1 1 0%; align-items: center;"
			style:justify-content={col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start'}
		>
			{#if col.oi != null && row_oi != null && table.editingCellPath === `r${row_oi}c${col.oi}` && col.editable}
				<span style="overflow: hidden; width:100%">
					<input
						type="text"
						spellcheck="false"
						autocomplete="off"
						data-inputrow={row_oi}
						data-inputcol={col.oi}
						data-inputfield={col.field || 'slcNullField'}
						use:inputOnAction
						bind:this={table.editingCellInput}
						bind:value={table.editingCellValue}
						style:text-align={col.align || 'left'}
						style="margin:0px; height:100%; width:100%; border:none; background-color:transparent; padding:0px; outline:none; box-shadow:none; transition:none;"
					/>
				</span>
			{:else}
				<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
					{@render children?.()}
				</span>
			{/if}
		</div>
		<div style="display: none; align-items: center;">x</div>
	</div>

	<!-- Diğer içerik kapsayıcıları -->

	<!-- <div style:display="contents">
		{@render children?.()}
	</div> -->
</div>

<style>
	[data-scope='td'] {
		position: relative;
		border-width: 0px;
		user-select: none;
		padding: 0px;
		padding-left: 0.5rem; /* 8px */
		padding-right: 0.5rem; /* 8px */
		outline: none;
		text-decoration: none;
	}

	[data-scope='td'][data-freezed='selection'],
	[data-scope='td'][data-freezed='action'] {
		z-index: 1;
		position: sticky;
		margin-bottom: -1px;
	}

	/* @media (min-aspect-ratio: 1/1) {
		[data-scope='td'][data-freezed='selection'],
		[data-scope='td'][data-freezed='action'] {
			background-color: lightblue !important;
		}
	} */

	[data-focused] {
		outline-width: 2px;
		outline-offset: -3px;
		outline-style: solid;
		outline-color: currentColor;
	}
</style>
