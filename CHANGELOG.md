<!-- markdownlint-configure-file { "MD024": { "siblings_only": true } } -->

# Değişiklik Günlüğü

Bu projedeki önemli değişiklikler bu dosyada tutulur.

Biçim [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) yapısını temel alır.
Sürüm numaraları `src/lib/app/config.ts` içindeki `version` alanını izler
(`v0.2.0-alpha.N`). Ara sürümlerin çoğu yalnızca sürüm artırımı olduğu için
kayıtlar konu başlıklarına göre gruplanmıştır.

## [Yayınlanmamış]

### Eklendi

- `/app/data-table`: DataTable'ın en temel hali; başlık, veri ve footer
  snippet'leri açıkça yazılmış (veri: Simple CRUD remote fonksiyonları).
- DataTable: hücre gezinmesi (1. aşama). Aktif hücre; ok tuşları, Tab /
  Shift+Tab (satır sonunda alt satıra), Home/End, Ctrl+Home/End, PageUp/PageDown,
  Enter. Odak grid'de kalır (`aria-activedescendant`); aktif satır kaydırılınca
  da DOM'da tutulur. Başlık/footer/sabit kolonlar için `scroll-padding` ile
  `scrollIntoView`. Yeni olaylar: `onRowActivate` (çift tıklama/Enter),
  `onCellClick`, `onCellDblClick`, `onActiveCellChange`. Tazelemede aktif hücre
  aynı kayıtta kalır, yeni sayfada ilk satıra geçer.
