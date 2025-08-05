import { mount, unmount } from 'svelte';
import Confirm from './confirm.svelte';
import ConfirmDialog from './confirm-html-dialog.svelte';

export const confirm = async (options: { message?: string; yes?: string; no?: string } = {}) => {
	const { message, yes, no } = options;

	const confirmInstance = mount(Confirm, {
		target: document.body,
		props: {
			message,
			yes,
			no
		},
		intro: true
	});

	const isConfirmed = await confirmInstance.promise;

	await unmount(confirmInstance, { outro: true });

	return isConfirmed;
};

export const confirmDialog = async (options: { message?: string; yes?: string; no?: string } = {}) => {
	const { message, yes, no } = options;

	const confirmInstance = mount(ConfirmDialog, {
		target: document.body,
		props: {
			message,
			yes,
			no
		}
	});

	const isConfirmed = await confirmInstance.show();

	/* setTimeout(() => {
		unmount(confirmInstance);
	}, confirmInstance.ANIMATION_DURATION); */
	unmount(confirmInstance);

	return isConfirmed;
};
