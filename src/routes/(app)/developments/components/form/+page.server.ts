import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { formSchema, type FormSchema } from './schema';
import { Collections, type TestFormResponse } from '$lib/client/types/pocketbase-types';

export const load = async ({ locals }) => {
	const formInitialData = await locals.auth.pb.collection(Collections.TestForm).getOne<TestFormResponse>('30u6z6n70xxwinz');

	const form = await superValidate(formInitialData, valibot(formSchema), { id: 'form22' });

	// Always return { form } in load functions
	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, valibot(formSchema), { id: 'form22' });

		if (!form.valid) {
			// Return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		await locals.auth.pb.collection(Collections.TestForm).update<TestFormResponse>('30u6z6n70xxwinz', form.data);

		// Return the form with a status message
		return message(form, 'Form posted successfully!');
	}
};
