import { test, expect } from '@playwright/test';
import {
	resolvePermissions,
	can,
	findPageResource,
	canAccessPage,
	buildAccessMenu,
	resourceTrail,
	type AclResource,
	type AclPermission,
	type AclRole
} from '../../src/lib/app/acl/access.ts';
import { firstHref, pruneTree, buildTree } from '../../src/lib/app/menu/tree.ts';

// app/acl/access.ts (saf): tarayıcı açılmaz.
const actions = ['access', 'list', 'update', 'export'].map((key) => ({ id: `a_${key}`, key }));
const A = (key: string) => `a_${key}`;

const res = (key: string, over: Partial<AclResource> = {}): AclResource => ({
	id: `r_${key}`,
	key,
	label: key.toUpperCase(),
	kind: 'page',
	parent: '',
	icon: '',
	href: '',
	match: 'exact',
	sort: 0,
	active: true,
	hidden: false,
	actions: [A('access')],
	...over
});
const resources: AclResource[] = [
	res('mod', { kind: 'module', icon: 'grape', sort: 10, actions: [] }),
	res('grp', { kind: 'group', parent: 'r_mod', sort: 20, actions: [] }),
	res('a', { parent: 'r_grp', href: '/app/a', sort: 10, actions: [A('access'), A('list'), A('update'), A('export')] }),
	res('b', { parent: 'r_mod', href: '/app/b', sort: 10 }),
	res('c', { parent: 'r_grp', href: '/app/c', match: 'prefix', sort: 20 }),
	res('hidden', { parent: 'r_mod', href: '/app/hidden', hidden: true }),
	res('off', { parent: 'r_mod', href: '/app/off', active: false }),
	res('f', { kind: 'feature' })
];

const editor: AclRole = { id: 'editor', type: 'user', status: 'active' };
const viewer: AclRole = { id: 'viewer', type: 'user', status: 'active' };
const retired: AclRole = { id: 'retired', type: 'user', status: 'passive' };
const developer: AclRole = { id: 'dev', type: 'developer', status: 'active' };

const perm = (resource: string, action: string, effect: 'allow' | 'deny', subject: { role?: string; user?: string } = {}): AclPermission => ({
	resource: `r_${resource}`,
	action: A(action),
	role: subject.role ?? '',
	user: subject.user ?? '',
	effect
});
const permissions: AclPermission[] = [
	perm('b', 'access', 'allow'), // Herkes
	perm('c', 'access', 'allow'),
	perm('hidden', 'access', 'allow'),
	perm('off', 'access', 'allow'),
	perm('f', 'access', 'allow'),
	perm('a', 'access', 'allow', { role: 'editor' }),
	perm('a', 'list', 'allow', { role: 'editor' }),
	perm('a', 'update', 'allow', { role: 'editor' }),
	perm('a', 'list', 'deny', { role: 'viewer' }), // rol deny'ı yok sayılır
	perm('a', 'export', 'allow', { role: 'retired' }), // pasif rol
	perm('a', 'update', 'deny', { user: 'ayse' }), // kişisel engel rolü ezer
	perm('a', 'export', 'allow', { user: 'ayse' }), // kişisel izin ekler
	perm('b', 'access', 'deny', { user: 'mehmet' }), // kişisel engel Herkes'i ezer
	perm('a', 'list', 'allow', { user: 'zeynep' }), // access olmadan list işlemez
	perm('f', 'list', 'allow') // kaynakta tanımlı olmayan işlem yok sayılır
];

const resolve = (id: string, roles: AclRole[]) => resolvePermissions({ subject: { id, roles }, actions, resources, permissions });

test('izin hesabı: rol birleşimi, kişisel satır rolü ezer, Herkes, varsayılan kapalı', () => {
	const ayse = resolve('ayse', [editor, retired]);
	expect(ayse['a']).toEqual(['access', 'list', 'export']); // update kişisel deny, export kişisel allow; pasif rolün export'u yok
	expect(can(ayse, 'b')).toBe(true); // Herkes

	const ali = resolve('ali', [editor, viewer]);
	expect(ali['a']).toEqual(['access', 'list', 'update']); // viewer'ın deny'ı rolde yok sayılır

	const guest = resolve('guest', []);
	expect(guest['a']).toBeUndefined(); // hiçbir satır yok: kapalı
	expect(Object.keys(guest).sort()).toEqual(['b', 'c', 'f', 'hidden']); // pasif kaynak (off) yok

	expect(can(resolve('mehmet', [editor]), 'b')).toBe(false); // kişisel deny Herkes'i ezer
	expect(resolve('zeynep', [])['a']).toBeUndefined(); // access yoksa list de yok
	expect(resolve('guest', [])['f']).toEqual(['access']); // tanımsız işlem (list) eklenmez
	expect(can(ayse, 'a', 'update')).toBe(false);
	expect(can(ayse, 'yok')).toBe(false);
});