- DataTable: satır seçimi (2. aşama). `selection="single" | "multiple"`,
  `bind:selected` (satır id'leri; sayfalar arası korunur), `onSelectionChange`.
  Seçim kolonu `{ field: '_select', type: 'select' }`; başlıkta sayfayı seçen
  üç durumlu onay kutusu. Fare: seçim kolonunda tıklama/Shift+tıklama (aralık),
  Ctrl/⌘+tıklama; single modda satıra tıklamak seçer. Klavye: Space,
  Shift+Space (aralık), Ctrl/⌘+A, Esc. Alt barda "N seçili · Seçimi temizle".
- DataTable: hücre içindeki işlem butonları Tab sırasından çıkarıldı
  (`tabindex=-1`); klavyeyle grid üzerinden gezinilir.
  Odak hücredeki bir butondayken (örn. drawer kapanınca) Tab / Esc / oklar
  odağı aktif hücreye döndürür; silinen satırla birlikte kaybolan odak grid'e
  geri verilir (`MutationObserver`; async modda DOM güncellemesi ertelendiği
  için `tick()` güvenilir değil). Seçim kolonu `selection` kapalıyken gizlenir.
- DataTable: hücre aralığı seçimi (3. aşama). Shift + oklar / Home / End /
  PageUp / PageDown / Ctrl+Home / Ctrl+End, Shift + tıklama ve fareyle
  sürükleme (veri alanının kenarında otomatik kaydırma). Esc önce aralığı,
  sonra satır seçimini temizler. Ctrl/⌘+C aralığı (yoksa aktif hücreyi)
  sekmeyle ayrılmış metin olarak kopyalar (Excel'e yapıştırılabilir; seçim ve
  işlem kolonları atlanır). Aralık rengi `--dt-range`; hücrede `aria-selected`.
- DataTable: hücre düzenleme (4. aşama). Kolonda `editable: true`, tabloda
  `onCellEdit`. Başlatma: yazmaya başlamak, F2 / Enter, Backspace (boş), çift
  tıklama. Bitirme: Enter / Shift+Enter (alt/üst), Tab / Shift+Tab, ↑ ↓
  (metin/sayı), dışarı tıklama; Esc iptal. Düzenleyiciler: metin, sayı (dile göre
  ondalık), tarih, tarih-saat, `options` ile liste; bool düzenleyicisiz anında
  değişir. `validateCell` (forms'taki preflight gibi) mesaj döndürürse
  kaydedilmez; düzenleyici açık kalır, mesaj hücrenin altında (popover + CSS
  anchor positioning) görünür. Optimistik görünüm SvelteKit `withOverride` ile:
  `ListState.updatesWith(fn)` istek sürerken listeyi değiştirilmiş gösterir,
  hata olursa geri alınır; istek sürerken hücre "kaydediliyor" (soluk, italik).
  `editable` satır bazında fonksiyon olabilir (`(row) => boolean`); kendi
  `dataRow` snippet'inde `<DataCell editable={…}>` kolondakini o hücre için
  geçersiz kılar.
- DataTable: Ctrl/⌘+V ile yapıştırma (tarayıcının `paste` olayı, pano izni
  gerekmez). Sekmeyle ayrılmış blok (Excel/Sheets, Excel'in tırnaklı hücreleri
  dahil) aktif hücreden ya da aralığın sol üstünden yazılır; tek değer +
  aralık → aralık doldurulur. Düzenlenemeyen hücreler atlanır, geçersiz
  değerler kaydedilmez ve sayısı bildirilir; yapıştırılan alan seçili kalır.
  Toplu kayıt için `onCellsEdit` (verilmezse hücre başına `onCellEdit`).
  Tazelemede aktif kayıt yerinde kaldıysa hücre aralığı korunur.
- DataTable: `onCopy({ rows, cols })` panoya yazıldıktan sonra çağrılır;
  Simple CRUD "N hücre panoya kopyalandı." toast'ı gösterir.
- Simple CRUD: `updateCells` komutu (`cellsEditSchema`, en fazla 1000 hücre;
  kayıt bazında birleştirilip her kayıt tek istekle güncellenir).
- Simple CRUD: `updateCell` komutu ve `cellEditSchema` (alan bazında doğrulama;
  istemcide `validateCell`, sunucuda komut şeması); metin, sayı, liste, tarih
  ve bool kolonları tabloda düzenlenebilir.
- DataTable olayları: `onLoad({ items, …, reason: 'query' | 'refresh' })`,
  `onError(error)`, `onKeyDown(e, { cell, range, selected })` (yerleşik
  davranıştan önce; `preventDefault` ile ezer), `onContextMenu(cellEvent)`
  (tarayıcı menüsü açılmaz, aralık korunur), `bind:range` / `onRangeChange`
  ve `rowClass(row)`. Alt barda aralık özeti (hücre · toplam · ortalama; bar
  yüksekliğini değiştirmez). `helpers.copy()` ve `helpers.focus()`.
- Simple CRUD: Delete ile seçili satırları ya da aktif satırı silme
  (`deleteRecords` toplu komutu), sağ tık menüsü (Güncelle, Kopyala, Sil),
  boş sorgu sonucunda bilgi toast'ı, sorgu hatasında toast,
  `bool_optional` işaretli satırlar kalın.
- DataTable: çoklu hücre seçimi (Excel gibi). Ctrl/⌘ + tıklama ya da sürükleme
  seçime yeni alan ekler; Shift son alanı genişletir; seçili hücreye Ctrl+tıklama
  yalnızca aktif yapar. Özet tüm alanları (örtüşenler bir kez) sayar. Ctrl+C:
  aynı kolonlardaki alanlar alt alta, aynı satırlardakiler yan yana birleşir;
  değilse yalnızca son alan kopyalanır (`onCopy` `partial: true`). Ctrl+V: tek
  değer tüm alanlara dolar, blok son alana yazılır. `RangeInfo` artık
  `ranges: CellRange[]`; `KeyContext.range` → `ranges`.
- DataTable: veri hücresinde Ctrl+tıklama artık satır seçimini değiştirmez
  (satır seçimi: seçim kolonu, Space / Shift+Space / Ctrl+A, single modda tıklama).
- DataTable: `onVisibleRowsChange({ first, last, total })`: ekranda görünen
  veri satırları (overscan'siz; sticky başlık/footer altındakiler sayılmaz),
  yalnızca aralık değişince çağrılır. Simple CRUD durum çubuğunda
  "Görünen satırlar: 1–12 / 30" örneği.
- DataTable footer kısayolları: `sum(n)`, `avg(n)`, `min(n)`, `max(n)`,
  `count()` — kolonun yüklü satırlarından (bu sayfa) hesaplanır; n verilirse tam
  n basamak, verilmezse en fazla 2 (uygulamanın diline göre). Boş/sayı olmayan
  değerler atlanır. Fonksiyon da verilebilir: `(items) => değer`. Diğer
  değerler metin. Hesaplanan hücrede "Bu sayfadaki N kayıttan hesaplandı"
  açıklaması; geliştirmede kısayola benzeyip uymayan değer için konsol uyarısı.
  Simple CRUD footer'ında toplam, ortalama, en büyük, sayım ve fonksiyon örneği.
- DataTable: çoklu sıralama. Başlıkta Ctrl/⌘ + tıklama (ya da Ctrl+Enter/Space)
  diğer kolonların sıralamasını korur: yoksa sona ekler (artan) → azalan →
  çıkarır; düz tıklama yalnızca o kolon. Sıralama metni PocketBase biçiminde
  (`-number_optional,text_required`), sunucuda değişiklik gerekmez. Birden çok
  kolonda okun yanında öncelik numarası; `aria-sort` birincil kolonda, diğerleri
  ekran okuyucu metniyle. `dt.parseSort/formatSort/nextSort/isValidSort`.
- Simple CRUD: `sort` yalnızca izin verilen alanlarla (`SORTABLE_FIELDS`,
  `isValidSort`): formda olmayan iç alana göre sıralayarak bilgi sızdırılamaz.
  Liste elle yazılmaz; `createFormSchema` alanları + `id`, `created`,
  `updated`'tan türetilir.
- Dokümantasyon: `docs/d01_datatable_2026-11-22.md` (DataTable: özellikler,
  kullanım örnekleri, kritik bilgiler, tarifler). Belge adları tarihli:
  `d00_core.md` → `d00_core_2026-10-27.md`; her belgenin başında tarih, sürüm,
  commit ve sonraki değişiklikler için `git` komutları. README belge tablosu
  güncellendi.
- Playwright uçtan uca testleri (`npm run test:e2e`, `tests/e2e`): giriş,
  DataTable hücre gezinmesi, seçim, drawer sonrası ve silme sonrası odak.
  Silme testi kendi `seed-e2e-…` kayıtlarını oluşturup siler.
- DataTable: `dt.createList()` (`ListState`) ile filtre, sayfalama, sıralama
  ve sorgu tek yerden yönetiliyor; `autoLoad: false` ile ilk yüklemede istek
  atılmıyor. Tablo `list={list}` ile bağlanıyor.
- DataTable: kolon `type` alanı (`text`, `number`, `bool`, `date`,
  `datetime`, `list`, `json`, `actions`) ve tipe göre değer gösteren
  `dt.Value` bileşeni. Tip verilmezse değerden tahmin ediliyor.
- DataTable: varsayılan başlık/hücre/alt satırlar ve `actions` snippet'i;
  sayfada satır snippet'i yazmak gerekmiyor.
- DataTable: alt barda kayıt aralığı, ayrı "sayfa başına" seçici ve tablo
  ayarları popup'ı (kenarlık: yok/yatay/dikey/ikisi, sabit kolonlar,
  varsayılana dön). `borders` prop'u eklendi.
- DataTable: `--dt-*` tema değişkenleri; açık/koyu temaya uyumlu renkler.
- Lucide sıralama ikonları (`sort_none`, `sort_asc`, `sort_desc`).
- Form: `<button type="reset">` ile formu sıfırlama (create: boşaltır,
  update: veritabanı değerine döner). Başarılı gönderimden sonra form
  "değişiklik yok" durumuna dönüyor.
- `createHashDrawer()`: URL hash'ine bağlı drawer durumu ve kaydedilmemiş
  değişiklik onayı.
- Toaster: `success()` ve `error()` kısayolları.
- Confirm: `title` ve `danger` seçenekleri, yeni tasarım.
- Ayarlar › Sistem › Uygulama sayfası: `sys_settings` koleksiyonunda
  `application_name` için tek sayfa form örneği (koleksiyon migration'ları
  ve tipleri dahil).
- Simple CRUD: "view" drawer'ı kaydı salt okunur gösteriyor.
- GEÇİCİ: Simple CRUD sayfasında 10.000 test kaydı ekleme/silme butonları
  (`seedRecords`, `deleteSeedRecords`).

### Değişti

- Uygulama sürümü `v0.2.0-alpha.181` oldu.
- DataTable klasörü düzenlendi: temel bileşenler kökte; durum sınıfları
  `state/`, saf yardımcılar `utils/` (`sort`, `footer`, `format`), düzenleyici
  `parts/CellInput.svelte`. Sunucudan `sort.js` artık
  `#lib/components/ui/datatable/utils/sort.js` yolundan alınır.
- DataTable: `list` zorunlu ve tek veri kaynağı. Eski `query`, `sort`, `onSort`,
  `onPagination` prop'ları ve tek kayıt döndüren sorgu desteği kaldırıldı;
  sıralama `list.setSort`, sayfalama `list.paginate` ile yapılıyor.
- `tooltip` attachment: eleman başına 4 dinleyici yerine belge düzeyinde tek
  dinleyici seti (olay delegasyonu, `WeakMap` kaydı). API aynı. 30 satırlık
  tablo sayfasında dinleyici sayısı 427 → 124.
- DataTable: Intl biçimlendiricileri önbellekte (`format.ts`: `numberFormat`,
  `dateFormat`); `toLocaleString` ve `new Intl.…` her hücrede yeni
  biçimlendirici kuruyordu. Kaydırma adımı başına script %10–17 azaldı.
- DataTable: `DataCell` artık ek HTML attribute'u (spread) almıyor; yalnızca
  `dr`, `dc`, `class`, `editable`, `children`. Spread her güncellemede hücrenin
  tüm attribute'larını yeniden kurduruyordu (script %4–14, bellek ayırma %15
  daha az).
- DataTable: sanal kaydırmada değişmeyen satırlar önceki nesnelerini koruyor;
  yalnızca yuvaya giren satır güncelleniyor (önceden her adımda penceredeki tüm
  satırların hücreleri yeniden hesaplanıyordu). Kaydırma adımı başına script
  süresi ~10,6 → ~2,6 ms (dev ölçümü).
- DataTable: sanal kaydırmada satırlar yeniden kullanılıyor. Satırlar kayıt
  id'si yerine pencere içindeki yuvayla anahtarlanıyor ve pencere hep aynı boyda.
  Kaydırırken satır bileşenleri ve DOM düğümleri yeniden oluşturulmuyor, yalnızca
  gösterdikleri kayıt değişiyor. 1000 satırı baştan sona kaydırmak eskiden
  yaklaşık 35 bin düğüm oluşturuyordu, şimdi hiç oluşturmuyor (bellek
  dalgalanması ve GC yükü düştü). Aktif satır pencereden çıkınca kendi yuvasında
  sabitleniyor. Satırlarda `data-row-id`, satır/başlık/footer'da `aria-rowindex`
  var. Kendi `dataRow` snippet'inde satır içinde `$state` tutulmamalı.
- `.claude` klasörü artık git ile takip edilmiyor.
- Simple CRUD sayfası bileşenlere taşındı (319 → ~200 satır, script ~60 satır).
- DataTable: kolonlar props'tan reaktif okunuyor; kullanıcı ayarları
  (genişlik, gizleme, freeze, kenarlık) ayrı tutuluyor. `helpers.setMainProps`
  yerine `setColumnProp`, `setFreeze`, `setBorders`, `resetLayout`.
- DataTable: başlık yüksekliği 42px; başlık sayfa zemininden ayrışıyor.
  Freeze sınırı 2px çizgi. `devTools` prop'u kaldırıldı.
- Sayfa şablonu: `Page.Header` araç çubuğu görünümü, `Page.Main.Table`
  kenarlıklı tablo kartı.
- DataTable: `width` verilmeyen kolon tipine göre varsayılan `minmax`
  genişliği alıyor (`dt.DEFAULT_COLUMN_WIDTHS`; örn. text
  `minmax(120px,1fr)`, bool `minmax(70px,0.5fr)`). Eskiden sabit 150px'ti.
- DataTable: genişletme tutamağı başlığın üzerine gelince soluk görünüyor;
  yuvarlak uçlu, üst/alt/sağdan 2px boşluklu, tutma alanı 8px.
- DataTable: `date` ve `datetime` kolonlar da `number` gibi varsayılan olarak
  sağa dayalı (`align` ile değiştirilebilir).
- DataTable: alt bar ilk veri gelene kadar iskelet gösteriyor; kayıt aralığı,
  sayfalama, kolonlar ve ayarlar birlikte geliyor, bar yüksekliği değişmiyor.
- DataTable (performans): kolon genişletme karede bir kez uygulanıyor ve
  sürükleme boyunca yalnızca grid şablonu değişiyor (hücreler yeniden
  hesaplanmıyor); genişlik bırakınca kaydediliyor. Pointer capture ile window
  dinleyicileri kaldırıldı.
- DataTable (performans): kolon yerleşimi (freeze, ofset, hizalama) kolon başına
  bir kez hesaplanıyor (`columnLayout`); hücre başına derived sayısı ~10'dan 2'ye
  indi. Satır tıklaması hücre başına dinleyici yerine grid'de tek dinleyiciyle.
- DataTable: `persist="anahtar"` prop'u ile kullanıcı ayarları (genişlik,
  gizleme, freeze, kenarlık, yoğunluk) localStorage'da saklanıyor; varsayılana
  dönünce kayıt siliniyor. Simple CRUD tablosunda açık.
