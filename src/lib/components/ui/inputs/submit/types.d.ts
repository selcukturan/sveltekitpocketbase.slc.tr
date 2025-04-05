import type { HTMLButtonAttributes } from 'svelte/elements';
import type { InputVariantType, InputSizeType } from './utils';

export interface Props extends HTMLButtonAttributes {
	label?: string;
	submitting: boolean;
	delayed?: boolean;
	timeout?: boolean;
	class?: string;
	variant?: InputVariantType;
	size?: InputSizeType;
}
