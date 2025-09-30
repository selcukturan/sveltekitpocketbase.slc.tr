import {
	filterObjectToHashUrl,
	type FilterDerived,
	hashUrlToFilterObject
} from '$lib/client/utils/filter-string-helper';
import { goto } from '$app/navigation';
import { tick, untrack } from 'svelte';

export class Navigator<TInput extends Record<string, unknown>> {
	#currentHash = $state('');
	get currentHash() {
		return this.#currentHash;
	}
	private set currentHash(v) {
		this.#currentHash = v;
	}

	#filterInput: TInput = $state({} as TInput);
	get filterInput() {
		return this.#filterInput;
	}
	set filterInput(v) {
		this.#filterInput = v;
	}

	filterDerived: FilterDerived<TInput> = $derived.by(() => {
		return {
			type: 'group',
			operator: '&&',
			children: [
				{
					type: 'condition',
					field: 'producer',
					operator: '~',
					value: this.filterInput['producer'] as TInput[keyof TInput]
				},
				{
					type: 'condition',
					field: 'quantity',
					operator: '>',
					value: this.filterInput['quantity'] as TInput[keyof TInput]
				}
			]
		};
	});

	constructor(
		initialHashUrl: string = '',
		initialFilterInput: TInput = {} as TInput
	) {
		const isInitialHashUrl = initialHashUrl.replace('#', '') !== '';

		if (isInitialHashUrl) {
			// Öncelik 1: URL'de bir hash varsa.
			const filterHashFlatObject = this.getFilterHashFlatObject(initialHashUrl);
			for (const key in filterHashFlatObject) {
				if (filterHashFlatObject[key] !== null) {
					this.filterInput[key] = filterHashFlatObject[
						key
					] as TInput[typeof key];
				}
			}
			this.currentHash = initialHashUrl;
		} else {
			// Öncelik 2: URL'de hash yoksa ve bir başlangıç filtresi (initialFilterInput) sağlanmışsa.
			this.filterInput = initialFilterInput;

			tick().then(() => {
				const hash = filterObjectToHashUrl(initialHashUrl, this.filterDerived);
				this.goto(hash);
			});
		}
	}

	getRemoteFilterParams(hashUrl: string) {
		const hash = filterObjectToHashUrl(
			hashUrl,
			untrack(() => this.filterDerived)
		);
		return hash;
	}

	triggerFilter(hashUrl: string) {
		const hash = filterObjectToHashUrl(
			hashUrl,
			untrack(() => this.filterDerived)
		);
		this.goto(hash);
	}

	goto(hashUrl: string) {
		if (Object.keys(this.filterInput).length === 0) return;

		if (hashUrl !== this.currentHash) {
			goto(hashUrl); // getRemoteFilterParams'ı tetikler
			this.currentHash = hashUrl;
		}
	}

	getFilterInputValue(itemKey: keyof TInput) {
		const restoredFilterState = hashUrlToFilterObject<TInput>(this.currentHash);

		/* return restoredFilterState
			? ((restoredFilterState.children[0] as any).value as TInput[keyof TInput])
			: itemKey
				? this.filterInput[itemKey]
				: ''; */

		/* return restoredFilterState
			? ((restoredFilterState.children[0] as any).value as TInput[keyof TInput])
			: itemKey
				? this.filterInput[itemKey]
				: ''; */
		return this.filterInput[itemKey]
			? this.filterInput[itemKey]
			: restoredFilterState
				? ((restoredFilterState.children[0] as any)
						.value as TInput[keyof TInput])
				: null;
	}

	getFilterHashValueByItemKey(itemKey: keyof TInput) {
		const restoredFilterState = hashUrlToFilterObject<TInput>(this.currentHash);

		if (restoredFilterState && Array.isArray(restoredFilterState.children)) {
			const child = restoredFilterState.children.find(
				(c: any) => c.field === itemKey
			);
			if (child && 'value' in child) {
				return child.value as TInput[keyof TInput];
			}
			return null;
		}

		/* return restoredFilterState
			? ((restoredFilterState.children[0] as any).value as TInput[keyof TInput])
			: null; */
	}

	getFilterHashFlatObject(hashUrl: string) {
		let returnedObject: Partial<TInput> = {};
		const restoredFilterState = hashUrlToFilterObject<TInput>(hashUrl);
		if (restoredFilterState && Array.isArray(restoredFilterState.children)) {
			restoredFilterState.children.forEach((child: any) => {
				if (child && 'field' in child && 'value' in child) {
					returnedObject = {
						...returnedObject,
						[child.field]: child.value as TInput[keyof TInput]
					};
				}
			});
		}
		return returnedObject;
	}
}
