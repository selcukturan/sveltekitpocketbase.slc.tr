import { setContext, getContext } from 'svelte';

type GlobalStatesDataType = {
	pageTitle?: string;
	appName?: string;
	pxMobileBreakpoint?: number;
	isMobileBreakpoint?: boolean;
	hideSidebar?: boolean;
	hidePageSidebar?: boolean;
};

const GLOBAL_CTX = Symbol('GLOBAL_CTX');

export const setGlobalStates = (initialData: GlobalStatesDataType = { pageTitle: 'SLC Web' }) => {
	const globalStates = $state(initialData);
	setContext(GLOBAL_CTX, globalStates);
	return globalStates;
};

export const getGlobalStates = () => {
	return getContext<ReturnType<typeof setGlobalStates>>(GLOBAL_CTX);
};
