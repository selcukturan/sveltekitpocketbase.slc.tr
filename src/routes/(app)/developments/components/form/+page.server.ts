import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { myFirstFormSchema } from './schema';
import { Collections, type TestFormResponse } from '$lib/client/types/pocketbase-types';

export const load = async ({ locals }) => {
	console.log('form load function called');
	const myFirstFormInitialData = await locals.auth.pb.collection(Collections.TestForm).getOne<TestFormResponse>('30u6z6n70xxwinz');

	const myFirstForm = await superValidate(myFirstFormInitialData, valibot(myFirstFormSchema), { id: 'myFirstForm' });

	// Always return { form } in load functions
	return { myFirstForm };
};

export const actions = {
	default: async ({ request, locals }) => {
		const myFirstForm = await superValidate(request, valibot(myFirstFormSchema), { id: 'myFirstForm' });

		if (!myFirstForm.valid) {
			// Return { form } and things will just work.
			return fail(400, { myFirstForm });
		}

		// TODO: Do something with the validated form.data
		await locals.auth.pb.collection(Collections.TestForm).update<TestFormResponse>('30u6z6n70xxwinz', myFirstForm.data);

		// Return the form with a status message
		return message(myFirstForm, 'Form posted successfully!');
	}
};
