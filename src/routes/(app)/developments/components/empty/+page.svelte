<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import type { MenuNode } from '$lib/client/types/my-pocketbase-types';

	let { data } = $props();

	let searchQuery = $state('');

	const rawTreeData = data.treeMenu;

	// console.log(data.treeMenu);
	// console.log(data.treeMenuUser);
	// console.log('data.treeMenuUserView', data.treeMenuUserView);
	console.log('xxxx', data.xxxx);
	function buildTreeMenu(flatRecord: MenuNode[]): MenuNode[] {
		// Tüm elemanları ID'leri ile eşleyerek hızlı erişim için bir Map oluştur.
		const map = new Map<string, MenuNode>();

		flatRecord.forEach((item) => {
			// if (item.status !== 'active') return; // Sadece aktif olanları işle
			map.set(item.id, { ...item, sub: [] }); // Her eleman için sub dizisi hazırla
		});

		const tree: MenuNode[] = [];

		flatRecord.forEach((item) => {
			// Eğer elemanın bir ebeveyni (parent) varsa, onu bul ve altına Map referansını ekle
			if (item.parent_id) {
				const parentNodeMapReference = map.get(item.parent_id); // 1. Ebeveyn (parent) objesinin referansını Map'ten al
				if (!parentNodeMapReference) return; // bu iterasyonu atla (sonraki elemana geç)

				const childNodeMapReference = map.get(item.id); // 2. Mevcut child (çocuk) objesinin referansını Map'ten al
				if (!childNodeMapReference) return; // bu iterasyonu atla (sonraki elemana geç)

				parentNodeMapReference.sub.push(childNodeMapReference); // 3. Child (çocuk) objesinin referansını, ebeveyn (parent) objesi referansının 'sub' dizisine ekle
			}
			// Eğer ebeveyni yoksa, bu bir kök elemandır. Doğrudan tree'ye push() ile Map referansını ekle
			else {
				const rootNodeMapReference = map.get(item.id);
				if (!rootNodeMapReference) return; // bu iterasyonu atla (sonraki elemana geç)

				tree.push(rootNodeMapReference); // objelerinin referanslarını kopyaladığı anlamına gelir. Artık tree ve map, aynı bellek adresindeki objelere işaret ediyorlar.
			}
		});

		return tree;
	}

	/**
	 * Bir string'i arama için normalize eder:
	 * - Türkçe'ye uygun küçük harfe çevirir.
	 * - Aksan/şapka gibi işaretleri kaldırır (örn: ş -> s, ö -> o).
	 * Girdi: "ÖĞRENCİ IŞIKLARI"
	 * Sonuç: Artık kullanıcı arama kutusuna ister "ogrenci", ister "Öğrenci", ister "ogrencı" yazsın,
	 * hepsi aynı standart formda ("ogrenci isiklari") olarak dönüştürülür.
	 */
	function normalizeForTurkishSearch(str: string): string {
		return str
			.normalize('NFD') // 1. Karakterleri ve aksanları ayır
			.replace(/[\u0300-\u036f]/g, '') // 2. Aksan işaretlerini kaldır
			.toLocaleLowerCase('tr-TR') // 3. Türkçe'ye uygun küçük harfe çevir
			.replace(/ı/g, 'i'); // 4. Tüm 'ı' harflerini 'i' yap
	}

	function searchTreeMenu(treeItems: MenuNode[], query: string): MenuNode[] {
		const normalizedQuery = normalizeForTurkishSearch(query);

		if (!normalizedQuery) {
			return treeItems; // Arama boşsa orijinal listeyi döndür
		}

		// reduce fonksiyonu ile yeni bir dizi oluşturuyoruz
		return treeItems.reduce<MenuNode[]>((acc, item) => {
			// 1. Mevcut elemanın başlığı eşleşiyor mu?
			const normalizedTitle = normalizeForTurkishSearch(item.title);
			const isParentMatch = normalizedTitle.includes(normalizedQuery);

			// 2. Alt elemanları var mı? Varsa onları da ara (recursive çağrı)
			let filteredChildren: MenuNode[] = [];
			if (item.sub && item.sub.length > 0) {
				filteredChildren = searchTreeMenu(item.sub, query);
			}

			// 3. Mevcut eleman veya alt elemanlarından herhangi biri eşleşti mi?
			if (isParentMatch || filteredChildren.length > 0) {
				// Eğer ebeveyn eşleşiyorsa, tüm alt elemanlarını göster.
				// Eğer sadece alt eleman eşleşiyorsa, ebeveyni ve sadece eşleşen alt elemanları göster.
				acc.push({
					...item,
					sub: isParentMatch ? item.sub : filteredChildren
				});
			}

			return acc;
		}, []);
	}

	// Tree menü oluştur
	const myMenuHierarchyFromPB = buildTreeMenu(rawTreeData);

	// Tree menüde arama yap
	const resultsForSearch = $derived(
		searchTreeMenu(myMenuHierarchyFromPB, searchQuery)
	);
	// $inspect(resultsForSearch);
</script>

<Head>
	<title>Remote [command] - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Remote [command]</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Ara..."
				class="bg-success-300"
			/>
			<ul>
				{#each resultsForSearch as item}
					{@const title = item.title ?? 'CAPTION'}
					{@const url = item.expand.sys_menu_item?.url ?? '#'}
					<li>
						{title} - <a href={url}>{item.id}</a>
						{#if item.sub.length > 0}
							<ul>
								{#each item.sub as subItem}
									{@const subTitle = subItem.title ?? 'CAPTION'}
									{@const url = subItem.expand.sys_menu_item?.url ?? '#'}
									<li>
										{subTitle} - <a href={url}>{subItem.id}</a>
										{#if subItem.sub.length > 0}
											<ul>
												{#each subItem.sub as subSubItem}
													{@const subSubTitle = subSubItem.title ?? 'CAPTION'}
													{@const url =
														subSubItem.expand.sys_menu_item?.url ?? '#'}
													<li>
														{subSubTitle} - <a href={url}>{subSubItem.id}</a>
													</li>
												{/each}
											</ul>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Remote [command] Page Footer</p>
	</Page.Footer>
</Page>

<style>
	ul {
		list-style-type: none;
		padding-left: 1em;
	}
	li {
		margin: 0.5em 0;
	}
</style>
