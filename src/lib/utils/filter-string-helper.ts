import { deflate, inflate } from 'pako';
import PocketBase from 'pocketbase';

// #########################################################################################################################################################
// Bu temel tipler aynı kalır
type ComparisonOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | '~' | '!~';
type LogicalOperator = '&&' | '||';

// TInput, { producer: string, price: number } gibi bir obje tipini temsil eder.
// `extends Record<string, any>` TInput'un bir obje olması gerektiğini zorunlu kılar.

// 1. JENERİK KOŞUL TİPİ (ANYCONDITION)
// Bu, sihrin gerçekleştiği yerdir.
// TInput objesinin her bir anahtarını (K in keyof TInput) gezer ve
// her anahtar için spesifik bir condition objesi tipi oluşturur.
export type AnyCondition<TInput extends Record<string, any>> = {
	[K in keyof TInput]: {
		type: 'condition';
		field: K; // field, sadece TInput'un anahtarlarından biri olabilir.
		operator: ComparisonOperator;
		value: TInput[K]; // value, o anahtarın TInput'taki tipine sahip olmalıdır.
	};
}[keyof TInput]; // Bu [keyof TInput] ifadesi, yukarıdaki objeyi bir union tipine dönüştürür.

// 2. JENERİK GRUP TİPİ (CONDITIONGROUP)
// Bu tip artık jenerik AnyCondition tipini kullanır ve kendini tekrar eder (recursive).
export interface ConditionGroup<TInput extends Record<string, any>> {
	type: 'group';
	operator: LogicalOperator;
	children: Array<AnyCondition<TInput> | ConditionGroup<TInput>>;
}

// 3. JENERİK ANA FİLTRE TİPİ (FILTERSTATE)
// Bu da artık TInput tipini alır ve ConditionGroup'a paslar.
export type FilterDerived<TInput extends Record<string, any>> = ConditionGroup<TInput>;

// #########################################################################################################################################################
// pb.filter(...) kullanabilmek için PocketBase örneği oluşturalım
const pb = new PocketBase();
// #########################################################################################################################################################
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
const shortToLongKeyMap = Object.fromEntries(Object.entries(longToShortKeyMap).map(([long, short]) => [short, long]));

/**
 * Filtre objesini, anahtar isimlerini kısaltarak "paketler".
 * @param node Orijinal filtre ağacı.
 */
function packKeys(node: AnyCondition<any> | ConditionGroup<any>): any {
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
function unpackKeys(shortNode: any): AnyCondition<any> | ConditionGroup<any> {
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
	return longNode as AnyCondition<any> | ConditionGroup<any>;
}
// #########################################################################################################################################################
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

// #########################################################################################################################################################
// ========================================================================
// 3. ADIM: ANA PAKETLEME VE AÇMA FONKSİYONLARI
// ========================================================================

/**
 * Bir FilterDerived objesini alır ve onu URL'de saklanabilecek
 * kısa, sıkıştırılmış bir metne dönüştürür.
 * @param state Orijinal filtre ağacı.
 */
export function packFilter<TInput extends Record<string, any>>(state: FilterDerived<TInput>): string {
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
 * URL'den alınan paketlenmiş metni geri orijinal FilterDerived objesine çevirir.
 * @param packedString URL'den gelen sıkıştırılmış metin.
 */
export function unpackFilter<TInput extends Record<string, any>>(
	packedString: string | null
): FilterDerived<TInput> | null {
	if (!packedString) return null;
	try {
		// 1. URL-Safe Base64'ten çöz
		const compressed = base64UrlToUint8Array(packedString);
		// 2. Sıkıştırılmış veriyi aç (pako.inflate)
		const jsonString = inflate(compressed, { to: 'string' });
		// 3. JSON'ı objeye çevir
		const packedObject = JSON.parse(jsonString);
		// 4. Kısa anahtarları orijinal haline geri getir
		return unpackKeys(packedObject) as FilterDerived<TInput>;
	} catch (e) {
		console.error('Filtre açılırken hata oluştu:', e);
		return null;
	}
}

// #########################################################################################################################################################
/**
 * Filtre ağacını (state) PocketBase'in anlayacağı bir metne çeviren recursive fonksiyon.
 * @param node Mevcut ağaç düğümü (grup veya koşul).
 */
function buildFilterString(node: FilterDerived<any> | AnyCondition<any>): string {
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
// ######################################## HELPER #################################################################################################################
export function buildPocketbaseFilterString(hashUrl: string) {
	const currentSearchParams = new URLSearchParams(hashUrl.replace('#', ''));
	const filterParam = currentSearchParams.get('filter');

	const restoredFilterState = unpackFilter(filterParam) as FilterDerived<any>;
	const pocketbaseFilterString = filterParam ? buildFilterString(restoredFilterState) : undefined;
	return pocketbaseFilterString;
}

export function hashUrlToFilterObject<TInput extends Record<string, any>>(hashUrl: string) {
	const currentSearchParams = new URLSearchParams(hashUrl.replace('#', ''));
	const filterParam = currentSearchParams.get('filter');

	return filterParam ? (unpackFilter(filterParam) as FilterDerived<TInput>) : null;
}

export function filterObjectToHashUrl(hashUrl: string, filterState: FilterDerived<any>) {
	if (!filterState.children || filterState.children.length === 0) return '';
	const currentSearchParams = new URLSearchParams(hashUrl.replace('#', ''));
	const filterValue = packFilter(filterState);
	currentSearchParams.set('filter', filterValue);
	return `#${currentSearchParams.toString()}`;
}

export function filterPackString(filterState: FilterDerived<any>) {
	if (!filterState.children || filterState.children.length === 0) return '';
	return packFilter(filterState);
}
