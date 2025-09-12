import type { PageServerLoad } from './$types';

import {
	Collections,
	type AclRolesMenusResponse
} from '$lib/client/types/pocketbase-types';
import type { MenuNode } from '$lib/client/types/my-pocketbase-types';

export const load = (async ({ locals }) => {
	let treeMenu: MenuNode[] = [];

	try {
		const rawData = await locals.auth.pb
			.collection(Collections.SysMenus)
			.getFullList<MenuNode>({
				fields: `*, expand.sys_menu_item.status, expand.sys_menu_item.available_permissions, expand.sys_menu_item.url`,
				expand: 'sys_menu_item',
				filter:
					'status = "active" && sys_menu_item.status = "active" && sys_menu_item.available_permissions ~ "view"',
				sort: 'sorder'
			});

		treeMenu = rawData;
	} catch (error) {
		console.error('Menü verileri çekilirken hata oluştu:', error);
	}

	let treeMenuUser: AclRolesMenusResponse[] = [];
	const userRole = locals.auth.user?.role || '';
	try {
		const rawData = await locals.auth.pb
			.collection(Collections.AclRolesMenus)
			.getFullList<AclRolesMenusResponse>({
				expand: `menu, role, menu.parent_id, menu.sys_menu_item`,
				filter: `role = "${userRole}" &&
                    status = "active" &&
                    role.status = "active" &&
                    menu.status = "active" &&
                    menu.sys_menu_item.status = "active" &&
                    valid_permissions ~ ":view:"`
			});

		treeMenuUser = rawData;
	} catch (error) {
		console.error('Menü verileri çekilirken hata oluştu:', error);
	}

	let treeMenuUserView: any[] = [];
	try {
		const rawData = await locals.auth.pb
			.collection(Collections.AclRolesMenusView)
			.getFullList({
				// expand: `id_sys_menus, id_sys_menu_item, id_sys_menus_parent, id_role`,
				filter: `valid_permissions ~ ":view:"`,
				sort: 'sorder'
			});

		treeMenuUserView = rawData;
	} catch (error) {
		console.error('Menü verileri çekilirken hata oluştu:', error);
	}

	let xxxx: any[] = [];
	try {
		const rawData = await locals.auth.pb
			.collection('sys_settings')
			.getFullList();

		xxxx = rawData;
	} catch (error) {
		console.error('Menü verileri çekilirken hata oluştu:', error);
	}
	return {
		user: locals.auth.user,
		treeMenu,
		treeMenuUser,
		treeMenuUserView,
		xxxx
	};
}) satisfies PageServerLoad;
