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
import { tr } from '../../src/lib/app/localization/translations/tr.ts';
import { en } from '../../src/lib/app/localization/translations/en.ts';

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

test('yetki verisi: kaynaklar tutarlı, bağlantıların sayfası var, sayfalar ve işlemleri herkese açık (bugünkü davranış)', async () => {
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
		}
		// Herkes → kaynağın tanımlı her işlemi (1795740002: access, 1795740003: diğerleri). İstisna: yetki ekranında
		// değiştirme (update) yalnızca yönetici rollerinde (1795740004)
		for (const actionId of r.actions as string[]) {
			const actionKey = actions.find((a) => a.id === actionId)?.key;
			if (key === 'settings.system.permissions' && actionKey === 'update') {
				expect(
					permissions.some((p) => p.resource === r.id && p.action === actionId && !p.role && !p.user),
					'Herkes yetkileri değiştiremez'
				).toBe(false);
				continue;
			}
			const everyone = permissions.find((p) => p.resource === r.id && p.action === actionId && !p.role && !p.user);
			expect(everyone?.effect, `${key}: Herkes → ${actions.find((a) => a.id === actionId)?.key}`).toBe('allow');
		}
		// search_label label'dan üretilmiş (hook / tohum)
		expect(r.search_label).toBe(String(r.label).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ı/g, 'i'));
	}
	expect(resources.filter((r) => r.kind === 'feature').map((r) => r.key)).toEqual(expect.arrayContaining(['app.language']));

	// Menü: kökler ikonlu modül; başlık çevirisi 'menu.' + key (yoksa label gösterilir: başlangıç verisinde hepsi var)
	const menu = resources.filter((r) => r.kind !== 'feature');
	for (const r of menu) if (!r.parent) expect(r.icon, `${r.key}: modül ikonu`).toBeTruthy();
	const missing = (dict: Record<string, string>) => menu.map((r) => `menu.${r.key}`).filter((k) => !(k in dict));
	expect(missing(tr)).toEqual([]);
	expect(missing(en)).toEqual([]);
});

test('yetki verisi: normal kullanıcı okur ama yazamaz; oturumsuz hiçbir şey göremez', async () => {
	const token = await login();
	const res = await fetch(`${PB}/api/collections/acl_actions/records`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: token },
		body: JSON.stringify({ key: 'yetkisiz', label: 'Yetkisiz' })
	});
	// Yazabildiyse (ör. demo kullanıcıya yönetici rolü verilmişse) kayıt hemen silinir: veritabanında iz kalmasın
	if (res.ok) {
		const { id } = (await res.json()) as { id: string };
		await fetch(`${PB}/api/collections/acl_actions/records/${id}`, { method: 'DELETE', headers: { Authorization: token } });
	}
	expect(res.ok, 'demo kullanıcı yetki verisi yazamamalı (yönetici rolü verilmiş olabilir)').toBe(false);
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
