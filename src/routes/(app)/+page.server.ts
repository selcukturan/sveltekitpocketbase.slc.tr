import type { PageServerLoad } from './$types';
import { PUBLIC_ENV_TEST } from '$env/static/public';

/* import db from '@/server/db/';
import { city } from '@/server/db/schemas/'; */

export const load: PageServerLoad = async ({ locals }) => {
	/* const cityx = await db.select().from(city); */
	const userID = locals.auth.user?.id || '';
	const userRole = locals.auth.user?.role || '';
	const acl_roles_perms_menu = await locals.auth.pb.collection('acl_roles_perms_menu').getFullList({
		expand: `perm,role,perm.parent_id`,
		filter: `role.status = "active" && perm.status = "active" && status = "active" && role = "${userRole}"`
	});
	const acl_roles_perms_company = await locals.auth.pb.collection('acl_roles_perms_company').getFullList({
		expand: `perm,role,perm.parent_id`,
		filter: `role.status = "active" && perm.status = "active" && status = "active" && role = "${userRole}"`
	});
	const acl_roles_perms_region = await locals.auth.pb.collection('acl_roles_perms_region').getFullList({
		expand: `perm,role,perm.parent_id`,
		filter: `role.status = "active" && perm.status = "active" && status = "active" && role = "${userRole}"`
	});

	/* if (!locals.user) redirect(302, "/login");
	return {
		username: locals.user.username
	}; */
	return {
		acl_roles_perms_menu,
		acl_roles_perms_company,
		acl_roles_perms_region,
		envTest: PUBLIC_ENV_TEST,
		user: locals.auth.user
	};
};
