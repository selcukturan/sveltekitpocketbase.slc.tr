import type { TypedPocketBase } from '$lib/types/pocketbase-types';
import * as v from 'valibot';
import type { AllCurrentValue } from '$lib/app/schemas/base';

export function getDefaultsFromSchema<S extends v.GenericSchema>(schema: S): v.InferDefaults<S> {
	return v.getDefaults(schema);
}

export function injectFilterData<S extends v.GenericSchema>(
	schema: S,
	filterData: Record<string, AllCurrentValue>
): v.InferOutput<S> {
	const schemaData = v.getDefaults(schema);
	// 1. Orijinal veriyi değiştirmemek için derin bir kopya oluştur.
	// Bu, $state gibi reaktif sistemlerde yan etkileri önler.
	const updatedData = structuredClone(schemaData);

	// 2. Özyinelemeli (recursive) olarak çalışacak yardımcı fonksiyonu tanımla.
	const traverseAndUpdate = (nodes: any[]) => {
		// 'nodes' bir dizidir (children dizisi)
		for (const node of nodes) {
			if (node.type === 'group' && node.children) {
				// Eğer düğüm bir 'group' ise, onun çocukları için fonksiyonu tekrar çağır.
				traverseAndUpdate(node.children);
			} else if (node.type === 'condition') {
				// Eğer düğüm bir 'condition' ise, güncelleme mantığını uygula.
				// Koşulun 'field'ı, input nesnesinde bir anahtar olarak var mı?
				if (node.field in filterData) {
					// Varsa, 'value' alanını input'taki değerle değiştir.
					node.value = filterData[node.field];
				}
			}
		}
	};

	// 3. Özyinelemeyi en üst seviyedeki 'children' dizisinden başlat.
	// Güvenlik: updatedData ve updatedData.filter üzerindeki erişimleri runtime kontrolleri ile yap.
	if (
		updatedData &&
		typeof updatedData === 'object' &&
		'filter' in updatedData &&
		updatedData.filter &&
		typeof updatedData.filter === 'object' &&
		'children' in updatedData.filter &&
		Array.isArray(updatedData.filter.children)
	) {
		traverseAndUpdate(updatedData.filter.children);
	}

	// 4. Güncellenmiş kopyayı döndür.
	return updatedData as v.InferOutput<S>;
}

export function jsonToPocketBaseFilter(node: unknown, pb: TypedPocketBase): string | undefined {
	if (node === null || typeof node !== 'object' || Array.isArray(node)) {
		return undefined;
	}
	// Placeholder'ları benzersiz kılmak için bir sayaç
	let placeholderIndex = 0;

	function buildFilterParts(currentNode: any) {
		// --- Temel Durum: Düğüm bir koşul ise ---
		if (currentNode.type === 'condition') {
			// Geçersiz veya boş değer içeren koşulları atla
			if (
				!currentNode.field ||
				currentNode.value === undefined ||
				currentNode.value === null ||
				currentNode.value === ''
			) {
				return null;
			}

			// Her koşul için benzersiz bir placeholder adı oluştur
			const placeholderKey = `p${placeholderIndex++}`;

			return {
				template: `${currentNode.field} ${currentNode.operator} {:${placeholderKey}}`,
				values: { [placeholderKey]: currentNode.value }
			};
		}

		// --- Özyinelemeli Adım: Düğüm bir grup ise ---
		if (currentNode.type === 'group') {
			if (!currentNode.children || currentNode.children.length === 0) {
				return null;
			}

			const childrenParts = currentNode.children
				.map((child: any) => buildFilterParts(child)) // Her çocuk için özyineleme
				.filter(Boolean); // null dönen sonuçları (geçersiz koşullar) filtrele

			if (childrenParts.length === 0) {
				return null;
			}

			// Çocuklardan gelen şablonları ve değerleri birleştir
			const mergedValues = Object.assign({}, ...childrenParts.map((p: any) => p.values));
			const templateStrings = childrenParts.map((p: any) => p.template);

			// Eğer grupta tek bir geçerli eleman varsa, parantez gereksizdir.
			if (templateStrings.length === 1) {
				return {
					template: templateStrings[0],
					values: mergedValues
				};
			}

			const logicalJoin = ` ${currentNode.operator} `;
			return {
				template: `(${templateStrings.join(logicalJoin)})`,
				values: mergedValues
			};
		}

		return null;
	}

	// Özyinelemeyi başlat ve nihai şablon/değerleri al
	const finalParts = buildFilterParts(node);

	// Eğer hiçbir geçerli koşul bulunamazsa undefined döndür
	if (!finalParts || !finalParts.template) {
		return undefined;
	}

	// En sonda, oluşturulan şablon ve değerlerle pb.filter'ı SADECE BİR KEZ çağır
	return pb.filter(finalParts.template, finalParts.values);
}

