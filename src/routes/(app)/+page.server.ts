import type { PageServerLoad } from './$types';
import { PUBLIC_ENV_TEST } from '$env/static/public';

/* import db from '@/server/db/';
import { city } from '@/server/db/schemas/'; */

export const load: PageServerLoad = async ({ locals }) => {
	/* const cityx = await db.select().from(city); */

	/* if (!locals.user) redirect(302, "/login");
	return {
		username: locals.user.username
	}; */
	return {
		envTest: PUBLIC_ENV_TEST,
		user: locals.auth.user /* ,
		sqlResult: cityx */
	};
};
