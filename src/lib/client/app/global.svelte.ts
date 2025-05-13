import { setContext, getContext } from 'svelte';
import type { GlobalContext } from './types';

// Application global reactive context

const defaultGlobal: GlobalContext = {
	mobileBreakpoint: 640,
	isMobileBreakpoint: false,
	hideSidebar: false,
	hidePageSidebar: false
};

const key: symbol = Symbol();

export const initGlobalContext = (initialData: GlobalContext = defaultGlobal) => {
	const globalContext = $state(initialData);
	setContext(key, globalContext);
	return globalContext;
};

export const getGlobalContext = () => {
	return getContext<ReturnType<typeof initGlobalContext>>(key);
};
