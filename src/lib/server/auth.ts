import { redirect, type RequestEvent } from '@sveltejs/kit';
import PocketBase, { LocalAuthStore, type AuthRecord, type SerializeOptions, ClientResponseError, isTokenExpired, getTokenPayload } from 'pocketbase';
import env from '$lib/server/env';

export class Auth extends LocalAuthStore {
	// ##### read-only properties
	#storageKey = 'sessionCookieName';
	#user: AuthRecord = null;
	#pb: PocketBase;

	// ##### read-only properties getter
	get user() {
		return this.#user;
	}
	get pb() {
		return this.#pb;
	}

	// ##### POCKETBASE - `this.pb.authStore` ve `this` aynı nesneyi işaret eder
	constructor(event: RequestEvent, storageKey = 'sess') {
		super(storageKey);
		this.#storageKey = storageKey;
		this.#pb = new PocketBase(env.PB_BACKEND_URL, this, 'tr-TR');
		this.loadFromCookie(event.request.headers.get('cookie') || '');
	}

	// ##### PocketBase Auth Methods
	loadFromCookie(cookieHeader: string, key?: string): void {
		super.loadFromCookie(cookieHeader, key || this.#storageKey);
	}
	exportToCookie(options?: SerializeOptions, key?: string): string {
		return super.exportToCookie(options, key || this.#storageKey);
	}
	save(token: string, record?: AuthRecord) {
		// loadFromCookie, authWithPassword ve authRefresh'ten sonra otomatik calisir. class içinde onChange yerine kullanilabilir.
		super.save(token, record);
		if (record?.collectionName === 'acl_users') {
			this.#user = structuredClone(record);
		}
	}
	clear() {
		super.clear();
		this.#user = null;
	}
	isTokenExpired(token: string, expirationThreshold = 10) {
		// pocketbase tarafında ayarlanan token süresi 2 saat = 7200 saniyedir. Token options (invalidate, duration) -> Auth duration (in seconds)
		return isTokenExpired(token, expirationThreshold);
	}
	getTokenPayload(token: string) {
		return getTokenPayload(token);
	}

	// ##### SLC Auth Methods
	logout(goto = true) {
		this.clear();
		if (goto) {
			redirect(303, '/login');
		}
	}
	error(err: ClientResponseError, notify = true, defaultMsg = '') {
		if (!err || !(err instanceof ClientResponseError) || err.isAbort) return;

		const statusCode = err?.status << 0 || 400;
		const responseData = err?.data || {};
		const msg = responseData.message || err.message || defaultMsg;

		// add toast error notification
		if (notify && msg) {
			console.warn('SLC: auth.ts - add toast error notification | ', msg);
		}

		// populate form field errors
		/* if (!CommonHelper.isEmpty(responseData.data)) {
            setErrors(responseData.data);
        } */

		// unauthorized
		if (statusCode === 401) {
			console.warn('SLC: auth.ts - unauthorized');
			this.pb.cancelAllRequests();
			this.logout();
		}

		// forbidden
		if (statusCode === 403) {
			console.warn('SLC: auth.ts - forbidden');
			this.pb.cancelAllRequests();
			redirect(303, '/');
		}
	}
}
