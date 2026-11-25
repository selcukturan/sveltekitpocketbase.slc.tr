import type { Attachment } from 'svelte/attachments';
import { isFocusable } from '#lib/utils/common.js';

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
	let top;
	let left;
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

// ---------------------------------------------------------------------------
// Olay dinleyicileri: eleman başına 4 dinleyici yerine belge düzeyinde TEK set (olay delegasyonu).
// Attachment yalnızca elemanı ve seçeneklerini kaydeder; sayfada yüzlerce tooltip'li eleman (örn. tablo satırlarındaki
// işlem butonları) olsa da dinleyici sayısı sabit kalır. Capture fazında dinlenir: uygulamadaki stopPropagation etkilemez.
// mouseenter/mouseleave/blur'ün karşılığı: mouseover/mouseout (relatedTarget ile)/focusout; bunlar kabarcıklanır.
// ---------------------------------------------------------------------------

type Registered = { data: TooltipOptionType; hideOnClick: boolean };
const registry = new WeakMap<Element, Registered>();
let listening = false;
let hovered: HTMLElement | undefined; // farenin içinde olduğu tooltip'li eleman (mouseenter/leave durumu)

// Hedeften yukarı doğru tooltip'i olan en yakın eleman (iç içe tooltip'te içteki kazanır)
function registeredFrom(target: EventTarget | null): HTMLElement | undefined {
	for (let el = target instanceof Element ? target : null; el; el = el.parentElement) {
		if (registry.has(el)) return el as HTMLElement;
	}
	return undefined;
}

function listen() {
	if (listening) return;
	listening = true;
	const options = { capture: true, passive: true };

	document.addEventListener(
		'mouseover',
		(e) => {
			const node = registeredFrom(e.target);
			// Aynı elemanın çocukları arasında gezinme yeni giriş değildir (mouseenter gibi): tıklamayla gizlenen
			// tooltip, fare ikonun üzerine geçince yeniden açılmaz
			if (node === hovered) return;
			hovered = node;
			if (node) showTooltip(node, registry.get(node)!.data);
		},
		options
	);
	document.addEventListener(
		'mouseout',
		(e) => {
			// mouseleave karşılığı: fare elemandan (ve çocuklarından) tamamen çıktı
			if (!hovered || registeredFrom(e.target) !== hovered || hovered.contains(e.relatedTarget as Node | null)) return;
			hovered = undefined;
			hideTooltip();
		},
		options
	);
	document.addEventListener(
		'focusout',
		(e) => {
			if (e.target instanceof Element && registry.has(e.target)) hideTooltip();
		},
		options
	);
	document.addEventListener(
		'click',
		(e) => {
			const node = registeredFrom(e.target);
			if (node && registry.get(node)!.hideOnClick) hideTooltip();
		},
		options
	);
}

export function tooltip(tooltipData: string | TooltipOptionType): Attachment {
	const data: TooltipOptionType = normalize(tooltipData);

	return (node) => {
		if (!(node instanceof HTMLElement)) {
			throw new Error('Node is not an HTMLElement');
		}
		listen();

		registry.set(node, { data, hideOnClick: data.hideOnClick === true || (data.hideOnClick === null && isFocusable(node)) });

		// Seçenekler değişti (örn. dil) ve tooltip bu elemanda açık: yeni metinle yenile
		if (getTooltip()?.activeNode?.contains(node)) {
			refreshTooltip(node, data);
		}

		return () => {
			registry.delete(node);
			// Eleman DOM'dan kalktıysa ve tooltip'i açıksa gizle; yoksa ekranda takılı kalırdı. (Seçenekler değişince de
			// temizlik çalışır ama eleman DOM'dadır: attachment hemen yeniden kaydeder ve açık tooltip'i yeniler.)
			if (!node.isConnected) {
				if (hovered === node) hovered = undefined;
				if (getTooltip().activeNode === node) hideTooltip();
			}
		};
	};
}
