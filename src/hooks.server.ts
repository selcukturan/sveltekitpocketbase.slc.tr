import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import env from '$lib/server/env';
import { Collections } from '$lib/types/pocketbase-types';
import { createInstance } from '$lib/server/pb';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('hooks.server.ts');
	const isProduction = env.NODE_ENV === 'production';

	// 🚀 PB ve AuthStore örneği oluştur ##############################################################################################
	const { pb, auth } = createInstance(event);
	event.locals.pb = pb;
	event.locals.auth = auth;

	// ⌛🔒 Token kontrolü ve yenileme ################################################################################################
	try {
		event.locals.auth.isValid && (await event.locals.pb.collection(Collections.SysUsers).authRefresh());
	} catch (_) {
		event.locals.auth.clear();
	}
	event.locals.user = structuredClone(event.locals.auth.record);

	// ⌛🔒 Rota koruma ###############################################################################################################
	if (event.url.pathname.startsWith('/login')) {
		if (event.locals.user) redirect(303, '/');
	} else {
		if (!event.locals.user) redirect(303, '/login');
	}

	// 📡 before resolving the request ################################################################################################
	// 🔼 - istek sunucu tarafından işlenmeden önceki kodlar yukarıdadır.
	const response = await resolve(event);
	// 🔽 - istek sunucu tarafından işlendikten sonraki kodlar aşağıdadır.
	// 📡 after resolving the request #################################################################################################

	// ⌛🍪 Set Cookie ################################################################################################################
	response.headers.append(
		'set-cookie',
		event.locals.auth.exportToCookie({
			/* expires: event.locals.auth.getCookieExpDate(event.locals.auth.token), */
			httpOnly: true,
			secure: isProduction,
			sameSite: 'lax',
			priority: 'High'
		})
	);

	// 🏆 ############################################################################################################################
	return response;
};
