import type { TypedPocketBase } from '$lib/types/pocketbase-types';
import { type RequestEvent } from '@sveltejs/kit';

import env from '$lib/server/env';
import PocketBase, { LocalAuthStore, type AuthRecord, type SerializeOptions, ClientResponseError } from 'pocketbase';

export class CustomAuthStore extends LocalAuthStore {
	#pb: TypedPocketBase | undefined;

	// Dependency Injection: Oluşturulan PB örneğini sınıfa tanıtma metodu
	init(pbInstance: TypedPocketBase) {
		this.#pb = pbInstance;
	}

	// Sınıf içinden PB örneğine erişmek için güvenli bir getter
	private get pb() {
		if (!this.#pb) throw new Error('PocketBase instance not initialized in AuthStore');
		return this.#pb;
	}

	// ##### PocketBase Auth Methods
	clear() {
		super.clear();
	}
	save(token: string, record?: AuthRecord) {
		super.save(token, record);
	}
	loadFromCookie(cookieHeader: string, key?: string): void {
		super.loadFromCookie(cookieHeader, key || 'sess');
	}
	exportToCookie(options?: SerializeOptions, key?: string): string {
		return super.exportToCookie(options, key || 'sess');
	}

	// ##### SLC Auth Methods
	/* logout(goto = true) {
		this.clear();
		if (goto) {
			return redirect(303, '/login');
		}
	} */
	error(err: ClientResponseError, notify = true, defaultMsg = '') {
		if (!err || !(err instanceof ClientResponseError) || err.isAbort) return;

		const statusCode = err?.status << 0 || 400;
		const responseData = err?.data || {};
		const msg = responseData.message || err.message || defaultMsg;

		// add toast error notification
		if (notify && msg) {
			console.warn('SLC: pb.ts - add toast error notification |', msg);
		}

		// populate form field errors
		/* if (!CommonHelper.isEmpty(responseData.data)) {
            setErrors(responseData.data);
        } */

		// unauthorized
		if (statusCode === 401) {
			console.warn('SLC: pb.ts - unauthorized');
			this.pb.cancelAllRequests();
			// this.logout();
		}

		// forbidden
		if (statusCode === 403) {
			console.warn('SLC: auth.pb - forbidden');
			this.pb.cancelAllRequests();
			// redirect(303, '/');
		}
	}
}

// Fabrika Fonksiyonu (Tüm kurulumu yöneten yer)
export function createPocketBaseInstance(event: RequestEvent): { pb: TypedPocketBase; auth: CustomAuthStore } {
	const auth = new CustomAuthStore();

	auth.loadFromCookie(event.request.headers.get('cookie') || '');

	const pb = new PocketBase(env.PB_BACKEND_URL, auth, 'tr-TR') as TypedPocketBase;

	// Store sınıfı içinde 'this.pb' kullanılabilir hale gelir.
	auth.init(pb);

	pb.beforeSend = (url, options) => {
		const userIp =
			event.request.headers.get('cf-connecting-ip') ||
			event.request.headers.get('x-forwarded-for') ||
			event.request.headers.get('x-real-ip') ||
			null;

		const userAgent = event.request.headers.get('user-agent');
		const newHeaders = { ...options.headers };

		if (userIp) newHeaders['cf-connecting-ip'] = userIp;
		if (userAgent) newHeaders['user-agent'] = userAgent;

		return { url, options: { ...options, headers: newHeaders } };
	};

	return { pb, auth };
}
