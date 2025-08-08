import { mount, unmount } from 'svelte';
import Confirm from './confirm.svelte';

export const confirm = async (options: { message?: string; yes?: string; no?: string } = {}) => {
	const { message, yes, no } = options;

	const confirmInstance = mount(Confirm, {
		target: document.body,
		props: {
			message,
			yes,
			no
		}
	});

	const isConfirmed = await confirmInstance.open();

	unmount(confirmInstance);

	return isConfirmed;
};
