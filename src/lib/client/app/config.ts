import { getContext, setContext } from 'svelte';

// Application global non-reactive context

/* prettier-ignore */
class Config {
	#version: string = 'v0.0.1-build.10';
	get version(){return this.#version;}
}

// ################################## BEGIN Export Table Context ##############################################################################################################################

const key: symbol = Symbol();

export function initConfigContext() {
	return setContext(key, new Config());
}
export function getConfigContext() {
	return getContext<ReturnType<typeof initConfigContext>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
