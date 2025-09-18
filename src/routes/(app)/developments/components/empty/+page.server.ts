import type { PageServerLoad } from './$types';

import { Collections } from '$lib/client/types/pocketbase-types';
import type { MenuNode } from '$lib/client/types/my-pocketbase-types';

export const load = (async ({ locals }) => {
	let treeMenu: MenuNode[] = [];

	try {
		const rawData = await locals.auth.pb
			.collection(Collections.AclRolesMenusView)
			.getFullList<MenuNode>({
				filter: `status_acl_roles = "active" && 
					status_acl_roles_menus = "active" && 
					status_sys_menu_items = "active" && 
					status_sys_menus = "active" && 
					valid_permissions ~ ":view:"`,
				sort: 'sorder'
			});
		treeMenu = rawData;
	} catch (error) {
		console.error('Menü verileri çekilirken hata oluştu:', error);
	}

	let test: any[] = [];
	try {
		const xxx = await locals.auth.pb
			.collection('test_subtotal')
			.getFullList<MenuNode>();
		test = xxx;
	} catch (error) {
		console.error('Menü verileri çekilirken hata oluştu:', error);
	}

	return {
		user: locals.auth.user,
		treeMenu,
		test
	};
}) satisfies PageServerLoad;
