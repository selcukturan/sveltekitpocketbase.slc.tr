<script lang="ts">
	import { Head, Page, Header, Main, Footer } from '$lib/components/base/templates';
	import { BasicDataTable, type Settings } from '$lib/components/base/data-table-virtual/provider';

	type DataType = {
		sira: string;
		id: string;
		mustahsil: string;
		tip: string;
		bolge: string;
		il: string;
		ilce: string;
		tutar: string;
	};

	function generateData(count: number): DataType[] {
		const data: DataType[] = [];
		for (let i = 1; i <= count; i++) {
			data.push({
				sira: i.toString(),
				id: (31000 + i).toString(),
				mustahsil: `Mustahsil ${i}`,
				tip: 'AVANS_ODEME',
				bolge: 'IC EGE',
				il: 'DENIZLI',
				ilce: 'CAL',
				tutar: (Math.random() * 100000).toFixed(2)
			});
		}
		return data;
	}

	let data: DataType[] = $state(generateData(10));
	let settings: Settings<DataType> = $state({
		columns: [
			{ field: 'sira', label: 'Sıra' },
			{ field: 'id', label: 'ID', hidden: true },
			{ field: 'mustahsil', label: 'Mustahsil' },
			{ field: 'tip', label: 'Tip' },
			{ field: 'bolge', label: 'Bölge' },
			{ field: 'il', label: 'İl' },
			{ field: 'ilce', label: 'İlçe' },
			{ field: 'tutar', label: 'Tutar' }
		],
		footers: [{ sira: '1', id: '2', mustahsil: '3', tip: '4', bolge: '5', il: '6', ilce: '7', tutar: '8' }]
	});

	const setPageData = (count: number) => {
		data = generateData(count);
	};
</script>

<Head>
	<title>Virtual Table - SLC Web Applications v.dev.122</title>
	<meta name="description" content="Virtual Table - SLC Web Applications" />
</Head>

<Page>
	<Header class="flex gap-10 border-b bg-surface-50 p-2">
		<button onclick={() => setPageData(100)} class="bg-surface-200 p-1">100</button>
		<button onclick={() => setPageData(1000)} class="bg-surface-200 p-1">1000</button>
		<button onclick={() => setPageData(10000)} class="bg-surface-200 p-1">10000</button>
		<button onclick={() => setPageData(100000)} class="bg-surface-200 p-1">100000</button>
		<button onclick={() => setPageData(1000000)} class="bg-surface-200 p-1">1000000</button>
		<p>Current Count:{data.length}</p>
	</Header>
	<Main>
		<BasicDataTable {data} {settings} />
	</Main>
	<Footer class="flex gap-10 border-t bg-surface-50">
		<p>Page Footer</p>
	</Footer>
</Page>