test('izin hesabı: developer/system rolü her şeye izinli (yalnızca aktif kaynaklar, tanımlı işlemler); pasifse değil', () => {
	const dev = resolve('dev-user', [developer]);
	expect(dev['a']).toEqual(['access', 'list', 'update', 'export']);
	expect(dev['off']).toBeUndefined();
	expect(dev['mod']).toBeUndefined(); // başlıkların işlemi yok (görünürlük alttaki sayfalardan)
	expect(resolve('x', [{ ...developer, status: 'passive' }])['a']).toBeUndefined();
});

test('sayfa eşleştirme: birebir, sondaki /, prefix ile alt adresler; eşleşmeyen ve pasif sayfa yok', () => {
	const key = (path: string) => findPageResource(resources, path)?.key;
	expect(key('/app/a')).toBe('a');
	expect(key('/app/a/')).toBe('a');
	expect(key('/app/a/detay')).toBeUndefined(); // exact: alt adres eşleşmez
	expect(key('/app/c/123')).toBe('c'); // prefix
	expect(key('/app/cc')).toBeUndefined();
	expect(key('/app/off')).toBeUndefined(); // pasif
	expect(key('/app/hidden')).toBe('hidden'); // gizli sayfa da korunur

	const ali = resolve('ali', [editor]);
	expect(canAccessPage(resources, ali, '/app/a')).toBe(true);
	expect(canAccessPage(resources, resolve('guest', []), '/app/a')).toBe(false);
	expect(canAccessPage(resources, ali, '/app/menude-yok')).toBe(false); // sıkı: kaynağı olmayan sayfa kapalı
});

test('kullanıcı menüsü: erişilemeyen sayfa ve boş başlık budanır, gizli ve özellikler menüde yok; ray ilk sayfaya gider', () => {
	const ids = (nodes: { id: string; children: unknown[] }[]): unknown => nodes.map((n) => (n.children.length ? [n.id, ids(n.children as never)] : n.id));

	expect(ids(buildAccessMenu(resources, resolve('ali', [editor])))).toEqual([['mod', ['b', ['grp', ['a', 'c']]]]]);
	expect(ids(buildAccessMenu(resources, resolve('guest', [])))).toEqual([['mod', ['b', ['grp', ['c']]]]]);
	expect(buildAccessMenu(resources, resolve('mehmet', []))[0].children.map((n) => n.id)).toEqual(['grp']); // b kişisel deny

	const onlyA = resolvePermissions({ subject: { id: 'u', roles: [] }, actions, resources, permissions: [perm('a', 'access', 'allow', { user: 'u' })] });
	const menu = buildAccessMenu(resources, onlyA);
	expect(ids(menu)).toEqual([['mod', [['grp', ['a']]]]]); // grup kendiliğinden görünür
	expect(firstHref(menu[0])).toBe('/app/a'); // modülün href'i yok: ilk görünen sayfa
	expect(buildAccessMenu(resources, {})).toEqual([]);
});

test('pruneTree: sayfası görünmeyen ama alt sayfası görünen düğüm başlık olarak kalır (bağlantısız)', () => {
	const tree = buildTree([
		{ id: 'p', parent_id: null, title: 'p', href: '/p', sort: 1 },
		{ id: 'p1', parent_id: 'p', title: 'p1', href: '/p/1', sort: 1 }
	]);
	const pruned = pruneTree(tree, (node) => node.id === 'p1');
	expect(pruned[0].href).toBeUndefined();
	expect(pruned[0].children[0].href).toBe('/p/1');
	expect(pruneTree(tree, () => false)).toEqual([]);
});

test('resourceTrail: sayfadan köke kaynak yolu; gizli sayfa da; prefix alt adres; kaynak yoksa boş', () => {
	const keys = (path: string) => resourceTrail(resources, path).map((r) => r.key);
	expect(keys('/app/a')).toEqual(['mod', 'grp', 'a']);
	expect(keys('/app/b')).toEqual(['mod', 'b']);
	expect(keys('/app/c/123')).toEqual(['mod', 'grp', 'c']); // prefix: alt adres
	expect(keys('/app/hidden')).toEqual(['mod', 'hidden']); // menüde gizli
	expect(keys('/app/yok')).toEqual([]);
	expect(keys('/app/off')).toEqual([]); // pasif
});
