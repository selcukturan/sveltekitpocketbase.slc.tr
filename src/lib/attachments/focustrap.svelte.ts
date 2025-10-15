import type { Attachment } from 'svelte/attachments';

export const focustrap: Attachment = (node) => {
	const previous = document.activeElement;

	if (!(node instanceof HTMLElement)) {
		throw new Error('Node is not an HTMLElement');
	}

	function focusable() {
		return Array.from(
			node.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const current = document.activeElement;

		const elements = focusable();
		const first = elements.at(0);
		const last = elements.at(-1);

		if (
			!(current instanceof HTMLElement) ||
			!(first instanceof HTMLElement) ||
			!(last instanceof HTMLElement)
		) {
			// event.preventDefault(); // No focusable elements
			return; // No focusable elements
		}

		if (event.shiftKey && current === first) {
			event.preventDefault();
			last.focus();
		}

		if (!event.shiftKey && current === last) {
			event.preventDefault();
			first.focus();
		}
	}

	const firstElement = focusable().at(0);
	if (firstElement instanceof HTMLElement) {
		firstElement.focus();
	}

	node.addEventListener('keydown', handleKeydown);

	return () => {
		node.removeEventListener('keydown', handleKeydown);
		if (previous instanceof HTMLElement) {
			previous.focus();
		}
	};
};
