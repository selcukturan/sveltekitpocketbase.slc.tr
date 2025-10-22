import {
	filterPackString,
	filterObjectToHashUrl,
	type FilterDerived,
	hashUrlToFilterObject,
	type AnyCondition
} from '$lib/utils/filter-string-helper';
import { goto } from '$app/navigation';
import { untrack } from 'svelte';
import { normalizeStringForTurkishSearch } from '$lib/utils/common';
import * as v from 'valibot';

export class Navigator<TSchema extends v.ObjectSchema<any, any>> {
	#schema: TSchema;

	#currentHash = $state('');
	get currentHash() {
		return this.#currentHash;
	}
	private set currentHash(v) {
		this.#currentHash = v;
	}

	#trackHashFilterString = $state('');

	// v.InferOutput, şemanın `parse` sonrası üreteceği veri türünü bize verir.
	#params: Required<v.InferOutput<TSchema>> = $state({} as Required<v.InferOutput<TSchema>>);
	get params(): Required<v.InferOutput<TSchema>> {
		return this.#params;
	}
	private set params(v: Required<v.InferOutput<TSchema>>) {
		this.#params = v;
	}

	/* rootFilter: FilterState = {
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
	}; */

	filterDerived: FilterDerived<v.InferOutput<TSchema>> = $derived.by(() => {
		const filterParams = (this.params as any).filter;

		// 1. `filterParams`'ın geçerli bir nesne olduğundan emin ol.
		// Değilse, boş bir filtre döndür.
		if (typeof filterParams !== 'object' || filterParams === null) {
			return { type: 'group', operator: '&&', children: [] };
		}

		// 2. Object.entries() ile anahtar-değer çiftlerini diziye dönüştür.
		const children = Object.entries(filterParams)
			// 3. Değeri olmayan (undefined, null, boş string) filtreleri atla.
			.filter(([key, value]) => value !== undefined && value !== null && value !== '')
			// 4. Kalan her bir [anahtar, değer] çiftini bir 'condition' nesnesine dönüştür.
			.map(([key, value]) => {
				// Değeri özel olarak işle (örneğin string ise normalize et).
				const processedValue = typeof value === 'string' ? normalizeStringForTurkishSearch(value) : value;

				return {
					type: 'condition' as const, // 'as const' tür çıkarımını iyileştirir
					field: key as keyof v.InferOutput<TSchema>, // TypeScript'e bunun geçerli bir alan adı olduğunu söylüyoruz
					operator: '~' as any, // cast to avoid ComparisonOperator narrowing issues
					value: processedValue as v.InferOutput<TSchema>[keyof v.InferOutput<TSchema>] // Değerin türünü onaylıyoruz
				} as AnyCondition<v.InferOutput<TSchema>>;
			});

		return {
			type: 'group',
			operator: '&&',
			children: children
		};
	});

	// Constructor'ı şemayı ve başlangıç parametrelerini alacak şekilde güncelliyoruz.

