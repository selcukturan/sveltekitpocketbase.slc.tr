import { goto } from '$app/navigation';
import { page } from '$app/state';

/**
 * URL hash'ten bir parametre alır.
 * @param key Parametre anahtarı.
 * @param hash Aranacak URL hash'i.
 * @returns Parametre değeri veya bulunamazsa null.
 */
export function getParam(key: string, hash: string) {
	const hashData = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
	return hashData.get(key);
}
/**
 * URL hash'ine parametre ekler veya günceller. window.location.hash'i günceller.
 * @param params Eklemek veya güncellemek için parametreler.
 */
export function setParams(params: Record<string, string>) {
	const pageUrlHash = new URLSearchParams(page.url.hash.startsWith('#') ? page.url.hash.slice(1) : page.url.hash);
	for (const [key, value] of Object.entries(params)) {
		if (value === null || value === undefined || value === '') {
			pageUrlHash.delete(key);
		} else {
			pageUrlHash.set(key, value);
		}
	}
	const pageUrlHashString = pageUrlHash.toString();

	goto(pageUrlHashString ? `#${pageUrlHashString}` : '', { replaceState: true, noScroll: true, keepFocus: true });
}
