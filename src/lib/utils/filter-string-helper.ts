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
			if (!currentNode.field || currentNode.value === undefined || currentNode.value === null || currentNode.value === '') {
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