	constructor(initialHashUrl: string = '', schema: TSchema, initialParams: Partial<v.InferInput<TSchema>> = {}) {
		this.#schema = schema;

		const schemaKeys = Object.keys(this.#schema.entries);

		// 1. Tüm değerlerden temel bir nesne oluşturuyoruz.
		// Örn: { page: undefined, filter: {}, sort: undefined, recordId: undefined }
		const baseObjectWithAllKeys = Object.fromEntries(
			schemaKeys.map((key) => {
				const value = key === 'filter' ? {} : undefined;
				return [key, value];
			})
		);

		// 2. Unpack yapılmış filtre ile diğer parametreleri `initialHashUrl`den alıyoruz.
		const filterParamObject = this.getFilterHashFlatObject(initialHashUrl); // Örn: { filter: { title: 'test', quantity: 10 } }
		const otherParamsObject = this.getOtherParamsAsObject(initialHashUrl); // Örn: { sort: 'order', page: '2', recordId: 'abc123' }

		// 3. Birleştirme sırası önemlidir:
		const combinedInput = {
			...baseObjectWithAllKeys,
			...filterParamObject,
			...otherParamsObject,
			...initialParams
		};

		// Şema ile Doğrula ve İşle
		try {
			// Artık `combinedInput` her zaman şemadaki tüm anahtarları içeriyor.
			// Valibot'un `parse` fonksiyonu bu anahtarların her birini işleyecektir.
			const parsedData = v.parse(this.#schema, combinedInput);
			this.params = parsedData as Required<v.InferOutput<TSchema>>;
		} catch (error) {
			console.error('URL parametreleri doğrulamadan geçemedi:', error);
			const defaultData = v.parse(this.#schema, {});
			this.params = defaultData as Required<v.InferOutput<TSchema>>;
		}

		this.setFilter();
	}

	getFilter = $derived.by(() => {
		this.#trackHashFilterString;
		return untrack(() => this.currentHash);
	});

	setFilter() {
		const hashObject = this.createCurrentHash(this.filterDerived, this.params);
		this.goto(hashObject.hash);
		this.currentHash = hashObject.hash;
		this.#trackHashFilterString = hashObject.filter;
	}

	setParams(newParams: Partial<v.InferInput<TSchema>>) {
		this.params = { ...this.params, ...newParams } as Required<v.InferOutput<TSchema>>;
		const hashObject = this.createCurrentHash(this.filterDerived, this.params);
		this.goto(hashObject.hash);
		this.currentHash = hashObject.hash;
	}

	goto(hashUrl: string) {
		if (Object.keys(this.params).length === 0) return;

		if (hashUrl !== this.currentHash) {
			goto(hashUrl, { replaceState: true, keepFocus: true });
			this.currentHash = hashUrl;
		}
	}

	// HELPER METHODS
	getOtherParamsAsObject(hashUrl: string) {
		const currentAllParams = new URLSearchParams(hashUrl.replace('#', ''));
		currentAllParams.delete('filter');
		return Object.fromEntries(currentAllParams.entries());
	}
	createCurrentHash(filterDerived: FilterDerived<any>, params: v.InferOutput<TSchema>) {
		const filterString = filterPackString(filterDerived);
		const filter = filterString ? `filter=${filterString}` : '';
		const page = params.page ? `page=${params.page}` : '';
		const sort = params.sort ? `sort=${params.sort}` : '';
		const recordId = params.recordId ? `recordId=${params.recordId}` : '';
		const hash = [page, filter, sort, recordId].filter((part) => part !== '').join('&');

		return { hash: hash ? `#${hash}` : '', filter, page, sort, recordId };
	}
	getFilterInputValue(itemKey: keyof TSchema) {
		const restoredFilterState = hashUrlToFilterObject<TSchema>(this.currentHash);
		return this.params[itemKey]
			? this.params[itemKey]
			: restoredFilterState
				? ((restoredFilterState.children[0] as any).value as TSchema[keyof TSchema])
				: null;
	}

	getFilterHashValueByItemKey(itemKey: keyof TSchema) {
		const restoredFilterState = hashUrlToFilterObject<TSchema>(this.currentHash);

		if (restoredFilterState && Array.isArray(restoredFilterState.children)) {
			const child = restoredFilterState.children.find((c: any) => c.field === itemKey);
			if (child && 'value' in child) {
				return child.value as TSchema[keyof TSchema];
			}
			return null;
		}
	}

	getFilterHashFlatObject(hashUrl: string) {
		let returnedObject: Partial<TSchema> = {};
		const restoredFilterState = hashUrlToFilterObject<TSchema>(hashUrl);
		if (restoredFilterState && Array.isArray(restoredFilterState.children)) {
			restoredFilterState.children.forEach((child: any) => {
				if (child && 'field' in child && 'value' in child) {
					returnedObject = {
						...returnedObject,
						[child.field]: child.value as TSchema[keyof TSchema]
					};
				}
			});
		}
		return { filter: returnedObject };
	}
}
