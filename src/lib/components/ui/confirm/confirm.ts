import { mount, unmount } from 'svelte';
import Confirm from './confirm.svelte';

export type ConfirmOptions = {
	title?: string; // varsayılan: t('confirm_title')
	message?: string;
	yes?: string;
	no?: string;
	danger?: boolean; // geri alınamaz işlemler (silme vb.): onay butonu kırmızı
	animationDuration?: number;
};

export const confirm = async (options: ConfirmOptions = {}) => {
	const confirmInstance = mount(Confirm, { target: document.body, props: options });

	const isConfirmed = await confirmInstance.open();

	unmount(confirmInstance);

	return isConfirmed;
};
