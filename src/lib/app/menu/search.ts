// Menüde arama (Ctrl+K), saf: Svelte ve tarayıcı gerektirmez (tests/e2e/menu-search.spec.ts tarayıcısız test eder).
//
// Aranan liste kullanıcının menüsüdür (buildAccessMenu): erişemediği sayfa listede hiç yoktur. Sayfası olan her düğüm
// (yaprak sayfalar ve alt menüsüz modüller) bir sonuçtur. Arama Türkçe normalizasyonla yapılır (büyük/küçük harf ve
// aksan farkı yok, ı = i); başlıkta (seçili dil), kaynağın adında (label) ve anahtarında, ayrıca yolunda arar.

import { normalizeStringForTurkishSearch as normalize } from '../../utils/common.js';
import type { MenuNode } from './tree.js';

export type MenuSearchEntry = {
	id: string; // kaynak anahtarı
	title: string; // gösterilen başlık (seçili dilde)
	path: string[]; // üst başlıklar: [modül, grup…]
	href: string;
	order: number; // menüdeki sıra (eşit skorlarda)
	// normalize edilmiş arama metinleri
	normTitle: string;
	normRest: string; // ad (label), anahtar ve yol
};

/** Menüdeki sayfaları arama listesine çevirir. titleOf: düğümün gösterilen başlığı (menuTitle). */
export function menuEntries<N extends MenuNode>(roots: readonly N[], titleOf: (node: N) => string): MenuSearchEntry[] {
	const entries: MenuSearchEntry[] = [];
	const walk = (nodes: readonly N[], path: string[]) => {
		for (const node of nodes) {
			const title = titleOf(node);
			if (node.href) {
				entries.push({
					id: node.id,
					title,
					path,
					href: node.href,
					order: entries.length,
					normTitle: normalize(title),
					normRest: normalize([node.title, node.id, ...path].join(' '))
				});
			}
			walk(node.children as N[], [...path, title]);
		}
	};
	walk(roots, []);
	return entries;
}

/**
 * Sorguya uyan sayfalar, en iyi eşleşme önce. Sorgu boşsa menü sırasıyla hepsi. Sorgunun her kelimesi başlıkta ya da
 * diğer metinlerde geçmeli. Sıralama: başlık sorguyla başlıyor → başlıkta bir kelime sorguyla başlıyor → başlıkta
 * geçiyor → yalnızca ad / anahtar / yolda geçiyor; eşitlikte menü sırası.
 */
export function searchMenu(entries: readonly MenuSearchEntry[], query: string, limit = 50): MenuSearchEntry[] {
	const q = normalize(query.trim());
	if (!q) return entries.slice(0, limit);
	const words = q.split(/\s+/);
	const scored: { entry: MenuSearchEntry; score: number }[] = [];
	for (const entry of entries) {
		const all = `${entry.normTitle} ${entry.normRest}`;
		if (!words.every((w) => all.includes(w))) continue;
		const score = entry.normTitle.startsWith(q) ? 0 : entry.normTitle.split(/\s+/).some((w) => w.startsWith(words[0])) ? 1 : entry.normTitle.includes(q) ? 2 : 3;
		scored.push({ entry, score });
	}
	return scored
		.sort((a, b) => a.score - b.score || a.entry.order - b.entry.order)
		.slice(0, limit)
		.map((s) => s.entry);
}
