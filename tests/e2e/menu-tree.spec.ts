/// <reference types="node" />
import { test, expect } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildTree, findActivePath, hrefMatches, type MenuRecord } from '../../src/lib/app/menu/tree.ts';
import { MENU, MENU_RECORDS } from '../../src/lib/app/menu/menu.ts';

// app/menu (saf): tarayıcı açılmaz.
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
	const at = (pathname: string) => ids(findActivePath(MENU, pathname));
	expect(at('/app')).toEqual(['home']);
	expect(at('/app/grapes')).toEqual(['grapes', 'grapes-intro']); // modülün kendi adresi = "Giriş" yaprağı
	expect(at('/app/grapes/crud/simple')).toEqual(['grapes', 'grapes-crud', 'grapes-crud-simple']);
	expect(at('/app/grapes/crud/yok')).toEqual(['grapes', 'grapes-crud', 'grapes-crud-intro']);
	expect(at('/app/logs')).toEqual(['logs']);
	expect(at('/app/settings/system/application')).toEqual(['settings', 'settings-system', 'settings-application']);
	expect(at('/login')).toEqual([]);
});

test('menu.ts: id tekil, her parent_id var, kökler ikonlu, gruplar href’siz ve boş değil', () => {
	const byId = new Map(MENU_RECORDS.map((r) => [r.id, r]));
	expect(byId.size).toBe(MENU_RECORDS.length);
	for (const r of MENU_RECORDS) {
		if (r.parent_id !== null) expect(byId.has(r.parent_id), `${r.id} → ${r.parent_id}`).toBe(true);
		else expect(r.icon, `${r.id} modülünün ikonu`).toBeTruthy();
		const hasChildren = MENU_RECORDS.some((c) => c.parent_id === r.id);
		if (r.parent_id !== null && !r.href) expect(hasChildren, `${r.id}: href yoksa grup olmalı`).toBe(true);
	}
	expect(JSON.stringify(MENU).length).toBeGreaterThan(0);
});

// Rota klasöründeki (group) segmentleri adreste görünmez: '/app/grapes' → src/routes/(app)/app/grapes/+page.svelte
function pageExists(href: string, dir = 'src/routes', segments = href.split('/').filter(Boolean)): boolean {
	if (segments.length === 0 && existsSync(join(dir, '+page.svelte'))) return true;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		if (/^\(.+\)$/.test(entry.name) && pageExists(href, join(dir, entry.name), segments)) return true;
		if (segments.length > 0 && entry.name === segments[0] && pageExists(href, join(dir, entry.name), segments.slice(1))) return true;
	}
	return false;
}

test('menü bağlantılarının hepsinin bir sayfası var (+page.svelte)', () => {
	expect(pageExists('/app/yok-boyle-sayfa')).toBe(false); // denetimin kendisi: olmayan sayfa yakalanır
	expect(pageExists('/app/grapes/crud/simple')).toBe(true);
	const missing = MENU_RECORDS.filter((r) => r.href && !pageExists(r.href)).map((r) => `${r.id}: ${r.href}`);
	expect(missing).toEqual([]);
});
