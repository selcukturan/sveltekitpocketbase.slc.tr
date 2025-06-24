import { getContext, setContext } from 'svelte';

class Globals {
	mobileBreakpoint = $state(640);
	hideSidebar = $state(false);
	hidePageSidebar = $state(false);
	windowWidth = $state(1000);
	isMobileBreakpoint = $derived(this.windowWidth < this.mobileBreakpoint);

	/* #test = $state('test');
	get test() {
		return this.#test;
	}
	set test(value: string) {
		this.#test = value;
	} */
	// ################################## BEGIN Constructor ################################################################
	/* constructor() {
		this.sources(sources);
	} */
	// ################################## END Constructor #################################################################
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
