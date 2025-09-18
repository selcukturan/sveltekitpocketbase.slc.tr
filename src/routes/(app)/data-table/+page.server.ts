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

	/* const records = await locals.auth.pb
		.collection(Collections.TestDatatable)
		.getFullList<TestDatatableResponse>({
			sort: 'order'
		}); */

	const records: TestDatatableResponse[] = [];

	return {
		user: locals.auth.user,
		records,
		resultList
	};
}) satisfies PageServerLoad;
