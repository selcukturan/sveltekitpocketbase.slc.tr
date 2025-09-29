import {
	filterObjectToHashUrl,
	type FilterDerived,
	hashUrlToFilterObject
} from '$lib/client/utils/filter-string-helper';
import { goto } from '$app/navigation';

export class Navigator<TInput extends Record<string, unknown>> {
	#currentHash = '';
	private get currentHash() {
		return this.#currentHash;
	}
	private set currentHash(v) {
		this.#currentHash = v;
	}

	#filterInput: TInput = {} as TInput;
	get filterInput() {
		return this.#filterInput;
	}
	set filterInput(v) {
		this.#filterInput = v;
	}

	constructor(initialHash: string) {
		this.currentHash = initialHash;
	}

	triggerFilter(filterState: FilterDerived<TInput>) {
		const hash = filterObjectToHashUrl(this.currentHash, filterState);
		this.currentHash = hash;
		goto(hash);
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

	goto(url: string) {
		if (this.currentHash.replace('#', '') !== url) {
			goto(`#${url}`);
		}
	}
}
