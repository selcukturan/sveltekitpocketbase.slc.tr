import type { Handle, HandleServerError, HandleValidationError } from '@sveltejs/kit';
import { isHttpError, redirect } from '@sveltejs/kit';
import env from '$lib/server/env';
import { Collections } from '$lib/types/pocketbase-types';
import { createPocketBaseInstance } from '$lib/server/pb';

export const handle: Handle = async ({ event, resolve }) => {
	console.log(`${new Date().toISOString()} ----> hooks.server.ts | START | event.url.pathname:${event.url.pathname}`);
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

	// ⌛🔒 Rota koruma ###############################################################################################################
	if (event.isRemoteRequest) {
		console.log(`${new Date().toISOString()} ----> hooks.server.ts | request type: Remote Function`);
	} else {
		if (event.url.pathname.startsWith('/login')) {
			if (event.locals.user) redirect(303, '/');
		} else {
			if (!event.locals.user) redirect(303, '/login');
		}
		console.log(`${new Date().toISOString()} ----> hooks.server.ts | request type: Other [${event.url.pathname}]`);
	}

	console.log(`${new Date().toISOString()} ----> hooks.server.ts | before resolving the request`);
	// 📡 before resolving the request ################################################################################################
	// 🔼 - istek sunucu tarafından işlenmeden önceki kodlar yukarıdadır.
	const response = await resolve(event);
	// 🔽 - istek sunucu tarafından işlendikten sonraki kodlar aşağıdadır.
	// 📡 after resolving the request #################################################################################################
	console.log(`${new Date().toISOString()} ----> hooks.server.ts | after resolving the request`);
	// ⌛🍪 Set Cookie ################################################################################################################
	response.headers.append(
		'set-cookie',
		event.locals.auth.exportToCookie({
			httpOnly: true,
			secure: isProduction,
			sameSite: 'strict', // strict olduğunda bazı tarayıcılarda sorun çıkabilir. 'lax' | 'strict'
			priority: 'High'
		})
	);

	// Herkese açık, önbelleğe alınmasında sakınca olmayan yollar
	if (!['/login'].includes(event.url.pathname)) {
		response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	}
	console.log(`${new Date().toISOString()} ----> hooks.server.ts | END | event.url.pathname:${event.url.pathname}`);
	// 🏆 ############################################################################################################################
	return response;
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const myError = isHttpError(error) ? error : null;
	console.log('HandleServerError');
	return {
		type: myError?.body.type || 'general',
		errorId: myError?.body.errorId || '#SLC:HandleServerError',
		message: myError?.body.message || message
	};
};

export const handleValidationError: HandleValidationError = ({ event, issues }) => {
	console.log('HandleValidationError');
	return {
		type: 'general',
		errorId: '#SLC:HandleValidationError',
		message: 'Validation failed'
	};
};
