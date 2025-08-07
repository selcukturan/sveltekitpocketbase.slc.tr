<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { Select } from '$lib/components/base/select';

	import { SelectPopover } from '$lib/components/base/select';

	const options = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
		{ value: 'date', label: 'Date' },
		{ value: 'elderberry', label: 'Elderberry' },
		{ value: 'feg', label: 'Feg' },
		{ value: 'fig', label: 'Fig' },
		{ value: 'grape', label: 'Grape' },
		{ value: 'honeydew', label: 'Honeydew' },
		{ value: 'kiwi', label: 'Kiwi' },
		{ value: 'lemon', label: 'Lemon' },
		{ value: 'mango', label: 'Mango' },
		{ value: 'nectarine', label: 'Nectarine' },
		{ value: 'orange', label: 'Orange' },
		{ value: 'onange', label: 'Onange' },
		{ value: 'papaya', label: 'Papaya' },
		{ value: 'quince', label: 'Quince' },
		{ value: 'raspberry', label: 'Raspberry' },
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'selcuk', label: 'Selçuk' },
		{ value: 'tangerine', label: 'Tangerine' }
	];

	let value = $state('raspberry'); // Başlangıçta seçili olan değer
	let selectedIndex = $derived(options.findIndex((option) => option.value === value) || -1);
</script>

<Head>
	<title>SLC Select - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Page Header Text</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<h1 class="py-2 text-2xl">Svelte 5 Div Select</h1>

			<Select {options} bind:value bind:selectedIndex />

			<p>Selected Value: {value}</p>
			<p>Selected Index: {selectedIndex}</p>

			<h1 class="py-2 text-2xl">HTML Popover ve CSS Anchor Positioning Select</h1>
			<SelectPopover
				data={[
					{ label: '20', value: '20' },
					{ label: '21', value: '21' }
				]}
			/>
			<SelectPopover
				data={[
					{ label: '24', value: '24' },
					{ label: '25', value: '25' }
				]}
			/>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Page Footer Text</p>
	</Page.Footer>
</Page>
