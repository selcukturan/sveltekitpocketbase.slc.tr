import type { Snippet } from 'svelte';
import * as tooltip from '@zag-js/tooltip';

export interface TooltipProps extends Omit<tooltip.Props, 'id'> {
	/* arrow?: boolean; */

	// Snippets ---
	trigger?: Snippet;
	content?: Snippet;

	// Events ---
	onmouseover?: () => void;
	onclick?: () => void;
}
