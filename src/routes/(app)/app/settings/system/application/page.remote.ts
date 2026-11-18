import { getRequestEvent, query, form, requested } from '$app/server';
import { Collections } from '#lib/types/pocketbase-types.js';
import { checkAuthenticated } from '#lib/remotes/guarded.remote.js';
import { ResultAsync } from 'neverthrow';
import { throwError, throwFormError, mapUnknownToError } from '#lib/server/error.js';
import { toPbPayload } from '#lib/utils/transform-params-helper.js';

import { settingsFormSchema } from './page.shared';

// Tek ayar kaydı; yoksa null (createRule kapalı olduğu için istemci oluşturamaz)
export const getSettings = query(async () => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	const result = await ResultAsync.fromPromise(locals.pb.collection(Collections.SysSettings).getList(1, 1, { sort: 'created' }), mapUnknownToError);

	if (result.isErr()) {
		throwError(result.error);
	}

	return result.value.items[0] ?? null;
});

export const updateSettings = form(settingsFormSchema, async (params) => {
	await checkAuthenticated(); // 🔒

	const { locals } = getRequestEvent();

	const result = await ResultAsync.fromPromise(locals.pb.collection(Collections.SysSettings).update(params.id, toPbPayload(params, ['id'])), mapUnknownToError);

	if (result.isErr()) {
		throwFormError(result.error, params);
	}

	await requested(getSettings, 1).refreshAll();

	return result.value;
});
