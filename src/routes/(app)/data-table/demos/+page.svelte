<script lang="ts">
	import { Page, Head } from '$lib/components/templates';

	import appConfig from './data.json' with { type: 'json' };

	appConfig.forEach((item) => {
		console.log(item);
	});

	let set1 = new Set(['A', 'B', 'C']);
	let set2 = new Set(['C', 'D', 'E']);

	console.log('set1', set1);
	console.log('set2', set2);
	console.log(
		'set1.intersection(set2) - ilk set ile ikinci sette aynı olanlar',
		set1.intersection(set2)
	); // {'C'}

	console.log(
		'set1.difference(set2) - ilk sette olup, ikinci sette olmayanlar',
		set1.difference(set2)
	); // {'A', 'B'}

	// Bu da bize ilk sette olup da ikinci sette olmayan her şeyi bırakır:
	console.log(
		'set1.symmetricDifference(set2) - ilk set ile ikinci setin farkı',
		set1.symmetricDifference(set2)
	); // {'A', 'B', 'D', 'E'}

	console.log(
		'set1.union(set2) - ilk set ile ikinci setin birleşimi',
		set1.union(set2)
	);

	// Set ilişkilerini kontrol etmek için üç yöntem vardır.
	// isSubsetOf = ilk kümenin ikincisi tarafından tamamen içerilip içerilmediğini kontrol eder.
	// isSupersetOf = ilk kümenin ikinciyi tamamen içerip içermediğini kontrol eder.
	// isDisjointFrom = iki kümenin tamamen farklı olup olmadığını kontrol eder.

	console.log(
		'set1.isSubsetOf(set2) - ilk set ikinci setin alt kümesi mi?',
		set1.isSubsetOf(set2)
	); // false
	console.log(
		'set1.isSupersetOf(set2) - ilk set ikinci setin üst kümesi mi?',
		set1.isSupersetOf(set2)
	); // false
	console.log(
		'set1.isDisjointFrom(set2) - iki set tamamen farklı mı?',
		set1.isDisjointFrom(set2)
	); // false
</script>

<Head>
	<title>Demos - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Demos Page Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<div>Demos Introduction</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Demos Page Footer</p>
	</Page.Footer>
</Page>
