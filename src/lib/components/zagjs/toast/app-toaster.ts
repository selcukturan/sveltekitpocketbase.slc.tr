import { createToaster } from './create-toaster';

/**
 * Kök Layout.svelte'de kullanılacak olan toast bileşeni için bir örnek oluşturur.
 * @example
 * import { Toaster, appToaster } from '$lib/components/zagjs/toast';
 * <Toaster toaster={appToaster} />
 */
export const appToaster = createToaster({ overlap: true, placement: 'bottom-end' });
