import type { PageServerLoad } from './$types';
import {
	Collections,
	type TestDatatableResponse
} from '$lib/client/types/pocketbase-types';

export const load = (async ({ locals }) => {
	const resultList = await locals.auth.pb
		.collection(Collections.TestDatatable)
		.getList<TestDatatableResponse>(1, 1000, {
			sort: 'order'
		});

	console.log(resultList);

	return {
		user: locals.auth.user,
		resultList
	};
}) satisfies PageServerLoad;
