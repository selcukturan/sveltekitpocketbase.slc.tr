import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { Auth } from '$lib/server/auth';
import env from '$lib/server/env';
import { Collections } from '$lib/client/types/pocketbase-types';

export const handle: Handle = async ({ event, resolve }) => {
	const isProduction = env.NODE_ENV === 'production';
	// 🚀 `auth.pb.authStore` ve `auth` aynı nesneyi işaret eder ####################################################################
	const auth = new Auth(event);
	// ⌛🔒 Token kontrolü ve yenileme ###############################################################################################
	if (auth.isValid) {
		try {
			await auth.pb.collection(Collections.Users).authRefresh();
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
		event.locals.auth.exportToCookie({
			expires: auth.getCookieExpDate(event.locals.auth.token),
			httpOnly: true,
			secure: isProduction,
			sameSite: 'lax',
			priority: 'High'
		})
	);
	// 🏆 ###########################################################################################################################
	return response;
};
