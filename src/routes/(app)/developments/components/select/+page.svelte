<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { Select } from '$lib/components/base/select';

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
		{ value: 'selcuk2', label: 'Selcuk' },
		{ value: 'sec', label: 'Sec' },
		{ value: 'seç', label: 'Seç' },
		{ value: 'tangerine', label: 'Tangerine' }
	];

	let value = $state(''); // Başlangıçta seçili olan değer
	let value1 = $state(['raspberry', 'mango', 'apple']); // Başlangıçta seçili olan değer

	let value2 = $state(''); // Başlangıçta seçili olan değer
	let value3 = $state(['tangerine', 'onange', 'kiwi']); // Başlangıçta seçili olan değer
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
			<h1 class="py-2 text-2xl">Single - Select Not Required</h1>
			<Select {options} bind:value class="w-full" />
			<p>Selected Value: {value}</p>

			<h1 class="py-2 text-2xl">Single - Select Required</h1>
			<Select {options} bind:value={value2} required class="w-full" />
			<p>Selected Value: {value2}</p>

			<h1 class="py-2 text-2xl">Multiple - Select Not Required</h1>
			<Select {options} bind:value={value1} multiple class="w-full" />
			<p>Selected Value: {JSON.stringify(value1)}</p>

			<h1 class="py-2 text-2xl">Multiple - Select Required</h1>
			<Select {options} bind:value={value3} multiple required class="w-full" />
			<p>Selected Value: {JSON.stringify(value3)}</p>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Page Footer Text</p>
	</Page.Footer>
</Page>
