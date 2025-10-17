import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, depends, locals }) => {
	console.log(`${new Date().toISOString()} ----> /(app)/+layout.server.ts | url.pathname:${url.pathname}`);

	/**
	 * (app) klasörü içindeki rotalarda `+page.server.ts` olmasa bile her navigation'da `hooks.server.ts`in çalıştırılmasını sağlar.
	 * Bu authentication (kimlik doğrulama) ve authorization (yetkilendirme) kontrolü için bir mekanizma sağlar.
	 *
	 * - Bu uygulamanın tasarımı gereği (app) klasörü içindeki rotalarda `+page.server.ts` kullanılmayacaktır.
	 * - Rotalar için gerekli server verileri `Remote functions` ile sağlanacaktır.
	 */
	depends('server:rerun');

	return { user: locals.user };
};
