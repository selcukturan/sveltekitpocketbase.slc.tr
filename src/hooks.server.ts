import type { Handle, HandleServerError, HandleValidationError } from '@sveltejs/kit';
import { isHttpError } from '@sveltejs/kit';
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
			sameSite: 'strict', // strict olduğunda bazı tarayıcılarda sorun çıkabilir. 'lax' | 'strict'. safaride düzeldi. kullanılabilir.
			priority: 'High'
		})
	);

	// 🏆 ############################################################################################################################
	return response;
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	const myError = isHttpError(error) ? error : null;

	const type = myError?.body.type || 'general';
	const errorId = myError?.body.errorId || '#SLC:HandleServerError';
	const msg = myError?.body.message || message;

	console.log('HandleServerError', type, errorId, msg, error);
	return {
		type,
		errorId,
		message: msg
	};
};

export const handleValidationError: HandleValidationError = ({ event, issues }) => {
	const myError = issues[0];

	console.log('HandleValidationError', issues);

	return {
		type: 'general',
		errorId: '#SLC:HandleValidationError',
		message: myError.message
	};
};
