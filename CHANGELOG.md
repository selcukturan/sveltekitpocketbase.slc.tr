<!-- markdownlint-configure-file { "MD024": { "siblings_only": true } } -->

# Değişiklik Günlüğü

Bu projedeki önemli değişiklikler bu dosyada tutulur.

Biçim [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) yapısını temel alır.
Sürüm numaraları `src/lib/app/config.ts` içindeki `version` alanını izler
(`v0.2.0-alpha.N`). Ara sürümlerin çoğu yalnızca sürüm artırımı olduğu için
kayıtlar konu başlıklarına göre gruplanmıştır.

## [Yayınlanmamış]

### Değişti

- Uygulama sürümü `v0.2.0-alpha.158` oldu.
- `.claude` klasörü artık git ile takip edilmiyor.

### Kaldırıldı

- `pb.ts`: `beforeSend` içinde yorum satırına alınmış eski realtime
  (`/api/realtime`) istisnası ve açıklaması silindi.

## [alpha.157] – 2026-11-17

### Değişti

- Svelte, Tailwind CSS, ESLint ve TypeScript geliştirme bağımlılıkları
  güncellendi.
- `pocketbase-types.ts` tip tanımları yeniden üretildi.
- PocketBase geliştirme Docker yapılandırması (`docker-compose.yml`,
  `Dockerfile`, `Dockerfile.pb`) güncellendi.
- `pb.ts`: `beforeSend` içindeki realtime istisnası devre dışı bırakıldı.
  Abonelik isteği artık SSE bağlantısıyla aynı başlıklarla gidiyor. Böylece
  Cloudflare arkasında PocketBase'in "Invalid realtime client." hatası
  önleniyor.

### Eklendi

- Svelte MCP sunucusu için `.mcp.json` yapılandırması.

### Kaldırıldı

- `demo_crud` koleksiyonu için biriken ara migration dosyaları temizlendi.

## [alpha.156] – 2026-11-11

### Eklendi

- **i18n:** Arayüzün geri kalanı çevrildi: Select, Relation (seçim diyaloğu
  dahil), File, onay diyaloğu, datatable, sayfalama, şablonlar (yükleniyor /
  içerik yok), boundary, bildirimler (tarihler dile göre biçimleniyor),
  toast'lar, tema değiştirici, kenar menüsü, hata sayfası ve CRUD sayfası.
  69 yeni tr/en anahtarı eklendi.
- **Formlar:** Kaydedilmemiş değişiklik koruması. `Form` içinde
  `beforeNavigate` kullanılıyor:
  - Uygulama içi geçişte onay soruluyor.
  - Sayfa yenilenir veya kapatılırsa tarayıcının kendi uyarısı çıkıyor.
  - Aynı sayfadaki hash değişiklikleri atlanıyor.
- **Formlar:** Formu temiz duruma getirmek için `markClean()` eklendi.

### Değişti

- **i18n:** Prop varsayılanları render anında çözülüyor (`yes ?? t(...)`),
  böylece dil değişince güncelleniyor.
- **Sunucu:** Kullanıcıya gösterilen hatalar çeviri anahtarı (`error_*`) olarak
  dönüyor ve istemcide çevriliyor. Beklenmeyen hataların ayrıntısı yalnızca
  sunucu loguna yazılıyor.
- **Şemalar:** Biçim hata mesajları çeviri anahtarı (`err_invalid_*`) oldu.
  E-posta/URL için en fazla uzunluk builder'a taşındı (`max`, varsayılan 255,
  `maxlength` niteliği).
- **Şemalar:** Textarea artık `\p{M}` ve `\p{Cf}` karakterlerine izin veriyor
  (varyasyon seçicileri, ZWJ emojiler, birleşik işaretler).
- **Şemalar:** Hidden input mesajları anahtar olarak tanımlandı, metadata
  eklendi.
- **Drawer:** Kapatma düğmeleri `onBeforeClose` üzerinden geçiyor. Zorla
  kapatma kaldırıldı.

### Düzeltildi

- **Formlar:** `isChanged` yalnızca takip edilen alanları karşılaştırıyor.
  File gölge alanları artık "değişti" durumunu yanlış tetiklemiyor.
- **Date:** Girdi ISO (`T`) olarak ayrıştırılıyor. Yazarken küçük yıllar
  (`0001-…`) yanlış ayrıştırılıp girdi sıfırlanıyordu.
- **Relation:** Liste `id` ile anahtarlandı ve `{#if}` dışına alındı. Böylece
  satır silinirken ve 0↔1 kayıt geçişlerinde slide animasyonu çalışıyor.

## [alpha.155] – 2026-10-27

### Eklendi

- **Şemalar:** Input builder'ları PocketBase alan seçeneklerini alıyor
  (`required`, `min`/`max`, `onlyInt`, `maxSelect`, `maxSize`, `mimeTypes`,
  `values`, `collection`, `exceptDomains`/`onlyDomains`). Tüm metadata tek bir
  `InputMeta` (`slc`) yapısında toplanıyor.
- **Formlar:** Tüm wrapper'ların ortak kullandığı `useFormField` yardımcısı:
  key, meta, required, label, çevrilmiş hata mesajları ve gölge alan hataları.
  `multiple`, `options`, `collection`, `accept`, `min`/`max`/`step` değerleri
  şema metadata'sından geliyor.
- **Formlar:** 3 katmanlı doğrulama (istemci, sunucu şeması, PocketBase):
  - `throwFormError`, PocketBase'in 400 alan hatalarını `invalid()`'e
    eşliyor.
  - `toPbPayload`, PocketBase'e gidecek gövdeyi oluşturuyor.
  - Form düzeyindeki hatalar `Form` içinde gösteriliyor.
