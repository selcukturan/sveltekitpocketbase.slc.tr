import {
	filterObjectToHashUrl,
	type FilterDerived,
	hashUrlToFilterObject
} from '$lib/client/utils/filter-string-helper';
import { goto } from '$app/navigation';
import { untrack } from 'svelte';

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

	constructor(initialHashUrl: string, initialFilterInput?: TInput) {
		if (initialHashUrl.replace('#', '') !== '') {
			const filterHashFlatObject = this.getFilterHashFlatObject(initialHashUrl);
			for (const key in filterHashFlatObject) {
				if (filterHashFlatObject[key] !== null) {
					this.filterInput[key] = filterHashFlatObject[
						key
					] as TInput[typeof key];
				}
			}
			this.currentHash = initialHashUrl;
		} else if (initialFilterInput) {
			this.filterInput = initialFilterInput;

			const hash = filterObjectToHashUrl(initialHashUrl, this.filterDerived);
			goto(hash);
			this.currentHash = hash;
		}

		/* if (initialFilterInput) {
			this.filterInput = initialFilterInput;
		} else {
			for (const key in this.filterInput) {
				if (typeof this.filterInput[key] === 'string') {
					this.filterInput[key] = '' as TInput[typeof key];
				} else if (typeof this.filterInput[key] === 'number') {
					this.filterInput[key] = 0 as TInput[typeof key];
				} else {
					this.filterInput[key] = null as TInput[typeof key];
				}
			}
		} */
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
		if (hash !== this.currentHash) {
			goto(hash); // getRemoteFilterParams'ı tetikler
			this.currentHash = hash;
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
