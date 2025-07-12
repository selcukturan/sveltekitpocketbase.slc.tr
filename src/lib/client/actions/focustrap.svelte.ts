import type { Attachment } from 'svelte/attachments';

export const focustrap: Attachment = (node) => {
	const previous = document.activeElement;

	if (!(previous instanceof HTMLElement) || !(node instanceof HTMLElement)) {
		throw new Error('Previous active element or node is not an HTMLElement');
	}

	function focusable() {
		return Array.from(node.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const current = document.activeElement;

		const elements = focusable();
		const first = elements.at(0);
		const last = elements.at(-1);

		if (!(first instanceof HTMLElement) || !(last instanceof HTMLElement)) {
			throw new Error('first or last element is not an HTMLElement');
		}

		if (event.shiftKey && current === first) {
			last.focus();
			event.preventDefault();
		}

		if (!event.shiftKey && current === last) {
			first.focus();
			event.preventDefault();
		}
	}

	const firstElement = focusable()[0];
	if (firstElement instanceof HTMLElement) firstElement.focus();
	node.addEventListener('keydown', handleKeydown);

	return () => {
		node.removeEventListener('keydown', handleKeydown);
		previous.focus();
	};
};
