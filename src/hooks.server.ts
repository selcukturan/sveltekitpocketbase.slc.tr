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
			await auth.pb.collection('users').authRefresh();
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
	// Buradan sonra `event.locals.auth` ile işlem yapılabilir.

	// ⌛🍪 Set Cookie ################################################################################################################
	response.headers.append(
		'set-cookie',
		event.locals.auth.exportToCookie({ expires: auth.getCookieExpDate(event.locals.auth.token), httpOnly: true, secure: isProduction, sameSite: 'strict', priority: 'High' })
	);
	// 🏆 ###########################################################################################################################
	return response;
};