// Uzun anahtar isimlerini tek harfli kısaltmalara eşleştiriyoruz.
/* const longToShortKeyMap: { [key: string]: string } = {
	type: 't',
	operator: 'o',
	children: 'c',
	field: 'f',
	value: 'v',
	group: 'g',
	condition: 'n' // 'c' dolu olduğu için 'n' (node) kullanalım
}; */

// Tam tersi işlemi yapmak için kısa anahtarları uzunlara eşleştiriyoruz.
/* const shortToLongKeyMap = Object.fromEntries(Object.entries(longToShortKeyMap).map(([long, short]) => [short, long])); */

/**
 * Filtre objesini, anahtar isimlerini kısaltarak "paketler".
 */
/* function packKeys(node: any): any {
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
				shortNode[shortKey] = longToShortKeyMap[String(value)];
			} else {
				shortNode[shortKey] = value;
			}
		}
	}
	return shortNode;
} */

/**
 * Kısa anahtarlı objeyi, orijinal anahtar isimlerine geri "açar".
 */
/* function unpackKeys(shortNode: any): any {
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
	return longNode as any;
} */

/**
 * Binary veriyi (Uint8Array) URL-Safe Base64 metnine çevirir.
 */
/* function uint8ArrayToBase64Url(bytes: Uint8Array): string {
	return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
		.replace(/\+/g, '-') // '+' karakterini '-' ile değiştir
		.replace(/\//g, '_') // '/' karakterini '_' ile değiştir
		.replace(/=+$/, ''); // Sondaki '=' padding'ini kaldır
} */

/**
 * URL-Safe Base64 metnini geri Binary veriye (Uint8Array) çevirir.
 */
/* function base64UrlToUint8Array(base64: string): Uint8Array {
	base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
	const binaryString = atob(base64);
	const len = binaryString.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes;
} */

/**
 * JSON string'ini Uint8Array'e çevirir.
 */
/* function jsonStringToUint8Array(jsonString: string): Uint8Array {
	// 1. Bir TextEncoder örneği oluşturun. Bu API, string'leri baytlara kodlamak için kullanılır.
	const encoder = new TextEncoder();

	// 2. .encode() metodu ile string'i Uint8Array'e dönüştürün.
	//    Bu metot varsayılan olarak UTF-8 kodlamasını kullanır.
	const uint8Array = encoder.encode(jsonString);

	return uint8Array;
} */

/**
 * Uint8Array'ı geri string'e çevirir.
 */
/* function uint8ArrayToString(uint8Array: Uint8Array): string {
	const decoder = new TextDecoder();
	const decodedString = decoder.decode(uint8Array);
	return decodedString;
} */

/**
 * Filtre objesini paketleyip string'e çevirir.
 */
/* export function packFilter(state: any): string {
	try {
		// 1. Anahtarları kısalt
		const packedObject = packKeys(state);
		// 2. JSON'a çevir
		const jsonString = JSON.stringify(packedObject);
		// 3. Sıkıştır (pako.deflate)
		const compressed = jsonStringToUint8Array(jsonString);
		// 4. URL-Safe Base64'e kodla
		return uint8ArrayToBase64Url(compressed);
	} catch (e) {
		console.error('Filtre paketlenirken hata oluştu:', e);
		return '';
	}
} */

/**
 * Paketlenmiş filtre string'ini orijinal objeye açar.
 */
/* export function unpackFilter(packedString: string | null) {
	if (!packedString) return null;
	try {
		// 1. URL-Safe Base64'ten çöz
		const compressed = base64UrlToUint8Array(packedString);
		// 2. Sıkıştırılmış veriyi aç (pako.inflate)
		const jsonString = uint8ArrayToString(compressed);
		// 3. JSON'ı objeye çevir
		const packedObject = JSON.parse(jsonString);
		// 4. Kısa anahtarları orijinal haline geri getir
		return unpackKeys(packedObject);
	} catch (e) {
		console.error('Filtre açılırken hata oluştu:', e);
		return null;
	}
} */
