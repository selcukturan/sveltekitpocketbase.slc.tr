// Server ve Client tarafında kullanılabilecek config dosyasıdır.
// Bu dosya, uygulamanın genel ayarlarını ve yapılandırmalarını içerir.
// kritik güvenlik ayarları burada tutulmaz.

export const config = {
	appName: 'SLC Web Applications',
	version: 'v0.2.0-alpha.218',
	copyright: `SLC Web Development © 2010-${new Date().getFullYear()}`,
	// Uygulama saat dilimi (IANA). Tarih-saat alanları bu saat diliminde girilir ve gösterilir, tarih-saat filtrelerinin
	// gün sınırları buna göre hesaplanır. Tarayıcının saat dilimi kullanılmaz: her kullanıcı ve sunucu aynı sonucu üretir.
	// Başka bir bölgede kurulum: yalnızca bunu değiştirin (örn: 'Europe/Berlin'). Bkz. utils/timezone.ts
	timezone: 'Europe/Istanbul'
} as const; // `as const` eklemek, objenin değerlerini readonly ve türlerini daha spesifik yapar.

export type AppConfigType = typeof config;