- **CRUD (simple):** `createForm` ve `deleteRecord` eklendi. Input'lar ortak
  `recordInputs` snippet'inden geliyor. Her drawer `form.for()` ile kendi form
  örneğini kullanıyor.
- **i18n:** Doğrulama mesajları çeviri anahtarı (`err_*`). Parametreler
  metadata'dan dolduruluyor. `t()` artık bir yedek (fallback) değer alıyor.
- **Dokümantasyon:** `docs/d00_core.md` (temel kavramlar) ve README'ye giriş
  bölümü.

### Değişti

- **Number:** 12 ayrı builder tek builder'da birleştirildi.
- **Select/Relation/File:** `v.fallback` yerine `v.optional` kullanılıyor.
  Geçersiz değerler artık sessizce kaybolmuyor.
- **File:** `_Plus`/`_Minus` gölge alanları kuralları ayırıyor: sayı sınırı
  ana alanda, boyut ve MIME türü `_Plus` alanında. Kayıtlı ve yeni dosyalar
  ayrı anahtarlarla tutuluyor.

### Düzeltildi

- **File:** Tek dosyalık alanda dosya değiştirilince kayıtlı eski dosya
  silinmek üzere işaretleniyor.

## [alpha.134 – alpha.154] – 2026-10-13 / 2026-10-27

### Eklendi

- **Bildirimler:** PocketBase SSE üzerinden `query.live` ile canlı bildirim akışı.
- **Bildirimler:** Bileşen kaldırıldığında canlı bağlantılar açıkça kapatılıyor.
  Boşta kalma (idle) zaman aşımı eklendi.
- **Bildirimler:** Canlı akışın token'ı, boştaki oturum süresini uzatmadan
  taze tutuluyor.
- **Bildirimler:** Liste boyutu sınırlandı (100 kayıt). Bağlantı kurulurken
  oluşan veri boşluğu kapatıldı.
- **Bildirimler:** Header'a bildirim popover'ı eklendi ve canlı akışa bağlandı.
- **Bildirimler:** Filtreli bildirim listesi ve detay diyaloğu.
- **Bildirimler:** Kullanıcı bazında soft-delete. Toplu "okundu işaretle" ve
  toplu silme.
- **ACL:** `order` alanıyla rol hiyerarşisine dayalı erişim kuralları.
  Bildirimlere gönderen alanları eklendi.

### Değişti

- **Bildirimler:** Canlı bağlantı yönetimi sadeleştirildi, heartbeat kaldırıldı.
- **Bildirimler:** Akış tek ve sıralı bir liste olarak yayınlanıyor. Remote
  fonksiyonlar son haline getirildi.
- **Input'lar:** Dosya ve relation listelerinin görünümü yenilendi.

### Düzeltildi

- **Input'lar:** Wrapper callback'leri düzeltildi.

## [alpha.125 – alpha.133] – 2026-10-05 / 2026-10-08

### Değişti

- **Relation:** Bileşen `relation/` klasörüne taşındı.
- **Relation:** Seçim diyaloğunun görünümü yenilendi.
- **Relation:** Seçilen kayıtlar için yatay scroll algılama eklendi. Diyalog
  düzeni elden geçirildi.

## [alpha.110 – alpha.124] – 2026-09-15 / 2026-09-30

### Eklendi

- `SelectPopover` bileşeni eklendi (alpha.110). Bileşen daha sonra `Select`
  ile birleştirildi.
- Form input bileşenlerine yeni prop'lar ve stiller eklendi.

### Değişti

- `Select` ve `Toggler` bileşenleri birkaç adımda yeniden düzenlendi.
- `Relation` bileşeni yeniden düzenlendi.
- `package.json` güncellendi.

### Kaldırıldı

- `SelectPopover` bileşeni kaldırıldı. İşlevi `Select` bileşenine aktarıldı.
- `.vscode` ve `.agents` klasörleri artık git ile takip edilmiyor.

## [alpha.102 – alpha.109] – 2026-09-02 / 2026-09-15

### Değişti

- **SvelteKit 3** ve **TypeScript 6** sürümlerine geçildi (alpha.105).
- Depo dosyaları güncellendi.

## [alpha.82 – alpha.101] – 2026-08-06 / 2026-08-11

### Eklendi

- `TogglerPopover` bileşeni ve tanıtım (showcase) sayfası.
- Remote functions demo sayfasında işaretçi türü (mouse, dokunma, klavye)
  izleniyor ve gösteriliyor.
- `Toggler` bileşenine `class` desteği eklendi.

### Değişti

- Popover'da `overflow: clip` kaldırıldı, yerine container stili kullanıldı.
- Popover olay yönetimi ve aç/kapa mantığı iyileştirildi.
- Demo sayfasının stilleri CSS değişkenlerine taşındı.
- Toggler popover bileşenlerine tutarlı stil uygulandı.

### Düzeltildi

- Aç/kapa davranışı farklı işaretçi türlerinde tutarlı çalışıyor.
- Klavyeyle tetiklenen tıklamalarda `pointerType` değeri `keyboard` oluyor.

### Kaldırıldı

- Global scrollbar CSS kuralları kaldırıldı.

## [Başlangıç] – 2026-07-06 / 2026-07-28

### Değişti

- Node ve `@types/node` v24'e yükseltildi. PocketBase container'ının adı
  değiştirildi.
- Route'lar route group'larla yeniden düzenlendi. PocketBase migration
  şemaları güncellendi.
- CRUD grid durum yönetimi zaman damgalarıyla yeniden yazıldı. Oturum açmamış
  kullanıcılar giriş sayfasına yönlendiriliyor.
- İkon adlarında düz string yerine `IconKey` tipi kullanılıyor.
- Proje bağımlılıkları güncellendi.
