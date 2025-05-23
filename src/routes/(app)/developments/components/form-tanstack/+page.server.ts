import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { pbError } from '$lib/client/utils';
import { safeParse } from 'valibot';
import { formSchema } from './schema';
import { extractFormData } from '$lib/client/utils';
import { Collections, type TestFormResponse } from '$lib/client/types/pocketbase-types';

export const load = (async ({ locals }) => {
	let formInitialData = {};
	const dbResult = await locals.auth.pb.collection(Collections.TestForm).getOne<TestFormResponse>('30u6z6n70xxwinz');
	const { success, output } = safeParse(formSchema, dbResult);
	if (success) formInitialData = output;

	return {
		formInitialData
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ locals, request }) => {
		const { data, error } = await extractFormData(request, formSchema);

		if (data != null) {
			try {
				const form = await locals.auth.pb.collection(Collections.TestForm).update<TestFormResponse>('30u6z6n70xxwinz', data);
				return { success: true, ...form };
			} catch (error) {
				const { status, errors } = pbError(error);
				return fail(status, { success: false, errors });
			}
		} else {
			return fail(400, { success: false, error });
		}
	}
} satisfies Actions;
