import { mount, unmount } from 'svelte';
import Picker from './relation-picker.svelte';

import type { RelationPickerRunnerPropsType, ResolveData } from './types';

export const relationPicker = async <T extends boolean = false>(
	options: RelationPickerRunnerPropsType<T>
): Promise<ResolveData<T>> => {
	const { message, yes, no, animationDuration, multiple, value } = options;

	const pickerInstance = mount(Picker, {
		target: document.body,
		props: {
			message,
			yes,
			no,
			animationDuration,
			multiple,
			value
		} as any
	}) as unknown as { open: () => Promise<ResolveData<T>> };

	const data = await pickerInstance.open();

	unmount(pickerInstance);

	return data;
};
