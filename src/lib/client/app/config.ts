// Server'da ve client'da kullanılacak olan config dosyasıdır.
// Bu dosya, uygulamanın genel ayarlarını ve yapılandırmalarını içerir.
// kritik güvenlik ayarları burada tutulmaz.
export const config = {
	appName: 'SLC Web Applications',
	version: 'v0.1.0-alpha.196',
	copyright: `SLC Web Development © 2010-${new Date().getFullYear()}`,
	defaultLanguage: 'tr',
	supportedLanguages: ['tr', 'en']
} as const; // `as const` eklemek, objenin değerlerini readonly ve türlerini daha spesifik yapar.

export type AppConfigType = typeof config;
