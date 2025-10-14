import { getRequestEvent, query, form } from '$app/server';
import * as v from 'valibot';
import { error } from '@sveltejs/kit';

import { Collections, type SysLogsResponse } from '$lib/client/types/pocketbase-types';
import type { MenuNode } from '$lib/client/types/my-pocketbase-types';

export const getTreeMenu = query(async () => {
	const { locals } = getRequestEvent();

	let treeMenu: MenuNode[] = [];

	try {
		const rawData = await locals.pb.collection(Collections.AclRolesMenusView).getFullList<MenuNode>({
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

	/* let test: any[] = [];
	try {
		const xxx = await locals.pb
			.collection('test_subtotal')
			.getFullList<MenuNode>();
		test = xxx;
	} catch (error) {
		console.error('Menü verileri çekilirken hata oluştu:', error);
	} */

	return treeMenu;
});

export const getLogs = query(async () => {
	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const { locals } = getRequestEvent();

	const logs = await locals.pb.collection(Collections.SysLogs).getFullList<SysLogsResponse>();

	await sleep(1000);

	if (Math.random() < 0.5) {
		throw new Error('Yapay bir hata oluştu.');
	}

	return logs;
});

export const getLog = query(v.string(), async (slug) => {
	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const { locals } = getRequestEvent();

	const log = await locals.pb.collection(Collections.SysLogs).getOne<SysLogsResponse>(slug);

	await sleep(1000);

	if (Math.random() < 0.5) {
		throw new Error('Yapay bir hata oluştu.');
	}

	return log;
});

export const createLog = form(
	v.object({
		title: v.pipe(v.string(), v.nonEmpty()),
		content: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ title, content }) => {
		// Check the user is logged in

		// Check the data is valid
		if (typeof title !== 'string' || typeof content !== 'string') {
			error(400, {
				message: 'Title and content are required',
				errorId: 'missing_fields'
			});
		}

		const slug = title.toLowerCase().replace(/ /g, '-');

		const { locals } = getRequestEvent();

		await locals.pb.collection(Collections.SysLogs).create<SysLogsResponse>({
			slug,
			title,
			content
		});

		// await getLogs().refresh(); // server single-flight mutations

		return { success: true };
	}
);
