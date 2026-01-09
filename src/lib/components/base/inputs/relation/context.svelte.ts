import { getContext, setContext } from 'svelte';
import type { ValueType, ListResult } from './type';

class RelationInputContext<Tmultiple extends boolean = false, TData extends Record<string, unknown> = Record<string, unknown>> {
	multiple: Tmultiple | undefined = $state(false as Tmultiple);
	pickerSelected: ValueType<Tmultiple> = $state.raw((this.multiple ? [] : '') as ValueType<Tmultiple>);
	pickerData: ListResult<TData> | undefined = $state();

	constructor(multiple?: Tmultiple) {
		this.multiple = multiple;
	}
}

const key = Symbol('SLC-RELATION-INPUT-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createRelationInputContext<Tmultiple extends boolean = false>(multiple?: Tmultiple) {
	return setContext(key, new RelationInputContext(multiple));
}
export function getRelationInputContext<Tmultiple extends boolean = false>() {
	const instance = getContext<RelationInputContext<Tmultiple>>(key);
	return instance;
}
// ################################## END Export Table Context ################################################################################################################################
