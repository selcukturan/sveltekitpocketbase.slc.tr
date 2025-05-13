import { setContext, getContext } from 'svelte';

type ConfigStatesDataType = {
	pageTitle?: string;
	appName?: string;
	pxMobileBreakpoint?: number;
	isMobileBreakpoint?: boolean;
	hideSidebar?: boolean;
	hidePageSidebar?: boolean;
};

const CONFIG_CTX = Symbol('GLOBAL_CTX');

export const setConfigStates = (initialData: ConfigStatesDataType = { pageTitle: 'SLC Web' }) => {
	const configStates = $state(initialData);
	setContext(CONFIG_CTX, configStates);
	return configStates;
};

export const getConfigStates = () => {
	return getContext<ReturnType<typeof setConfigStates>>(CONFIG_CTX);
};
