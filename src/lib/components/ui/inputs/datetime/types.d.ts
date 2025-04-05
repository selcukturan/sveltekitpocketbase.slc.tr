import type { HTMLInputAttributes } from 'svelte/elements';
import type { InputConstraint } from 'sveltekit-superforms';
import type { InputVariantType, InputSizeType } from './utils';

export type Props = HTMLInputAttributes & {
	value?: string;
	label?: string;
	class?: string;
	variant?: InputVariantType;
	size?: InputSizeType;
	//************/
	errors?: string[];
	constraints?: InputConstraint;
};
