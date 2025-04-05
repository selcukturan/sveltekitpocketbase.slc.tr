import type { HTMLButtonAttributes } from 'svelte/elements';
import type { InputVariantType, InputSizeType } from './utils';
import type { Snippet } from 'svelte';

export interface Props extends HTMLButtonAttributes {
	children?: Snippet;
	class?: string;
	variant?: InputVariantType;
	size?: InputSizeType;
}
