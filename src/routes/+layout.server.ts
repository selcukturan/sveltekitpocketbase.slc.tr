import type { LayoutServerLoad } from './$types';

/**
 * Kök +layout.js dosyanıza export const ssr = false eklerseniz,
 * tüm uygulamanız yalnızca istemcide oluşturulur - bu da aslında uygulamanızı bir SPA'ya dönüştürdüğünüz anlamına gelir.
 */
export const ssr = false;
/**
 * Temel kural şudur: bir sayfanın ön işlenebilir(prerender) olması için,
 * sayfaya doğrudan erişen iki kullanıcının da sunucudan aynı içeriği alması gerekir.
 */
export const prerender = false;

export const load: LayoutServerLoad = async () => {
	console.log('+layout.server.ts - (routes)');
	return {
		test: 'test'
	};
};
