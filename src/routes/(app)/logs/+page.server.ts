import type { PageServerLoad } from './$types';
import { PUBLIC_ENV_TEST } from '$env/static/public';

export const load: PageServerLoad = async ({ request, locals }) => {
	const auth = locals.auth;
	const userRole = auth.user?.role || '';

	const collection = await auth.pb.collection('acl_roles_perms').getFullList({
		fields: `*,expand.perm.type`,
		expand: `perm`,
		filter: auth.pb.filter(`perm.type = 'system' && role = {:userRole} && created > '2025-03-14'`, { userRole }),
		sort: `-created,id`
	});

	const transformedData = collection.map((item) => {
		if (item.expand && item.expand.perm && item.expand.perm.type) {
			return {
				...item,
				permType: item.expand.perm.type
			};
		} else {
			return item; // Eğer expand.perm.type yoksa, orijinal nesneyi döndür
		}
	});

	return {
		envTest: PUBLIC_ENV_TEST,
		user: auth.user,
		collection,
		transformedData
	};
};
