<script lang="ts">
	import {
		type FilterState,
		packFilter,
		unpackFilter,
		buildPocketbaseFilterString
	} from '$lib/client/utils/filter-string-helper';

	const rootFilter: FilterState = {
		type: 'group',
		operator: '||',
		children: [
			{
				type: 'group',
				operator: '&&',
				children: [
					{
						type: 'condition',
						field: 'status',
						operator: '=',
						value: 'active'
					},
					{
						type: 'condition',
						field: 'age',
						operator: '>',
						value: 18
					}
				]
			},
			{
				type: 'condition',
				field: 'type',
				operator: '!=',
				value: 'guest'
			}
		]
	};

	// === TÜRETİLMİŞ DEĞER (DERIVED) ===
	// `rootFilter` her değiştiğinde bu metin otomatik olarak yeniden hesaplanır.
	// let finalFilterString = $derived(buildFilterString(rootFilter));

	console.log('--- BAŞLANGIÇ DURUMU ---');
	console.log('Orijinal Obje:', rootFilter);

	// === 1. ADIM: Obje -> URL Metni ===
	const urlString = packFilter(rootFilter);
	console.log("\n--- OBJE'DEN METNE DÖNÜŞÜM ---");
	console.log("URL'de Saklanacak Güvenli Metin:", urlString);

	// === 2. ADIM: URL Metni -> Obje ===
	// (Kullanıcının bu URL'e sahip bir linki açtığını hayal edelim)
	const restoredFilterState = unpackFilter(urlString);
	console.log("\n--- METİNDEN OBJE'YE DÖNÜŞÜM ---");
	console.log("URL'den Geri Yüklenen Obje:", restoredFilterState);

	// === 3. ADIM: SON KONTROL VE POCKETBASE METNİ OLUŞTURMA ===
	// Geri yüklenen objenin orijinaliyle aynı olup olmadığını kontrol edelim.
	const isSuccess =
		JSON.stringify(rootFilter) === JSON.stringify(restoredFilterState);
	console.log('\n--- SON KONTROL ---');
	console.log('Dönüşüm Başarılı mı?', isSuccess);

	if (isSuccess && restoredFilterState) {
		// Şimdi, geri yüklediğimiz bu GÜVENİLİR OBJEYİ kullanarak
		// PocketBase'e göndereceğimiz metni oluşturalım.
		const pocketbaseString = buildPocketbaseFilterString('filter=' + urlString);
		console.log("\nPocketBase'e formatı:", pocketbaseString);
		// Beklenen Çıktı: ((status = 'active' and age > 18) or type != 'guest')
	}
</script>

<div>x</div>
