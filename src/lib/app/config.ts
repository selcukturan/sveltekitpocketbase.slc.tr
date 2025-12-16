// Server ve Client tarafında kullanılabilecek config dosyasıdır.
// Bu dosya, uygulamanın genel ayarlarını ve yapılandırmalarını içerir.
// kritik güvenlik ayarları burada tutulmaz.
export const config = {
	appName: 'SLC Web Applications',
	version: 'v0.1.0-alpha.318',
	copyright: `SLC Web Development © 2010-${new Date().getFullYear()}`
} as const; // `as const` eklemek, objenin değerlerini readonly ve türlerini daha spesifik yapar.

export type AppConfigType = typeof config;
