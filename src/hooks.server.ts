import type { Handle } from '@sveltejs/kit';
import env from '$lib/server/env';
import { Collections } from '$lib/types/pocketbase-types';
import { createPocketBaseInstance } from '$lib/server/pb';

export const handle: Handle = async ({ event, resolve }) => {
	const isProduction = env.NODE_ENV === 'production';

	// 🚀 PB ve AuthStore örneği oluştur ##############################################################################################
	const { pb, auth } = createPocketBaseInstance(event);
	event.locals.pb = pb;
	event.locals.auth = auth;

	// ⌛🔒 Token kontrolü ve yenileme ################################################################################################
	try {
		event.locals.auth.isValid && (await event.locals.pb.collection(Collections.SysUsers).authRefresh());
	} catch (_) {
		event.locals.auth.clear();
	}
	event.locals.user = structuredClone(event.locals.auth.record);

	// 📡 before resolving the request ################################################################################################
	// 🔼 - istek sunucu tarafından işlenmeden önceki kodlar yukarıdadır.
	const response = await resolve(event);
	// 🔽 - istek sunucu tarafından işlendikten sonraki kodlar aşağıdadır.
	// 📡 after resolving the request #################################################################################################

	// ⌛🍪 Set Cookie ################################################################################################################
	response.headers.append(
		'set-cookie',
		event.locals.auth.exportToCookie({
			httpOnly: true,
			secure: isProduction,
			sameSite: 'strict', // lax | strict - strict olduğunda bazı tarayıcılarda sorun çıkabilir mi?
			priority: 'High'
		})
	);

	// 🏆 ############################################################################################################################
	return response;
};
