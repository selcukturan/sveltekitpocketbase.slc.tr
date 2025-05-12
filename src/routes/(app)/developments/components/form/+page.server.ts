import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { schema /* , type Schema */ } from './schema';
import { ZodError } from 'zod';
import { Collections, type TestFormResponse } from '$lib/types/pocketbase-types';
/* import utils from '$lib/utils'; */

export const load = (async ({ locals }) => {
	const form = await locals.auth.pb.collection(Collections.TestForm).getOne<TestFormResponse>('30u6z6n70xxwinz');
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ locals, request }) => {
		try {
			// Valid Server FormData
			const formData = await request.formData();
			const updateData = schema.parse(formData);
			try {
				const form = await locals.auth.pb.collection(Collections.TestForm).update<TestFormResponse>('30u6z6n70xxwinz', updateData);
				return { success: true, ...form };
			} catch (error) {
				if (error instanceof ClientResponseError) {
					return fail(400, { updateData, error, missing: true });
				} else {
					return fail(400, { error, missing: true });
				}
			}
		} catch (error) {
			// Invalid Server FormData
			if (error instanceof ZodError) {
				let message = error.issues.map((issue) => `${issue.path[0]}: ${issue.message}`).join(', ');
				return fail(400, { message, error, missing: true });
			} else {
				return fail(400, { error, missing: true });
			}
		}
	}
} satisfies Actions;
