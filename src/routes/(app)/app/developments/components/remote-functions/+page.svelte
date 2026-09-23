<script lang="ts">
	import { Page, Head } from '#lib/components/templates/index.js';

	let logs = $state<string[]>([]);

	function logIt(text: string) {
		logs.push(text);
	}

	const tableClasses: string = 'border-2 border-error-400 p-4';
	const rowClasses: string = 'hover:bg-warning-400 border-2 border-warning-400 p-4';
	const cellClasses: string = 'hover:bg-info-400 border-2 border-info-400 p-4';
	const buttonClasses: string = 'border-2 border-success-400 p-4';
	const logClasses: string = 'border-2 border-warning-400 p-4 mt-4';

	const tableClick = (e: MouseEvent) => {
		// logIt('tableClick');
		console.log(e);
	};

	const rowClick = (e: MouseEvent) => {
		logIt('rowClick');
		console.log(e);
	};

	const cellClick = (e: MouseEvent) => {
		logIt('cellClick');
		// e.stopPropagation();
		console.log(e);
	};

	const buttonClick = (e: MouseEvent) => {
		logIt('buttonClick');
		// e.stopPropagation();
		console.log(e);
	};
</script>

<Head>
	<title>Data Table - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<button class={buttonClasses} onclick={() => (logs = [])}>Clear Log</button>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table class="flex items-center justify-center">
			<!-- table, tr, td ve td içindeki buton dahil tüm elementlerin onclick olayının
			 nasıl yayıldığını test eden 5 satırlık bir tablo. -->
			<table class={tableClasses}>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<tbody onclick={tableClick}>
					<tr class={rowClasses} onclick={rowClick}>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
					</tr>
					<tr class={rowClasses} onclick={rowClick}>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
					</tr>
					<tr class={rowClasses} onclick={rowClick}>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
					</tr>
					<tr class={rowClasses} onclick={rowClick}>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
					</tr>
					<tr class={rowClasses} onclick={rowClick}>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
						<td class={cellClasses} onclick={cellClick}>
							<button class={buttonClasses} onclick={buttonClick}>test-1</button>
						</td>
					</tr>
				</tbody>
			</table>

			<div class={logClasses}>
				{#each logs as log, i (i)}
					{log}<br />
				{/each}
			</div>
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<p>Footer</p>
	</Page.Footer>
</Page>
