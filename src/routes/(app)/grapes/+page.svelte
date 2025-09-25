<!-- Recursive node rendering -->
<script lang="ts" module>
	// Tek bir koşulun operatörleri
	type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | '~';

	// Grupların mantıksal operatörleri
	type LogicalOperator = 'and' | 'or';

	// Ağacımızın en uç yaprakları: Tek bir filtre koşulu
	interface Condition {
		type: 'condition';
		field: string;
		operator: ComparisonOperator;
		value: string | number | null;
	}

	// Ağacımızın dalları: Koşulları veya diğer grupları içeren bir grup
	interface ConditionGroup {
		type: 'group';
		operator: LogicalOperator;
		children: Array<Condition | ConditionGroup>;
	}

	// Filtre durumumuzun tamamı her zaman bir ana grupla başlar.
	type FilterState = ConditionGroup;
	export let node: Condition | ConditionGroup;
	export let parentGroup: ConditionGroup | undefined;
</script>

<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { deflate, inflate } from 'pako';
	import PocketBase from 'pocketbase';

	const pb = new PocketBase();

	// ========================================================================
	// 1. ADIM: ŞEMA KÜÇÜLTME (KEY MINIFICATION)
	// ========================================================================

	// Uzun anahtar isimlerini tek harfli kısaltmalara eşleştiriyoruz.
	const longToShortKeyMap: { [key: string]: string } = {
		type: 't',
		operator: 'o',
		children: 'c',
		field: 'f',
		value: 'v',
		group: 'g',
		condition: 'n' // 'c' dolu olduğu için 'n' (node) kullanalım
	};

	// Tam tersi işlemi yapmak için kısa anahtarları uzunlara eşleştiriyoruz.
	const shortToLongKeyMap = Object.fromEntries(
		Object.entries(longToShortKeyMap).map(([long, short]) => [short, long])
	);

	/**
	 * Filtre objesini, anahtar isimlerini kısaltarak "paketler".
	 * @param node Orijinal filtre ağacı.
	 */
	function packKeys(node: Condition | ConditionGroup): any {
		// Kısaltılmış yeni bir obje oluştur
		const shortNode: Record<string, any> = {};
		for (const [key, value] of Object.entries(node)) {
			const shortKey = longToShortKeyMap[key];
			if (shortKey) {
				if (key === 'children' && Array.isArray(value)) {
					// Eğer çocukları varsa, onlar için de recursive olarak bu fonksiyonu çağır
					shortNode[shortKey] = value.map(packKeys);
				} else if (key === 'type') {
					// 'group' ve 'condition' gibi değerleri de kısaltalım
					shortNode[shortKey] = longToShortKeyMap[value];
				} else {
					shortNode[shortKey] = value;
				}
			}
		}
		return shortNode;
	}

	/**
	 * Kısa anahtarlı objeyi, orijinal anahtar isimlerine geri "açar".
	 * @param shortNode Paketlenmiş obje.
	 */
	function unpackKeys(shortNode: any): Condition | ConditionGroup {
		const longNode: Record<string, any> = {};
		for (const [key, value] of Object.entries(shortNode)) {
			const longKey = shortToLongKeyMap[key];
			if (longKey) {
				if (longKey === 'children' && Array.isArray(value)) {
					longNode[longKey] = value.map(unpackKeys);
				} else if (longKey === 'type') {
					longNode[longKey] = shortToLongKeyMap[String(value)];
				} else {
					longNode[longKey] = value;
				}
			}
		}
		return longNode as Condition | ConditionGroup;
	}
	// ========================================================================
	// 2. ADIM: URL-SAFE BASE64 YARDIMCI FONKSİYONLARI
	// ========================================================================

	/**
	 * Binary veriyi (Uint8Array) URL-Safe Base64 metnine çevirir.
	 */
	function uint8ArrayToBase64Url(bytes: Uint8Array): string {
		return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
			.replace(/\+/g, '-') // '+' karakterini '-' ile değiştir
			.replace(/\//g, '_') // '/' karakterini '_' ile değiştir
			.replace(/=+$/, ''); // Sondaki '=' padding'ini kaldır
	}

	/**
	 * URL-Safe Base64 metnini geri Binary veriye (Uint8Array) çevirir.
	 */
	function base64UrlToUint8Array(base64: string): Uint8Array {
		base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
		const binaryString = atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}

	// ========================================================================
	// 3. ADIM: ANA PAKETLEME VE AÇMA FONKSİYONLARI
	// ========================================================================

	/**
	 * Bir FilterState objesini alır ve onu URL'de saklanabilecek
	 * kısa, sıkıştırılmış bir metne dönüştürür.
	 * @param state Orijinal filtre ağacı.
	 */
	export function packFilter(state: FilterState): string {
		try {
			// 1. Anahtarları kısalt
			const packedObject = packKeys(state);
			// 2. JSON'a çevir
			const jsonString = JSON.stringify(packedObject);
			// 3. Sıkıştır (pako.deflate)
			const compressed = deflate(jsonString);
			// 4. URL-Safe Base64'e kodla
			return uint8ArrayToBase64Url(compressed);
		} catch (e) {
			console.error('Filtre paketlenirken hata oluştu:', e);
			return '';
		}
	}

	/**
	 * URL'den alınan paketlenmiş metni geri orijinal FilterState objesine çevirir.
	 * @param packedString URL'den gelen sıkıştırılmış metin.
	 */
	export function unpackFilter(
		packedString: string | null
	): FilterState | null {
		if (!packedString) return null;
		try {
			// 1. URL-Safe Base64'ten çöz
			const compressed = base64UrlToUint8Array(packedString);
			// 2. Sıkıştırılmış veriyi aç (pako.inflate)
			const jsonString = inflate(compressed, { to: 'string' });
			// 3. JSON'ı objeye çevir
			const packedObject = JSON.parse(jsonString);
			// 4. Kısa anahtarları orijinal haline geri getir
			return unpackKeys(packedObject) as FilterState;
		} catch (e) {
			console.error('Filtre açılırken hata oluştu:', e);
			return null;
		}
	}

	/**
	 * Filtre ağacını (state) PocketBase'in anlayacağı bir metne çeviren recursive fonksiyon.
	 * @param node Mevcut ağaç düğümü (grup veya koşul).
	 */
	function buildFilterString(node: FilterState | Condition): string {
		// Düğüm tek bir koşul ise (yaprak)
		if (node.type === 'condition') {
			if (!node.field || !node.value) return '';
			// Tek koşul için pb.filter kullanarak güvenli metin oluştur
			return pb.filter(`${node.field} ${node.operator} {:value}`, {
				value: node.value
			});
		}

		// Düğüm bir grup ise (dal)
		if (node.type === 'group') {
			if (node.children.length === 0) return '';

			const childrenStrings = node.children
				.map(buildFilterString) // Her bir çocuk için kendini tekrar çağır (recursion)
				.filter(Boolean); // Boş olanları filtrele

			if (childrenStrings.length === 0) return '';

			// Çocukları grubun operatörü ile birleştir ve parantez içine al.
			// Örn: (child1) AND (child2)
			const logicalJoin = ` ${node.operator} `;
			return `(${childrenStrings.join(logicalJoin)})`;
		}

		return '';
	}

	// === BAŞLANGIÇ ===
	// 1. Karmaşık bir filtre objemiz var.
	// const rootFilter: FilterState = $state<FilterState>({
	const rootFilter: FilterState = {
		type: 'group',
		operator: 'or',
		children: [
			{
				type: 'group',
				operator: 'and',
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
		const pocketbaseString = buildFilterString(restoredFilterState);
		console.log("\nPocketBase'e formatı:", pocketbaseString);
		// Beklenen Çıktı: ((status = 'active' and age > 18) or type != 'guest')
	}
</script>

<div>x</div>
