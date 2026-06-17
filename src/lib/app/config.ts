// Server ve Client tarafında kullanılabilecek config dosyasıdır.
// Bu dosya, uygulamanın genel ayarlarını ve yapılandırmalarını içerir.
// kritik güvenlik ayarları burada tutulmaz.

export const config = {
	appName: 'SLC Web Applications',
	version: 'v0.2.0-alpha.74',
	copyright: `SLC Web Development © 2010-${new Date().getFullYear()}`
} as const; // `as const` eklemek, objenin değerlerini readonly ve türlerini daha spesifik yapar.

export type AppConfigType = typeof config;

// TODO: yapılacak
// HACK: hack
// BUG: hata
// MARK: işaretleme
// FIXME: düzeltilmeli
// XXX: önemli bir şeyler var
// [ ] yapılacak
// [/] yarı yapıldı
// [x] yapıldı

/**
 * TODO: yapılacak
 * HACK: hack
 * BUG: hata
 * MARK: işaretleme
 * FIXME: düzeltilmeli
 * XXX: önemli bir şeyler var
 * [ ] yapılacak
 * [/] yarı yapıldı
 * [x] yapıldı
 */
