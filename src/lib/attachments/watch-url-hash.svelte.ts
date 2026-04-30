import { page } from '$app/state';
import { tick, untrack } from 'svelte';

export function watchUrlHash(callback: (currentHash: string) => void) {
	return () => {
		const hash = page.url.hash;
		untrack(() => {
			tick().then(() => {
				callback(hash);
			});
		});
	};
}
