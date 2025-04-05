import { setContext, getContext } from 'svelte';
import * as toast from '@zag-js/toast';
import { normalizeProps, useMachine } from '@zag-js/svelte';

const GLOBAL_TOAST_CTX = Symbol('GLOBAL_TOAST_CTX');

export const setToast = (id: string) => {
	const [snapshot, send] = useMachine(toast.group.machine({ id, overlap: true }));
	const api = $derived(toast.group.connect(snapshot, send, normalizeProps));
	setContext(GLOBAL_TOAST_CTX, api);
	return api;
};

const getToast = () => {
	return getContext<ReturnType<typeof setToast>>(GLOBAL_TOAST_CTX);
};

export default getToast;
