# SvelteKit ve Pocketbase ile oluşturulan kapalı sistem full-stack SPA

## Giriş

Bu proje, **SvelteKit** ve **PocketBase**'i derinlemesine öğrenmek amacıyla geliştirilmiş, **küçük ve orta ölçekli projelerde** kullanılmak üzere tasarlanmış bir full-stack başlangıç yapısıdır.

Kullanıcı girişi gerektiren (kapalı sistem) yönetim panelleri, iç araçlar ve veri giriş uygulamaları hedeflenir. Odak noktası; SvelteKit'in **remote functions** özelliği (`query`, `form`, `command`) ile PocketBase koleksiyonlarını **uçtan uca tip güvenli** ve **çok katmanlı doğrulamalı** biçimde birbirine bağlayan, sade ve tutarlı bir yapı kurmaktır.

### Öne çıkanlar

- **Üç dosyalı sayfa yapısı:** her sayfa `page.shared.ts` (şemalar), `page.remote.ts` (sunucu) ve `+page.svelte` (arayüz) dosyalarından oluşur.
- **Tek doğruluk kaynağı:** alan kuralları (zorunluluk, uzunluk, seçenekler, dosya kısıtları …) yalnızca valibot şemasında, PocketBase'deki seçenek adlarıyla yazılır; istemci ve sunucu aynı şemayı kullanır.
- **Üç katmanlı doğrulama:** istemci ön kontrolü, sunucu (valibot) ve PocketBase. Üç katmandan gelen hatalar ilgili alanın altında, çevrilmiş olarak gösterilir.
- **PocketBase alan tiplerine karşılık gelen form bileşenleri:** Text, Textarea, Email, Url, Number, Date, Datetime, Bool, Select, Relation, File (GeoPoint ve JSON hariç).

### Teknolojiler

| Katman                         | Teknoloji                                  |
| ------------------------------ | ------------------------------------------ |
| Arayüz ve sunucu               | SvelteKit (remote functions), Svelte 5     |
| Veritabanı ve kimlik doğrulama | PocketBase                                 |
| Doğrulama                      | Valibot                                    |
| Stil                           | Tailwind CSS                               |
| Dağıtım                        | Docker (`Dockerfile.app`, `Dockerfile.pb`) |

## Belgeler

| Belge                                               | İçerik                                                                                                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Çekirdek Konsept (Core Concept)](docs/d00_core.md) | `page.shared.ts` / `page.remote.ts` / `+page.svelte` yapısı, input builder'ları, form sarmalayıcıları, doğrulama katmanları, hata mesajları ve yeni sayfa ekleme rehberi |

## ⚠️ Önemli: PocketBase'in sunucu tarafında kullanımı

Bu projede PocketBase'e **tarayıcıdan doğrudan erişilmez.** Tüm istekler SvelteKit sunucusu (Node.js) üzerinden geçer:

- PocketBase yalnızca sunucunun erişebileceği bir adreste çalışır (`PB_BACKEND_URL`).
- Node.js sunucusunda **her istek için yeni bir PocketBase JS SDK örneği** oluşturulur ([`hooks.server.ts`](src/hooks.server.ts) → [`createPocketBaseInstance`](src/lib/server/pb.ts)). Oturum bilgisi istekteki çerezden yüklenir ve örnek `event.locals.pb` üzerinden kullanılır; yanıt sunulduktan sonra örnek atılır. Böylece kullanıcıların oturumları birbirine karışmaz.
- Kullanıcının gerçek IP adresi PocketBase'e iletilir (rate limit ve loglar için).

Bu yaklaşım, PocketBase'in istemci tarafında (SPA) doğrudan kullanılmasından farklıdır ve kendine özgü sorunlar ile ödünler getirir. Daha fazla ilerlemeden önce PocketBase geliştiricisinin bu konudaki tartışmasını okuyun:

> **JS SSR - PocketBase ile etkileşimde bulunurken karşılaşılan sorunlar ve öneriler #5313**
> https://github.com/pocketbase/pocketbase/discussions/5313