- DataTable: yoğunluk seçimi (sık 40px / normal 48px / rahat 56px); ayarlar
  popup'ında ve `density` prop'u ile. Varsayılan "sık" (satır 35px → 40px).
  Başlık yüksekliği 42px → 44px (en sık satırdan yüksek kalsın diye), alt
  satır 35px → 40px.
- DataTable: sıralama ikonu başlık hizasını bozmuyor (sağa dayalı kolonda
  ikon solda, ortalıda absolute); hücre ve alt satırda `tabular-nums`.

### Düzeltildi

- `tooltip`: eleman DOM'dan kalkarken tooltip'i açıksa gizleniyor (ekranda
  takılı kalabiliyordu).
- e2e: `createRecord` çekmecenin kapanmasını da bekliyor (kapanma animasyonu
  sırasında sayfa inert olduğu için arama kutusuna yazılan metin kayboluyordu).
- DataTable: satır silinince, silinen kaydın yuvasına geçen sonraki kaydın
  butonunda odak kalmıyor; odak grid'e dönüyor (yanlış kaydı silme riski).
- DataTable: arama ve "sayfa başına" değişince 1. sayfaya dönülmüyordu.
- DataTable: `requestAnimationFrame` döngüsü boştayken de sürekli çalışıyordu.
- DataTable: `align` ayarları uygulanmıyordu; koyu temada freeze gölgesi
  ve mesaj kartı görünmüyordu; Pagination sabit renkler kullanıyordu.
