import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { pbError } from '$lib/client/utils';
import { safeParse } from 'valibot';
import { formSchema, type FormSchema } from './schema';
import { extractFormData } from '$lib/client/utils';
import { Collections, type TestFormResponse } from '$lib/client/types/pocketbase-types';

export const load = (async ({ locals }) => {
	let formInitialData: FormSchema = { text_optional: 'glccccc', datetime_optional: '1989-04-21 21:18:00.000Z' }; // Default values for the form
	const dbResult = await locals.auth.pb.collection(Collections.TestForm).getOne<TestFormResponse>('30u6z6n70xxwinz');

	const { success, output } = safeParse(formSchema, dbResult);
	if (success) formInitialData = output;
	console.log(formInitialData);
	return {
		formInitialData
	};
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ locals, request }) => {
		const { data, error } = await extractFormData(request, formSchema);
		console.log('data', data);
		if (data != null) {
			// Valid Form
			try {
				const form = await locals.auth.pb.collection(Collections.TestForm).update<TestFormResponse>('30u6z6n70xxwinz', data);
				return { success: true, ...form };
			} catch (error) {
				const { status, errors } = pbError(error);
				return fail(status, { success: false, errors });
			}
		} else {
			// Invalid Form
			return fail(400, { success: false, error });
		}
	}
} satisfies Actions;
