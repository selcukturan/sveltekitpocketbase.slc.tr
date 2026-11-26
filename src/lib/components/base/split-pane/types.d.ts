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
	// Bölücünün erişilebilir adı (role="separator"); klavyeyle ok tuşları taşır, Home/End min/max, çift tık resetPos
	dividerLabel?: string;
	// Çift tıklamada dönülecek konum (verilmezse çift tık bir şey yapmaz)
	resetPos?: Length;
	slotA: Snippet;
	slotB: Snippet;
};
