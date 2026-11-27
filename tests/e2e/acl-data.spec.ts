import { test, expect } from '@playwright/test';
import { pageExists, listPages } from './helpers/routes.ts';
import {
	resolvePermissions,
	findPageResource,
	canAccessPage,
	buildAccessMenu,
	type AclResource,
	type AclPermission,
	type AclAction
} from '../../src/lib/app/acl/access.ts';
import { MENU_RECORDS } from '../../src/lib/app/menu/menu.ts';

// Yetki verisi (acl_*): PocketBase'den demo kullanıcının oturumuyla okunur (geliştirme veritabanı).
const PB = process.env.PB_TEST_URL ?? 'http://localhost:8099';

type Item = Record<string, unknown> & { id: string };
async function login() {
	return (await loginWithRecord()).token;
}
async function loginWithRecord() {
	const res = await fetch(`${PB}/api/collections/sys_users/auth-with-password?expand=role`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ identity: 'demo@slc.tr', password: 'SLc1234567' })
	});
	expect(res.ok).toBe(true);
	return (await res.json()) as { token: string; record: Item & { expand?: { role?: Item[] } } };
}
async function all(token: string, collection: string): Promise<Item[]> {
	const res = await fetch(`${PB}/api/collections/${collection}/records?perPage=500`, { headers: { Authorization: token } });
	expect(res.ok).toBe(true);
	return ((await res.json()) as { items: Item[] }).items;
}

test('yetki verisi: kaynaklar tutarlı, bağlantıların sayfası var, sayfalar herkese açık (bugünkü davranış)', async () => {
	const token = await login();
	const [actions, resources, permissions] = await Promise.all([all(token, 'acl_actions'), all(token, 'acl_resources'), all(token, 'acl_permissions')]);
	const access = actions.find((a) => a.key === 'access');
	expect(access).toBeTruthy();

	const byId = new Map(resources.map((r) => [r.id, r]));
	for (const r of resources) {
		const key = String(r.key);
		if (r.parent) expect(byId.has(String(r.parent)), `${key}: üst kayıt`).toBe(true);
		if (r.kind === 'group') expect(r.href, `${key}: grubun href'i olmaz`).toBe('');
		if (r.href) {
			expect(pageExists(String(r.href)), `${key}: ${r.href} sayfası`).toBe(true);
			expect(r.actions as string[], `${key}: access işlemi`).toContain(access!.id);
			const everyone = permissions.find((p) => p.resource === r.id && p.action === access!.id && !p.role && !p.user);
			expect(everyone?.effect, `${key}: Herkes → access`).toBe('allow');
		}
		// search_label label'dan üretilmiş (hook / tohum)
		expect(r.search_label).toBe(String(r.label).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ı/g, 'i'));
	}
	expect(resources.filter((r) => r.kind === 'feature').map((r) => r.key)).toEqual(expect.arrayContaining(['app.language']));

	// Geçiş dönemi: menu.ts (şu an menüyü çizen) ile veritabanındaki kaynaklar aynı sayfaları içeriyor
	const dbHrefs = new Set(resources.filter((r) => r.href).map((r) => String(r.href)));
	const menuHrefs = new Set(MENU_RECORDS.filter((r) => r.href).map((r) => r.href!));
	expect([...dbHrefs].sort()).toEqual([...menuHrefs].sort());
});

test('yetki verisi: normal kullanıcı okur ama yazamaz; oturumsuz hiçbir şey göremez', async () => {
	const token = await login();
	const res = await fetch(`${PB}/api/collections/acl_actions/records`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: token },
		body: JSON.stringify({ key: 'yetkisiz', label: 'Yetkisiz' })
	});
	expect(res.ok).toBe(false);
	const anonymous = await fetch(`${PB}/api/collections/acl_resources/records`);
	expect(((await anonymous.json()) as { totalItems: number }).totalItems).toBe(0);
});

test('gerçek veri: (app) altındaki her sayfa bir kaynakla eşleşir (sıkı koruma); demo kullanıcı hepsine erişir, menüsü tam', async () => {
	const { token, record } = await loginWithRecord();
	const [actions, resources, permissions] = await Promise.all([all(token, 'acl_actions'), all(token, 'acl_resources'), all(token, 'acl_permissions')]);
	const roles = (record.expand?.role ?? []).map((r) => ({ id: r.id, type: String(r.type), status: String(r.status) }));
	expect(roles.length).toBeGreaterThan(0);

	const access = resolvePermissions({
		subject: { id: record.id, roles },
		actions: actions as unknown as AclAction[],
		resources: resources as unknown as AclResource[],
		permissions: permissions as unknown as AclPermission[]
	});
	const pages = listPages('src/routes/(app)');
	expect(pages.length).toBeGreaterThan(20);
	for (const path of pages) {
		expect(findPageResource(resources as unknown as AclResource[], path), `${path}: kaynak yok`).toBeTruthy();
		expect(canAccessPage(resources as unknown as AclResource[], access, path), `${path}: erişim`).toBe(true);
	}
	// Bugünkü menü: altı modül, hiçbiri budanmamış
	expect(buildAccessMenu(resources as unknown as AclResource[], access).map((n) => n.id)).toEqual(['home', 'grapes', 'data_table', 'logs', 'developments', 'settings']);
});
