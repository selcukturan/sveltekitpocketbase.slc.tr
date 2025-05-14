import * as toast from '@zag-js/toast';

/**
 * page.svelte'de kullanılacak olan toast bileşeni için bir örnek oluşturur.
 * @example
 * import { Toaster, createToaster } from '$lib/components/zagjs/toast';
 * const pageToaster = createToaster();
 * <Toaster toaster={pageToaster} />
 */
export function createToaster(options: toast.StoreProps = {}) {
	return toast.createStore(options);
}
