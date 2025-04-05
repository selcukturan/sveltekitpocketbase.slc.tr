import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Auth } from '$lib/server/auth';
import env from '$lib/server/env';

export const handle: Handle = async ({ event, resolve }) => {
	const isProduction = env.NODE_ENV === 'production';
	// 🚀 `auth.pb.authStore` ve `auth` aynı nesneyi işaret eder ####################################################################
	const auth = new Auth(event);
	// ⌛🔒 Token kontrolü ve yenileme ###############################################################################################
	if (auth.isValid) {
		try {
			await auth.pb.collection('acl_users').authRefresh();
		} catch (err) {
			auth.clear();
		}
	} else {
		auth.clear();
	}
	// ⌛🔒 Rota koruma ###############################################################################################################
	if (event.url.pathname.startsWith('/login')) {
		if (auth.user) redirect(303, '/');
	} else {
		if (!auth.user) redirect(303, '/login');
	}
	// 📡 Set locals.auth ##########################################################################################################
	event.locals.auth = auth;

	// 🔼 - istek sunucu tarafından işlenmeden önceki kodlar yukarıdadır.
	const response = await resolve(event);
	// 🔽 - istek sunucu tarafından işlendikten sonraki kodlar aşağıdadır.

	// 📡 Get locals.auth ###########################################################################################################
	const currentToken = event.locals.auth.token || '';
	// ⌛ Cookie ayarları ###########################################################################################################
	const currentTokenExp = currentToken ? auth.getTokenPayload(currentToken).exp * 1000 : undefined;
	const utcOffset = new Date().getTimezoneOffset(); // UTC offset'i dakika cinsinden al (Türkiye-Europe/Istanbul için -180 dakika döner. 3 saat geride.)
	const utcOffsetMs = -utcOffset * 60 * 1000; // Dakikayı (-+) olarak tersine çevirip milisaniyeye çevir. (3 saat = 180 dakika = 10800000 milisaniye)
	const cookieExpDate = currentTokenExp ? new Date(currentTokenExp + utcOffsetMs) : undefined;
	// 🍪 Set Cookie ################################################################################################################
	response.headers.append('set-cookie', event.locals.auth.exportToCookie({ expires: cookieExpDate, httpOnly: true, secure: isProduction, sameSite: 'strict', priority: 'High' }));
	// 🏆 ###########################################################################################################################
	return response;
};