- View drawer'ında uzun liste/dosya değerleri yatay scroll oluşturuyordu.
- DataTable: freeze ofseti `minmax(...)` genişlikli kolonlarda yanlıştı
  (150px varsayıyordu). Artık başlık hücreleri `ResizeObserver` ile ölçülüyor.
- DataTable (sanal kaydırma): veri azalınca (örn. son sayfa) aralık hesabı
  ilk satırlara dönüp boş alan gösterebiliyordu. Görünen aralık artık
  `$derived`; veri değişince ek `tick` zinciri olmadan yeniden hesaplanıyor.
- DataTable: sayfa/sıralama/arama değişince tablo en üste kaydırılıyor;
  aynı sorgunun tazelenmesinde (silme sonrası vb.) konum korunuyor.
- DataTable: daralan kolonda footer metni üç noktayla kısalmıyordu (flex
  kutusundaki çıplak metne `text-overflow` uygulanmaz; metin kendi kutusunda).
- DataTable: alt bardaki aralık özeti daralınca üç noktayla kısalmıyor ve
  "N seçili" bilgisinin altına giriyordu. Özet blok kutu oldu (`…` çıkar) ve
  seçim bilgisinden sonraya alındı; tam metin `title`'da.
- DataTable: ortalı ve sıralanabilir başlık (örn. bool) daralınca hücre 64px'in
  altına inmiyor, kolonun dışına taşıyor ve genişletme tutamağı görünmez
  oluyordu. İkon boşluğu hücreden içeriğe alındı; dar hücrede CSS container
  query ile boşluk kalkar, ikon metnin yanına geçer.
