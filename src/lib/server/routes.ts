// Uygulamanın (app) sayfaları: derleme zamanında src/routes'tan (Vite import.meta.glob). Kaynak düzenleme ekranında
// href'in gerçek bir sayfaya karşılık geldiği buradan denetlenir (tests/e2e/helpers/routes.ts'in sunucudaki karşılığı).

// Kalıpta '(app)' yazılamaz: parantez glob sözdizimidir ve hiçbir dosya eşleşmez. Tümü alınıp süzülür.
const files = Object.keys(import.meta.glob('/src/routes/**/+page.svelte')).filter((file) => file.startsWith('/src/routes/(app)/'));

// '/src/routes/(app)/app/grapes/(x)/crud/+page.svelte' → '/app/grapes/crud' ((group) klasörleri adreste görünmez)
const toPath = (file: string) =>
	'/' +
	file
		.replace(/^\/src\/routes\//, '')
		.replace(/\/?\+page\.svelte$/, '')
		.split('/')
		.filter((segment) => segment && !/^\(.+\)$/.test(segment))
		.join('/');

export const APP_PAGES: readonly string[] = files.map(toPath).sort();

// Parametreli segmentler ([id], [[opt]], [...rest]) herhangi bir değerle eşleşir
const patterns = APP_PAGES.map((page) => {
	const source = page
		.split('/')
		.map((segment) => (/^\[.+\]$/.test(segment) ? '[^/]+' : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
		.join('/');
	return new RegExp(`^${source}$`);
});

/** Adres (app) altındaki bir sayfaya karşılık geliyor mu (sondaki / önemsiz). */
export function pageExists(href: string): boolean {
	const path = href.length > 1 && href.endsWith('/') ? href.slice(0, -1) : href;
	return patterns.some((re) => re.test(path));
}
