import { getContext as getContextAs, setContext as setContextAs } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

class TableContext {
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
export function setContext() {
	return setContextAs(key, new TableContext());
}
export function getContext() {
	return getContextAs<ReturnType<typeof setContext>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
