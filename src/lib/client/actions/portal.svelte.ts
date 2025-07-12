import type { Attachment } from 'svelte/attachments';

export const portal: Attachment = (node) => {
	document.body.appendChild(node);

	return () => {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	};
};
