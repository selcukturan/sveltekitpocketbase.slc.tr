<script lang="ts">
	import { Head, Page } from '$lib/components/templates';
	import { Select } from '$lib/components/bits/select';

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
			<Select {items} type="single" bind:value={fruit} />
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>Components Footer</Page.Footer>
</Page>
