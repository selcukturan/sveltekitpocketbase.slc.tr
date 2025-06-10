import { redirect, type RequestEvent } from '@sveltejs/kit';
import PocketBase, { LocalAuthStore, type AuthRecord, type SerializeOptions, ClientResponseError, isTokenExpired, getTokenPayload } from 'pocketbase';
import env from '$lib/server/env';

/**
 * Oturum geçerlilik süresi kontrolü:(token üzerinden kontrol edilir. çerez üzerinden kontrol edilmez.)
 *
 * -Çerezin geçerlilik süresi kontrol edilmez. (Expires / Max -Age)
 * 		Bu, tarayıcıya (browser) yönelik bir talimattır.
 * 		Tarayıcıya "Bu çerezi şu tarihe kadar sakla ve her istekte bana geri gönder.
 * 		O tarih geçtiğinde ise bu çerezi sil ve bir daha gönderme." dersiniz.
 * 		Yani süresi dolmuş bir çerez, tarayıcı tarafından sunucuya hiç gönderilmez.
 * 		Dolayısıyla sunucunun bunu kontrol etme şansı veya gerekliliği yoktur. Bu iş tarayıcının sorumluluğundadır.
 * -Çerezin içindeki tokenın geçerlilik süresinin dolup dolmadığı kontrol edilir.
 * 		Aşağıdaki işlemler --her istekte(Request)-- `hooks.server.ts` içinde yapılır. Token geçerlilik süresi ile çerez geçerlilik süresi eşitlenmiş olur.
 *
 * 		1.aşama: `auth.isValid` ile Request çerezindeki tokenın geçerlilik süresi kontrol edilir.
 * 		2.aşama: `auth.isValid === true` ise `.authRefresh()` ile geçerlilik süresi yenilenmiş yeni bir token üretilir.
 * 		3.aşama: `.getCookieExpDate()` ile geçerlilik süresi yenilenmiş yeni bir token --dönen cevaba(Response)-- yazılır.
 *
 */

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

		this.#pb.beforeSend = (url, options) => {
			// 1. IP adresini bulmak için öncelik sırasına göre başlıkları kontrol et.
			const userIp =
				event.request.headers.get('cf-connecting-ip') ||
				event.request.headers.get('x-forwarded-for') ||
				event.request.headers.get('x-real-ip') ||
				null; // Hiçbiri bulunamazsa null yap.

			// 2. User-agent'ı al.
			const userAgent = event.request.headers.get('user-agent');

			// 3. Mevcut başlıkları koru ve yeni başlıkları eklemek için bir kopya oluştur.
			const newHeaders = { ...options.headers };

			// 4. SADECE geçerli bir IP bulunduysa başlığa ekle.
			if (userIp) {
				newHeaders['cf-connecting-ip'] = userIp; // PocketBase'in güvendiği başlık adını kullan
			}

			// 5. SADECE geçerli bir user-agent bulunduysa başlığa ekle.
			if (userAgent) {
				newHeaders['user-agent'] = userAgent;
			}

			// 6. Güncellenmiş seçeneklerle geri dön.
			return {
				url,
				options: {
					...options,
					headers: newHeaders
				}
			};
		};

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
		if (record?.collectionName === 'users') {
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
	getCookieExpDate(currentToken: string) {
		const payload = this.getTokenPayload(currentToken);
		if (!payload || typeof payload.exp !== 'number') {
			return undefined; // veya uygun bir hata yönetimi
		}
		const tokenExpInSecondsUTC = payload.exp;
		const tokenExpInMillisecondsUTC = tokenExpInSecondsUTC * 1000;
		const cookieExpiresDate = new Date(tokenExpInMillisecondsUTC); // Bu Date nesnesi UTC tabanlıdır

		// Ekstra kontrol: Oluşturulan tarihin geçerli olup olmadığını kontrol et
		if (isNaN(cookieExpiresDate.getTime())) {
			return undefined; // console.error("Invalid date created from token exp for cookie");
		}
		return cookieExpiresDate;

		// Örneğin
		// Cookie'nin son kullanma UTC saati: 02:55:19 UTC - (now UTC + 7200 saniye)
		// Sizin o anki (cookie'ye baktığınız anki) yerel saatiniz: 03:55 Europe/Istanbul. (now local)
		// Bu, o anki UTC saatinin 03:55 - 3 saat = 00:55 UTC olduğu anlamına gelir. (local now UTC)
		// 02:55 UTC - 00:55 UTC = Tam olarak 2 saat! 7200 saniyedir.
	}
	error(err: ClientResponseError, notify = true, defaultMsg = '') {
		if (!err || !(err instanceof ClientResponseError) || err.isAbort) return;

		const statusCode = err?.status << 0 || 400;
		const responseData = err?.data || {};
		const msg = responseData.message || err.message || defaultMsg;

		// add toast error notification
		if (notify && msg) {
			console.warn('SLC: auth.ts - add toast error notification |', msg);
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