- DataTable: genişletirken 50px'in altına inilince kolon son değerde
  takılı kalıyordu; artık 50px'e sabitleniyor.
- DataTable: sayfalama butonlarına art arda tıklayınca her tıklama ayrı istek
  atıyordu (öncekiler iptal edilmeden). İstek sürerken sayfalama, "sayfa
  başına" ve sıralama kilitleniyor; `ListState.paginate`/`setSort` da istek
  bitmeden yeni istek başlatmıyor.
- Simple CRUD: "Ara" butonu istek sürerken de kullanılabiliyor; "Yenile"
  butonu istek sürerken devre dışı.
- Simple CRUD: düzenleme drawer'ı tek tıklama yerine çift tıklama ya da Enter
  ile açılıyor (tek tıklama hücreyi seçer).
- Toggler: kapsayıcının `container` sınıfı Tailwind'in `.container`
  (`width: 100%`) sınıfıyla çakışıyordu; DataTable alt barında "sayfa başına",
  "Kolonlar" ve ayarlar butonları sağa dayanmıyor, aralarında boşluk
  oluşuyordu. Sınıf `slc-toggler` oldu. Kapsayıcı artık tetikleyici kadar
  geniş; tam genişlik için `--container-width="100%"` (Select bunu kullanıyor,
  açılır liste yine kutuyla aynı genişlikte).

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
