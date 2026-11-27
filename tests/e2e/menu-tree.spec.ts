import { test, expect } from '@playwright/test';
import { buildTree, findActivePath, hrefMatches, type MenuRecord } from '../../src/lib/app/menu/tree.ts';

// app/menu/tree.ts (saf): tarayıcı açılmaz. Gerçek menü veritabanındadır (acl_resources): tutarlılığı ve bağlantıların
// sayfası acl-data.spec.ts'te denetlenir.
const rec = (id: string, parent_id: string | null, sort: number, href?: string): MenuRecord => ({ id, parent_id, title: id, sort, href });
const ids = (path: { id: string }[]) => path.map((node) => node.id);

test('buildTree: parent_id ile ağaç, kardeşler sort sırasında; yetim ve döngüdeki kayıtlar girmez', () => {
	const tree = buildTree([
		rec('b', null, 20),
		rec('a', null, 10),
		rec('a2', 'a', 2),
		rec('a1', 'a', 1),
		rec('a1x', 'a1', 1),
		rec('orphan', 'missing', 1),
		rec('c1', 'c2', 1),
		rec('c2', 'c1', 1)
	]);
	expect(ids(tree)).toEqual(['a', 'b']);
	expect(ids(tree[0].children)).toEqual(['a1', 'a2']);
	expect(ids(tree[0].children[0].children)).toEqual(['a1x']);
	const all = JSON.stringify(tree);
	for (const id of ['orphan', 'c1', 'c2']) expect(all).not.toContain(`"${id}"`);
});

test('hrefMatches: aynı adres ya da alt adres; benzer önek eşleşmez, sondaki / önemsiz', () => {
	expect(hrefMatches('/app/grapes', '/app/grapes')).toBe(true);
	expect(hrefMatches('/app/grapes', '/app/grapes/crud')).toBe(true);
	expect(hrefMatches('/app/grapes/', '/app/grapes')).toBe(true);
	expect(hrefMatches('/app/grape', '/app/grapes')).toBe(false);
	expect(hrefMatches('/app/grapes/crud', '/app/grapes')).toBe(false);
});

test('findActivePath: en uzun eşleşme; eşitlikte derindeki yaprak; menüde olmayan alt sayfada en yakın üst öğe', () => {
	// Gerçek menünün biçimi: alt menülü modülün href'i yok, "Giriş" yaprakları üst adreste
	const menu = buildTree([
		rec('home', null, 10, '/app'),
		rec('grapes', null, 20),
		rec('grapes.intro', 'grapes', 10, '/app/grapes'),
		rec('grapes.crud', 'grapes', 20),
		rec('grapes.crud.intro', 'grapes.crud', 10, '/app/grapes/crud'),
		rec('grapes.crud.simple', 'grapes.crud', 20, '/app/grapes/crud/simple'),
		rec('logs', null, 30, '/app/logs'),
		rec('settings', null, 40, '/app/settings'),
		rec('settings.intro', 'settings', 10, '/app/settings')
	]);
	const at = (pathname: string) => ids(findActivePath(menu, pathname));
	expect(at('/app')).toEqual(['home']);
	expect(at('/app/grapes')).toEqual(['grapes', 'grapes.intro']);
	expect(at('/app/grapes/crud/simple')).toEqual(['grapes', 'grapes.crud', 'grapes.crud.simple']);
	expect(at('/app/grapes/crud/yok')).toEqual(['grapes', 'grapes.crud', 'grapes.crud.intro']);
	expect(at('/app/logs')).toEqual(['logs']);
	expect(at('/app/settings')).toEqual(['settings', 'settings.intro']); // modülün adresi = "Giriş": derindeki kazanır
	expect(at('/login')).toEqual([]);
});
