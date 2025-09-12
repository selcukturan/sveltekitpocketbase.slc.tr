import type { PageServerLoad } from './$types';
import { PUBLIC_ENV_TEST } from '$env/static/public';

/* import db from '@/server/db/';
import { city } from '@/server/db/schemas/'; */

export const load: PageServerLoad = async ({ locals }) => {
	const userRole = locals.auth.user?.role || '';
	const acl_roles_menus: any[] = await locals.auth.pb
		.collection('acl_roles_menus')
		.getFullList({
			expand: `menu,role,menu.parent_id`,
			filter: `role.status = "active" && menu.status = "active" && status = "active" && role = "${userRole}"`
		});
	const acl_roles_companys: any[] = await locals.auth.pb
		.collection('acl_roles_companys')
		.getFullList({
			expand: `perm,role,perm.parent_id`,
			filter: `role.status = "active" && perm.status = "active" && status = "active" && role = "${userRole}"`
		});
	const acl_roles_app_regions: any[] = await locals.auth.pb
		.collection('acl_roles_app_regions')
		.getFullList({
			expand: `perm,role,perm.parent_id`,
			filter: `role.status = "active" && perm.status = "active" && status = "active" && role = "${userRole}"`
		});
	const sys_logs = await locals.auth.pb.collection('sys_logs').getFullList();

	/* if (!locals.user) redirect(302, "/login");
	return {
		username: locals.user.username
	}; */

	return {
		acl_roles_menus,
		acl_roles_companys,
		acl_roles_app_regions,
		sys_logs,
		envTest: PUBLIC_ENV_TEST,
		user: locals.auth.user
	};
};
