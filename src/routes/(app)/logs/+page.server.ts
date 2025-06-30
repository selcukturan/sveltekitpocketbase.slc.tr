import type { PageServerLoad } from './$types';
import { PUBLIC_ENV_TEST } from '$env/static/public';

export const load: PageServerLoad = async ({ request, locals }) => {
	const auth = locals.auth;
	const userRole = auth.user?.role || '';

	/* const collection = await auth.pb.collection('acl_roles_perms').getFullList({
		fields: `*,expand.perm.type`,
		expand: `perm`,
		filter: auth.pb.filter(`perm.type = 'system' && role = {:userRole} && created > '2025-03-14'`, { userRole }),
		sort: `-created,id`
	}); */

	const acl_roles_perms_menu = await locals.auth.pb.collection('acl_roles_perms_menu').getFullList({
		expand: `perm,role,perm.parent_id`,
		filter: auth.pb.filter(`role.status = "active" && perm.status = "active" && status = "active" && role = {:userRole}`, { userRole })
	});

	/* const transformedData = collection.map((item) => {
		if (item.expand && item.expand.perm && item.expand.perm.type) {
			return {
				...item,
				permType: item.expand.perm.type
			};
		} else {
			return item; // Eğer expand.perm.type yoksa, orijinal nesneyi döndür
		}
	}); */

	return {
		envTest: PUBLIC_ENV_TEST,
		user: auth.user,
		acl_roles_perms_menu
	};
};
