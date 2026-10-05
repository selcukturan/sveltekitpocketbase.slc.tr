import { getContext, setContext } from 'svelte';
import type { ItemDetailCacheType, RelationValueTypeChoice } from '../type.js';
import type { RelationListParamsType } from '#lib/remotes/relations.remote.js';
import { SvelteMap } from 'svelte/reactivity';

class RelationInputsContext<Tmultiple extends boolean = false> {
	itemDetailCache: ItemDetailCacheType = new SvelteMap();
	pickerValue: RelationValueTypeChoice<Tmultiple>;
	pickerParams: RelationListParamsType;

	constructor(initialValue: RelationValueTypeChoice<Tmultiple>, defaultSearch: string) {
		this.pickerValue = $state(initialValue);
		this.pickerParams = $state({ collection: '', search: defaultSearch, timestamp: new Date().getTime() });
	}
}

// ################################## BEGIN Export Form Context ##############################################
const key = Symbol('SLC-RELATION-INPUTS-CONTEXT');

export function createRelationInputsContext<Tmultiple extends boolean = false>(initialValue: RelationValueTypeChoice<Tmultiple>, defaultSearch: string) {
	const instance = new RelationInputsContext<Tmultiple>(initialValue, defaultSearch);
	setContext(key, instance);
	return instance;
}

export function getRelationInputsContext<Tmultiple extends boolean = false>() {
	const instance = getContext<RelationInputsContext<Tmultiple>>(key);
	if (!instance) {
		throw new Error('FormInputsContext not found');
	}
	return instance;
}
// ################################## END Export Form Context ##############################################
