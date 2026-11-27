// Client tarafında kullanılacak global reaktif değişkenlerdir.

import { getContext, setContext } from 'svelte';
import { MediaQuery, SvelteMap } from 'svelte/reactivity';

// Kullanıcının yerleşim tercihleri bu anahtarla localStorage'da tutulur (ağaç genişliği, gizli mi, açık gruplar)
const STORAGE_KEY = 'slc:layout';
type SavedLayout = { treeWidth?: number; hideTree?: boolean; expanded?: [string, boolean][] };

export type Screen = 'mobile' | 'tablet' | 'desktop';

// Menü ağacı genişliği sınırları (px): split pane'in min/max'ı ve klavyeyle taşıma bunlara uyar
export const TREE_MIN = 150;
export const TREE_MAX = 450;
export const TREE_DEFAULT = 330;

class Globals {
	// Ekran: < 640 mobil (menü drawer'da), 640–1023 tablet (ağaç içeriğin üstünde panel), ≥ 1024 masaüstü (split pane).
	// MediaQuery ilk karede doğru değeri verir (pencere genişliğini dinlemeye gerek yok).
	readonly #mobile = new MediaQuery('max-width: 639.98px');
	readonly #tablet = new MediaQuery('(min-width: 640px) and (max-width: 1023.98px)');
	readonly screen: Screen = $derived(this.#mobile.current ? 'mobile' : this.#tablet.current ? 'tablet' : 'desktop');
	readonly isMobileBreakpoint = $derived(this.screen === 'mobile');

	// Üst çubuktaki düğme: modül rayı ve menü ağacı birlikte gizlenir (odak modu). Menü ağacının kendi tercihine dokunmaz.
	hideSidebar = $state(false);
	// Masaüstünde menü ağacını daralt/genişlet (split pane'deki düğme). Modül değişince ve yenilemede korunur.
	hidePageSidebar = $state(false);
	// Masaüstünde menü ağacı genişliği (px). Yenilemede korunur.
	treeWidth = $state(TREE_DEFAULT);
	// Menü ağacında kullanıcının açıp kapattığı gruplar (id → açık mı). Seçilmeyen grup varsayılanla açılır (nav-tree).
	readonly menuExpanded = new SvelteMap<string, boolean>();
	// Menüde arama penceresini açar (app-layout bağlar). Sayfalar da kullanabilir (ör. karşılama panosu).
	// Ctrl+K taklit edilmez: geliştirme sunucusunda Vite DevTools da aynı kısayolu dinler.
	openSearch = () => {};

	constructor() {
		const saved = this.#read();
		if (typeof saved.treeWidth === 'number') this.treeWidth = Math.min(TREE_MAX, Math.max(TREE_MIN, saved.treeWidth));
		if (typeof saved.hideTree === 'boolean') this.hidePageSidebar = saved.hideTree;
		for (const [id, open] of saved.expanded ?? []) if (typeof id === 'string' && typeof open === 'boolean') this.menuExpanded.set(id, open);
	}

	readonly setTreeWidth = (px: number) => {
		this.treeWidth = Math.min(TREE_MAX, Math.max(TREE_MIN, Math.round(px)));
		this.#save();
	};
	readonly toggleTree = () => {
		this.hidePageSidebar = !this.hidePageSidebar;
		this.#save();
	};
	readonly setExpanded = (id: string, open: boolean) => {
		this.menuExpanded.set(id, open);
		this.#save();
	};

	// localStorage gizli pencerede ya da engelliyken hata verebilir: tercih yalnızca bu oturumda kalır
	#read(): SavedLayout {
		try {
			const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
			return value && typeof value === 'object' ? value : {};
		} catch {
			return {};
		}
	}
	#save() {
		const value: SavedLayout = { treeWidth: this.treeWidth, hideTree: this.hidePageSidebar, expanded: [...this.menuExpanded] };
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} catch {
			// kota dolu ya da erişim yok
		}
	}
}

// ################################## BEGIN Export Context ###############################################################
const SLC_GLOBAL_CTX = Symbol('SLC_GLOBAL_CTX');

export function initGlobalContext() {
	return setContext(SLC_GLOBAL_CTX, new Globals());
}
export function getGlobalContext() {
	return getContext<ReturnType<typeof initGlobalContext>>(SLC_GLOBAL_CTX);
}
// ################################## END Export Context #################################################################
