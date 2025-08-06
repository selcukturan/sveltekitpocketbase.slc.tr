<script lang="ts">
	import { Head, Page } from '$lib/components/templates';

	const items = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'date', label: 'Date' },
		{ value: 'elderberry', label: 'Elderberry' },
		{ value: 'fig', label: 'Fig' },
		{ value: 'grape', label: 'Grape' },
		{ value: 'honeydew', label: 'Honeydew' },
		{ value: 'kiwi', label: 'Kiwi' },
		{ value: 'lemon', label: 'Lemon' },
		{ value: 'mango', label: 'Mango' },
		{ value: 'nectarine', label: 'Nectarine' },
		{ value: 'orange', label: 'Orange' },
		{ value: 'papaya', label: 'Papaya' },
		{ value: 'quince', label: 'Quince' },
		{ value: 'raspberry', label: 'Raspberry' },
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'tangerine', label: 'Tangerine' }
	];

	let fruit = $state<string>('');
</script>

<Head>
	<title>Select Component Root - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>Components Header</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<div class="relative">
				<button id="my-anchor-popover" class="anchor" popovertarget="my-target-popover"> Anchor (click to open) </button>
				<div id="my-target-popover" class="target" popover="">Popover (Target)</div>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>Components Footer</Page.Footer>
</Page>

<style>
	#my-anchor-popover {
		position: absolute;
		background-color: blue;
		anchor-name: --my-anchor-popover;
	}

	#my-target-popover {
		position: absolute;
		background-color: red;
		left: anchor(--my-anchor-popover right);
		top: anchor(--my-anchor-popover bottom);
	}
</style>
