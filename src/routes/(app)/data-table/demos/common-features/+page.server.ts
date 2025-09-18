import type { PageServerLoad } from './$types';
import {
	Collections,
	type TestSubtotalViewResponse
} from '$lib/client/types/pocketbase-types';

export const load = (async ({ locals }) => {
	const resultList = await locals.auth.pb
		.collection(Collections.TestSubtotalView)
		.getList<TestSubtotalViewResponse>(1, 1000, {
			sort: 'subtotal'
		});

	console.log(resultList);

	return {
		user: locals.auth.user,
		resultList
	};
}) satisfies PageServerLoad;
