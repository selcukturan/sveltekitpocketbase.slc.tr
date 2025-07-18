import type { Attachment } from 'svelte/attachments';
import { isFocusable } from '$lib/client/utils';

// tooltip element type [extended div]
type TooltipElementType = HTMLDivElement & {
	activeNode?: HTMLElement;
};

// tooltip options type
type TooltipOptionType = {
	text?: string;
	position?: string;
	class?: string;
	delay?: number;
	hideOnClick?: boolean | null;
};

let showTimeoutId: ReturnType<typeof setTimeout>;
let tooltipContainer: TooltipElementType;
const defaultTooltipClass = 'slc-app-tooltip';

function normalize(rawData: string | object) {
	if (typeof rawData == 'string') {
		return {
			text: rawData,
			position: 'bottom',
			hideOnClick: null // auto
		};
	}
	return rawData || {};
}

function getTooltip() {
	tooltipContainer = tooltipContainer || document.querySelector('.' + defaultTooltipClass);

	if (!tooltipContainer) {
		// create
		tooltipContainer = document.createElement('div');
		tooltipContainer.classList.add(defaultTooltipClass);
		document.body.appendChild(tooltipContainer);
	}

	return tooltipContainer;
}

function refreshTooltip(node: HTMLElement, data: TooltipOptionType) {
	const tooltip = getTooltip();
	if (!tooltip.classList.contains('active') || !data?.text) {
		hideTooltip();
		return; // aktif olmadığında veya görüntülenecek metin olmadığından güncellemeye gerek yoktur
	}

	// set tooltip content
	tooltip.textContent = data.text;

	// reset tooltip styling
	tooltip.className = `${defaultTooltipClass} ${data.position || ''} active ${data.class || ''}`.trim();

	// reset tooltip position
	tooltip.style.top = '0px';
	tooltip.style.left = '0px';

	// not: burada getBoundingClientRect() kullanılmaz çünkü
	// tooltip [animated/scaled/transformed]->hareketlendirilebilir/ölçeklendirilebilir/dönüştürülebilir ve gerçek boyuta ihtiyacımız vardır
	const tooltipHeight = tooltip.offsetHeight;
	const tooltipWidth = tooltip.offsetWidth;

	const nodeRect = node.getBoundingClientRect();
	let top = 0;
	let left = 0;
	const tolerance = 5;

	// calculate tooltip position position
	if (data.position == 'left') {
		top = nodeRect.top + nodeRect.height / 2 - tooltipHeight / 2;
		left = nodeRect.left - tooltipWidth - tolerance;
	} else if (data.position == 'right') {
		top = nodeRect.top + nodeRect.height / 2 - tooltipHeight / 2;
		left = nodeRect.right + tolerance;
	} else if (data.position == 'top') {
		top = nodeRect.top - tooltipHeight - tolerance;
		left = nodeRect.left + nodeRect.width / 2 - tooltipWidth / 2;
	} else if (data.position == 'top-left') {
		top = nodeRect.top - tooltipHeight - tolerance;
		left = nodeRect.left;
	} else if (data.position == 'top-right') {
		top = nodeRect.top - tooltipHeight - tolerance;
		left = nodeRect.right - tooltipWidth;
	} else if (data.position == 'bottom-left') {
		top = nodeRect.top + nodeRect.height + tolerance;
		left = nodeRect.left;
	} else if (data.position == 'bottom-right') {
		top = nodeRect.top + nodeRect.height + tolerance;
		left = nodeRect.right - tooltipWidth;
	} else {
		// bottom
		top = nodeRect.top + nodeRect.height + tolerance;
		left = nodeRect.left + nodeRect.width / 2 - tooltipWidth / 2;
	}

	// right edge boundary
	// sağ kenar sınırı
	if (left + tooltipWidth > document.documentElement.clientWidth) {
		left = document.documentElement.clientWidth - tooltipWidth;
	}

	// left edge boundary
	// sol kenar sınırı
	left = left >= 0 ? left : 0;

	// bottom edge boundary
	// alt kenar sınırı
	if (top + tooltipHeight > document.documentElement.clientHeight) {
		top = document.documentElement.clientHeight - tooltipHeight;
	}

	// top edge boundary
	// üst kenar sınırı
	top = top >= 0 ? top : 0;

	// apply new tooltip position
	tooltip.style.top = top + 'px';
	tooltip.style.left = left + 'px';
}

function hideTooltip() {
	const tooltip = getTooltip();
	clearTimeout(showTimeoutId);

	tooltip.classList.remove('active');
	tooltip.activeNode = undefined;
}

function showTooltip(node: HTMLElement, data: TooltipOptionType) {
	const tooltip = getTooltip();

	tooltip.activeNode = node;

	clearTimeout(showTimeoutId);
	showTimeoutId = setTimeout(
		() => {
			tooltip.classList.add('active');

			refreshTooltip(node, data);
		},
		// !isNaN(data.delay) ? data.delay : 0
		Number.isFinite(data.delay) ? data.delay : 0
	);
}

export function tooltip(tooltipData: string | object): Attachment {
	console.log(`Started. ${new Date().getTime()}`);
	let data: TooltipOptionType = normalize(tooltipData);

	return (node) => {
		console.log(`Element DOM'a monte edildi. ${new Date().getTime()}`);
		if (!(node instanceof HTMLElement)) {
			throw new Error('Node is not an HTMLElement');
		}

		function showEventHandler() {
			showTooltip(node as HTMLElement, data);
		}

		function hideEventHandler() {
			hideTooltip();
		}

		// getTooltip() ile ilk tooltip oluşturmayı tetikler (zaten eklenmemişse)
		// refreshTooltip(node, data);
		if (getTooltip()?.activeNode?.contains(node)) {
			refreshTooltip(node, data);
		}

		console.log(`Element'in kurulumu yapıldı. ${new Date().getTime()}`);
		node.addEventListener('mouseenter', showEventHandler);
		node.addEventListener('mouseleave', hideEventHandler);
		node.addEventListener('blur', hideEventHandler);
		if (data.hideOnClick === true || (data.hideOnClick === null && isFocusable(node))) {
			node.addEventListener('click', hideEventHandler);
		}

		return () => {
			console.log(`Element DOM'dan söküldü. ${new Date().getTime()}`);
			// if (getTooltip()?.activeNode?.contains(element)) {
			//	hideTooltip();
			// }
			node.removeEventListener('mouseenter', showEventHandler);
			node.removeEventListener('mouseleave', hideEventHandler);
			node.removeEventListener('blur', hideEventHandler);
			node.removeEventListener('click', hideEventHandler);
		};
	};
}
