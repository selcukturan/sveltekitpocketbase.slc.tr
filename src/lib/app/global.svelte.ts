// Client tarafında kullanılacak global reaktif değişkenlerdir.

import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

class Globals {
	mobileBreakpoint = $state(640);
	// Üst çubuktaki düğme: modül rayı ve menü ağacı birlikte gizlenir (odak modu). Menü ağacının kendi tercihine dokunmaz.
	hideSidebar = $state(false);
	// Menü ağacını daralt/genişlet (split pane'deki düğme). Modül değişince korunur.
	hidePageSidebar = $state(false);
	pageSidebarSize = $state({ vertical: 160, horizontal: 330 });
	// Menü ağacında kullanıcının açıp kapattığı gruplar (id → açık mı). Seçilmeyen grup varsayılanla açılır (nav-tree).
	menuExpanded = new SvelteMap<string, boolean>();
	windowWidth = $state(1000);
	isMobileBreakpoint = $derived(this.windowWidth < this.mobileBreakpoint);
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
