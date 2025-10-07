<script lang="ts">
	// Tabulator KeyBinding tipini genişletin
	import { onMount } from 'svelte';
	import { TabulatorFull } from 'tabulator-tables';

	let { data = [] } = $props();

	let tableDiv: HTMLDivElement;
	let table: TabulatorFull;
	let initialized = false;

	onMount(() => {
		table = new TabulatorFull(tableDiv, {
			data: data,
			height: '100%',
			rowHeight: 35,

			//enable range selection
			selectableRange: true,
			selectableRangeColumns: true,
			selectableRangeRows: true,
			// selectableRangeClearCells: false,

			//change edit trigger mode to make cell navigation smoother
			editTriggerEvent: 'dblclick',

			//configure clipboard to allow copy and paste of range format data
			clipboard: true,
			clipboardCopyStyled: false,
			clipboardCopyConfig: {
				rowHeaders: false,
				columnHeaders: false
			},
			clipboardCopyRowRange: 'range',
			clipboardPasteParser: 'range',
			clipboardPasteAction: 'range',

			rowHeader: {
				resizable: false,
				frozen: true,
				width: 50,
				hozAlign: 'center',
				formatter: 'rownum'
			},

			//setup cells to work as a spreadsheet
			columnDefaults: {
				headerSort: false,
				headerHozAlign: 'center',
				vertAlign: 'middle', // text-ellipsis'i bozuyor
				// editor: 'input',
				resizable: 'header',
				width: 100
			},
			autoColumns: true,
			autoColumnsDefinitions: [
				{ field: 'producer', editor: 'input' },
				{ field: 'price', editor: 'input' },
				{ field: 'quantity', editor: 'input' },
				{ field: 'amount', editor: 'input' }
			]
		});

		table.on('rowSelected', function (row) {
			console.log(row.getData());
		});

		table.on('tableBuilt', function () {
			initialized = true;
		});

		const handleKeyDown = (e: KeyboardEvent) => {
			const input1 = table?.element?.querySelector(
				'.tabulator-cell.tabulator-editing input'
			);
			if (input1) return;

			const typableNumber = '1234567890';
			const typableLower = 'abcdefghijklmnopqrstuvwxyz';
			const typableUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			const typableOther = "=-`[\\]';,./ğüşıöçĞÜŞİÖÇ";
			const { key } = e;

			if (
				!e.ctrlKey &&
				!e.metaKey &&
				(typableNumber.includes(key) ||
					typableLower.includes(key) ||
					typableUpper.includes(key) ||
					typableOther.includes(key))
			) {
				e.preventDefault();
				const range = table.getRanges()[0];
				const topLeft = table.getRows()[range.getTopEdge()].getCells()[
					range.getLeftEdge()
				];
				topLeft.edit();
				const input2 = table?.element?.querySelector(
					'.tabulator-cell.tabulator-editing input'
				) as HTMLInputElement;

				input2.classList.add('form-input');
				input2.name = topLeft.getField();
				console.log(input2);
				if (input2) input2.value = key;
			}
		};
		table.element.addEventListener('keydown', handleKeyDown);

		return () => {
			table.element.removeEventListener('keydown', handleKeyDown);
		};
	});

	$effect(() => {
		if (!initialized) return;
		table
			.updateData(data)
			.then(function () {
				//run code after data has been updated
			})
			.catch(function (error) {
				//handle error updating data
			});
	});

	// https://tabulator.info/docs/6.2/components#component-cell
	// You and programmatically cause a cell to open its editor element using the
	// https://tabulator.info/docs/6.2/components#component-range
	// https://tabulator.info/docs/6.2/modules#module-keybindings
	// https://tabulator.info/docs/6.2/keybindings#custom
</script>

<div class="slc-tabulator" bind:this={tableDiv}></div>
