/// <reference types="node" />
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Adresin bir +page.svelte'si var mı. Rota klasöründeki (group) segmentleri adreste görünmez:
// '/app/grapes' → src/routes/(app)/app/grapes/+page.svelte
export function pageExists(href: string, dir = 'src/routes', segments = href.split('/').filter(Boolean)): boolean {
	if (segments.length === 0 && existsSync(join(dir, '+page.svelte'))) return true;
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		if (/^\(.+\)$/.test(entry.name) && pageExists(href, join(dir, entry.name), segments)) return true;
		if (segments.length > 0 && entry.name === segments[0] && pageExists(href, join(dir, entry.name), segments.slice(1))) return true;
	}
	return false;
}
