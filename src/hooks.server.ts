import type { Handle } from '@sveltejs/kit/hooks';
import '#lib/server/eventSource.js'; // required for notifications remote and nodejs pocketbase subscribe SSE
import { NODE_ENV } from '$app/env/private';
import { Collections } from '#lib/types/pocketbase-types.js';
import { createPocketBaseInstance } from '#lib/server/pb.js';

export const handle: Handle = async ({ event, resolve }) => {
	console.log(new Date().getTime() + ' - hook.server.ts - ' + event.request.url + ' - NODE_ENV:' + NODE_ENV);
	const isProduction = NODE_ENV === 'production';

	// 🚀 PB ve AuthStore örneği oluştur ##############################################################################################
	const { pb, auth } = createPocketBaseInstance(event);
	event.locals.pb = pb;
	event.locals.auth = auth;

	// ⌛🔒 Token kontrolü ve yenileme ################################################################################################
	try {
		if (event.locals.auth.isValid) {
			await event.locals.pb.collection(Collections.SysUsers).authRefresh();
		} else {
			event.locals.auth.clear();
		}
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
			sameSite: 'lax', // lax | strict - strict olduğunda bazı tarayıcılarda sorun çıkabilir mi?
			priority: 'high'
		})
	);

	// 🏆 ############################################################################################################################
	return response;
};
