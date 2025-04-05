import type { HTMLInputAttributes } from 'svelte/elements';
import type { InputConstraint } from 'sveltekit-superforms';
import type { InputVariantType, InputSizeType } from './utils';

type DataType = {
	value: string;
	label: string;
};

export interface Props extends HTMLInputAttributes {
	value?: string;
	data?: DataType[];
	label?: string;
	class?: string;
	variant?: InputVariantType;
	size?: InputSizeType;
	//************/
	popovertarget?: string;
	//************/
	errors?: string[];
	constraints?: InputConstraint;
}
