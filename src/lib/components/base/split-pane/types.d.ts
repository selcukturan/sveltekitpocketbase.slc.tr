/**
 * A length expressed as `${number}px`, `${number}%`, `${number}em` or `${number}rem`
 */
export type Length = `${number}px` | `${number}%` | `${number}em` | `${number}rem`;

export type SplitPanePropsType = {
	class?: string;
	id?: string | undefined;
	type: 'horizontal' | 'vertical';
	pos: Length;
	min: Length;
	max: Length;
	disabled?: boolean;
	priority?: 'min' | 'max';
	onchange?: (pos: Length) => void;
	slotA: Snippet;
	slotB: Snippet;
};
