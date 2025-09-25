import { goto } from '$app/navigation';

export class Navigator {
	#currentHash = '';
	private get currentHash() {
		return this.#currentHash;
	}
	private set currentHash(v) {
		this.#currentHash = v;
	}

	#currentObject = {
		dataGetterTrigger: {
			filter: [{ field: 'producer', operator: '!=', value: '' }],
			sort: ['-created'],
			page: -1,
			perPage: -1,
			skipTotal: false
		},
		pageActionTrigger: {
			recordId: 'v5mi1csejcv2s0o',
			cmd: 'run'
		}
	};
	private get currentObject() {
		return this.#currentObject;
	}
	private set currentObject(v) {
		this.#currentObject = v;
	}
	/* 
{
"lhs": {
	"op": "neq",
	"field": "status",
	"value": "active"
},
"op": "and",
"rhs": {
	"op": "eq",
	"field": "x1",
	"value": 4
}
} 
*/

	/**
	 * and() = ve
	 * or() = veya
	 *
	 * eq() = eşittir
	 * neq() = eşit değildir
	 * lt() = küçüktür
	 * lte() = küçük eşittir
	 * gt() = büyüktür
	 * gte() = büyük eşittir
	 * in() = içinde
	 * nin() = içinde değil
	 * like() = benzer
	 */

	constructor(initialHash: string) {
		this.currentHash = initialHash;
	}

	dataGetterTrigger(hash: string) {
		this.currentHash = hash;
		return hash;
	}

	goto(url: string) {
		if (this.currentHash.replace('#', '') !== url) {
			goto(`#${url}`);
		}
	}
}

/* type Router = {
	getDataTrigger: {
		filter: { field: string; operator: string; value: unknown }[];
		sort: string[];
		page: number;
		perPage: number;
		skipTotal: boolean;
	};
	actionTrigger: { recordId: string; cmd: string };
};

const routerxx: Router = {
	dataGetterTrigger: {
		filter: [{ field: 'producer', operator: '!=', value: '' }],
		sort: ['-created'],
		page: 1,
		perPage: 10,
		skipTotal: false
	},
	pageActionTrigger: {
		recordId: 'v5mi1csejcv2s0o',
		cmd: 'run'
	}
}; */
