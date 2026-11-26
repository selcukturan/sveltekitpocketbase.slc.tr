// Menü ağacı (saf: Svelte ve tarayıcı gerektirmez; tests/e2e/menu-tree.spec.ts tarayıcısız test eder).
//
// Kayıtlar düz bir listedir ve birbirine parent_id ile bağlanır (ileride PocketBase'deki menü koleksiyonu aynı biçimde
// olacak). Kökler (parent_id: null) modüllerdir ve soldaki ikon rayında görünür; altındaki her şey o modülün menü
// ağacıdır. Grup düğümlerinin href'i yoktur; yapraklar sayfaya götürür.

export type MenuRecord<TTitle extends string = string, TIcon extends string = string> = {
	id: string;
	parent_id: string | null;
	title: TTitle; // çeviri anahtarı
	icon?: TIcon;
	href?: string;
	sort: number; // kardeşler arasında sıra (küçük önce)
};

export type MenuNode<TTitle extends string = string, TIcon extends string = string> = MenuRecord<TTitle, TIcon> & {
	children: MenuNode<TTitle, TIcon>[];
};

/**
 * Düz kayıtlardan ağaç kurar. Kardeşler `sort`'a göre sıralanır. Ebeveyni listede olmayan kayıtlar (yetim) ve
 * döngüdeki kayıtlar köklerden ulaşılamadığı için ağaca girmez.
 */
export function buildTree<T extends MenuRecord>(records: readonly T[]): MenuNode<T['title'], NonNullable<T['icon']>>[] {
	type Node = MenuNode<T['title'], NonNullable<T['icon']>>;
	const byParent = new Map<string | null, T[]>();
	for (const record of records) {
		const list = byParent.get(record.parent_id) ?? [];
		list.push(record);
		byParent.set(record.parent_id, list);
	}
	const seen = new Set<string>();
	const build = (parentId: string | null): Node[] =>
		(byParent.get(parentId) ?? [])
			.filter((record) => !seen.has(record.id) && seen.add(record.id))
			.sort((a, b) => a.sort - b.sort)
			.map((record) => ({ ...record, children: build(record.id) }) as Node);
	return build(null);
}

// '/app/grapes/' → '/app/grapes' (kök '/' kalır)
const normalize = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path);

// href bu adresi kapsıyor mu: aynı adres ya da bir alt adres ('/app/grapes' → '/app/grapes/crud'; '/app/grape' değil)
export const hrefMatches = (href: string, pathname: string) => {
	const h = normalize(href);
	const p = normalize(pathname);
	return p === h || p.startsWith(h === '/' ? '/' : `${h}/`);
};

/**
 * Adrese karşılık gelen düğümün kökten itibaren yolu: [modül, …, düğüm]. Eşleşme yoksa [].
 *
 * En uzun href kazanır (en özel sayfa); eşitlikte daha derindeki düğüm (modülün kendi adresi ile "Giriş" yaprağı aynı
 * adreste olduğunda yaprak seçilir). Menüde olmayan bir alt sayfada en yakın üst menü öğesi seçilir.
 */
export function findActivePath<N extends MenuNode>(roots: readonly N[], pathname: string): N[] {
	let best: { path: N[]; length: number } | undefined;
	const visit = (node: N, path: N[]) => {
		const current = [...path, node];
		if (node.href && hrefMatches(node.href, pathname)) {
			const length = normalize(node.href).length;
			if (!best || length > best.length || (length === best.length && current.length > best.path.length)) best = { path: current, length };
		}
		for (const child of node.children as N[]) visit(child, current);
	};
	for (const root of roots) visit(root, []);
	return best?.path ?? [];
}
