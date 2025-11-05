import { goto } from '$app/navigation';
import { page } from '$app/state';

export function hashParam(key: string, hash: string) {
	const hashData = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
	return hashData.get(key);
}

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
