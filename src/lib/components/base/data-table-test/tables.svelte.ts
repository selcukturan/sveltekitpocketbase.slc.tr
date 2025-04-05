import { getContext, setContext } from 'svelte';

export class Table {
	src = $state('src-0');
	tbl = $state('tbl-0');

	constructor() {
		// kod
	}

	add() {
		// kod
	}

	remove() {
		// kod
	}
}

const TABLE_CTX = Symbol('TABLE_CTX');

export function setTable() {
	return setContext(TABLE_CTX, new Table());
}

export function getTable() {
	return getContext<ReturnType<typeof setTable>>(TABLE_CTX);
}
