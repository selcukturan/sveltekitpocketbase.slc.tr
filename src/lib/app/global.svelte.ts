// Client tarafında kullanılacak global reaktif değişkenlerdir.

import { getContext, setContext } from 'svelte';

class Globals {
	mobileBreakpoint = $state(640);
	hideSidebar = $state(false);
	hidePageSidebar = $state(false);
	pageSidebarSize = $state({ vertical: 160, horizontal: 330 });
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
