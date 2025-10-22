import { getContext as getContextAs, setContext as setContextAs } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import type { Row } from './types';

class TableContext<TData extends Row> {
	#selectedRows = new SvelteSet<number>();
	get selectedRows() {
		return this.#selectedRows;
	}
	set selectedRows(v) {
		this.#selectedRows = v;
	}

	constructor() {
		// this.selectedRows = new SvelteSet<number>();
	}
}

const key = Symbol('SLC-DATATABLE-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function setContext<TData extends Row>() {
	return setContextAs(key, new TableContext<TData>());
}
export function getContext<TData extends Row>() {
	return getContextAs<ReturnType<typeof setContext<TData>>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
