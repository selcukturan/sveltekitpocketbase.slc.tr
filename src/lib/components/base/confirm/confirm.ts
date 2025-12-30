import { mount, unmount } from 'svelte';
import Confirm from './confirm.svelte';

export const confirm = async (options: { message?: string; yes?: string; no?: string; animationDuration?: number } = {}) => {
	const { message, yes, no, animationDuration } = options;

	const confirmInstance = mount(Confirm, {
		target: document.body,
		props: {
			message,
			yes,
			no,
			animationDuration
		}
	});

	const isConfirmed = await confirmInstance.open();

	unmount(confirmInstance);

	return isConfirmed;
};
