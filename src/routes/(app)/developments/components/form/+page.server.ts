import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { schema, type Schema } from './schema';
import { Collections, type TestFormResponse } from '$lib/client/types/pocketbase-types';

import { zodError, pbError, formDataError } from '$lib/client/utils';

export const load = (async ({ locals }) => {
	const form = await locals.auth.pb.collection(Collections.TestForm).getOne<TestFormResponse>('30u6z6n70xxwinz');
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ locals, request }) => {
		let formData: FormData;

		try {
			// 1. FormData
			formData = await request.formData();
			try {
				// 2. Valid FormData
				const updateData = schema.parse(formData);
				try {
					// 3. PB Run
					const form = await locals.auth.pb.collection(Collections.TestForm).update<TestFormResponse>('30u6z6n70xxwinz', updateData);
					return { success: true, ...form };
				} catch (error) {
					// 3. PB error
					const { status, errors } = pbError(error);
					return fail(status, { success: false, errors });
				}
			} catch (error) {
				// 2. Valid error
				const { status, errors } = zodError(error);
				return fail(status, { success: false, errors });
			}
		} catch (error) {
			// 1. FormData error
			const { status, errors } = formDataError(error);
			return fail(status, { success: false, errors });
		}
	}
} satisfies Actions;
