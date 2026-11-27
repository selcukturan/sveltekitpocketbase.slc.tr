<!-- markdownlint-configure-file { "MD024": { "siblings_only": true } } -->

# Değişiklik Günlüğü

Bu projedeki önemli değişiklikler bu dosyada tutulur.

Biçim [Keep a Changelog](https://keepachangelog.com/tr-TR/1.1.0/) yapısını temel alır.
Sürüm numaraları `src/lib/app/config.ts` içindeki `version` alanını izler
(`v0.2.0-alpha.N`). Ara sürümlerin çoğu yalnızca sürüm artırımı olduğu için
kayıtlar konu başlıklarına göre gruplanmıştır.

## [Yayınlanmamış]

### Eklendi

- Kaynak ve işlem düzenleme ekranı (Aşama 3e, Ayarlar → Sistem → Kaynaklar):
  kaynaklar tablosu (ağaç sırası; ad, ikon, adres, eşleşme, sıra, aktif, gizli
  hücrede; üst kaynak ve işlemler drawer formunda; anahtar ve tür oluşturulduktan
  sonra sabit) ve işlemler tablosu (ad, sıra, kullanım). Kurallar sunucuda
  (`checkResource`): adres gerçek bir sayfa olmalı (`server/routes.ts`,
  `import.meta.glob`), tür/ağaç kuralları, modülde ikon, sayfa ve özellikte
  erişim işlemi; alt kaynağı olan kaynak, `access` ve kullanılan işlem
  silinemez. Yazmalar batch API ile; menü aynı yanıtta tazelenir. Migration
  `1795740005`: `settings.system.resources` (Herkes → erişim, görüntüleme;
  Admin, Super Admin → oluşturma, güncelleme, silme). Testler:
  `acl-resources.spec.ts`; ortak yardımcılar `tests/e2e/helpers/pb-admin.ts`.
- Yetki ekranı (Aşama 3d, Ayarlar → Sistem → Yetkiler): özne seçimi (Herkes,
  rol, kullanıcı), kaynak × işlem matrisi; hücreye tıklamak durumu değiştirir
  ve kaydeder (kullanıcı: Belirtilmemiş → İzin → Engel; rol ve Herkes:
  Belirtilmemiş ↔ İzin). Belirtilmemiş hücrede etkin sonuç önizlenir
  (`resolvePermissions` tarayıcıda). `getPermissionData` (`view`),
  `setPermission` (`update`; işlem kaynakta tanımlı olmalı, engel yalnızca
  kişisel). Üst çubukta bildirimler ve dil düğmesi `app.notifications` /
  `app.language` iznine bağlı. Migration `1795740004`: admin ve üstü roller
  kullanıcıları listeleyebilir; `settings.system.permissions` kaynağı (Herkes →
  erişim, görüntüleme; Admin, Super Admin → güncelleme). Testler:
  `acl-admin.spec.ts` (geçici yönetici ve hedef kullanıcıyla: kişisel engel
  sunucuda 403, menü budanması, rolde engel yok).
- Yetkinin uygulanması (Aşama 3c): sunucuda `getAcl()` (istek başına bir kez,
  kullanıcının oturumuyla) ve `requirePermission(key, action)` (oturum yoksa
  girişe yönlendirir, izin yoksa 403); istemcide `getMyAccess()` query'si.
  Menü veritabanından (`buildAppMenu`; başlık `menu.<key>` çevirisi, yoksa
  `label`); raydaki modül bağlantısı ilk erişilebilen sayfaya gider; erişilemeyen
  ya da kaynağı olmayan sayfada sayfa yerine 403 görünümü (`Forbidden`).
  Simple CRUD remote'ları işlem bazında (`list`, `view`, `create`, `update`,
  `delete`), uygulama ayarları `view` / `update` denetler; düğmeler `can()` ile
  gizlenir, güncelleme izni yoksa hücreler düzenlenemez. Migration
  `1795740003`: Herkes → her kaynağın tanımlı tüm işlemleri (bugünkü davranış
  korunur). Testler: `acl-ui.spec.ts`.
- Yetki çekirdeği (Aşama 3b, saf: `src/lib/app/acl/access.ts`):
  `resolvePermissions` (kişisel satır rolü ezer; aktif rollerden biri allow;
  rol deny'ı yok sayılır; Herkes; varsayılan kapalı; access yoksa diğer
  işlemler yok; developer/system her şeye izinli), `can`,
  `findPageResource` / `canAccessPage` (birebir, sonra `prefix`; kaynağı
  olmayan sayfa kapalı), `buildAccessMenu`. `tree.ts`: `pruneTree`,
  `firstHref`. Testler: `acl-access.spec.ts` (tarayıcısız); gerçek veriyle
  `(app)` altındaki her sayfanın bir kaynakla eşleştiği ve demo kullanıcının
  hepsine eriştiği (`acl-data.spec.ts`).
- Yetki sistemi (Aşama 3a, veritabanı): `acl_actions` (işlem kataloğu),
  `acl_resources` (menü ve uygulama özellikleri; ağaç), `acl_permissions` (bir
  satır = kaynak + işlem + rol/kullanıcı/Herkes + allow/deny; tekil hücre,
  cascade). Okuma giriş yapmış kullanıcı (izinlerde yalnızca kendi, rolleri ve
  Herkes satırları), yazma yönetici rolleri. Tohum verisi: 7 işlem, menüdeki
  sayfalar + `app.language`, `app.notifications`; her sayfaya Herkes → erişim
  (bugünkü davranış). Migration'lar `1795740001_created_acl.js`,
  `1795740002_initial_acl_data.js`; tipler yeniden üretildi.
- PocketBase hook: `label` ve `search_label` alanı olan her koleksiyonda
  `search_label` kayıtta `label`'dan üretilir (Türkçe arama); izinlerde
  `label` ilişkilerden ("Rol · Kaynak · İşlem"). Hook kopyası ile
  `normalizeStringForTurkishSearch` eşitliği testli (`search-label.spec.ts`).
  Yetki verisi testi: `acl-data.spec.ts`.
- Layout (Aşama 2): ekran boyutu `MediaQuery` ile (`global.screen`). Tablette
  ağaç içeriğin üstünde panel (varsayılan kapalı; gezinme, Esc, dışarı
  tıklama kapatır). Mobilde ray gizli, üst çubukta menü düğmesi, soldan
  drawer (`<dialog>`: modüller + seçili modülün ağacı). İçerik her boyutta
  aynı yerde: ekran boyutu değişince sayfa yeniden kurulmaz. Ağaç genişliği,
  gizli/açık durumu ve açık gruplar `localStorage`'da (`slc:layout`). Split
  pane bölücüsü klavyeyle (oklar, Shift, Home/End) taşınır, çift tık
  varsayılana döner, `role="separator"`. Testler: `navigation.spec.ts`.
- Menü: tek menü ağacı (`src/lib/app/menu/menu.ts`), ileride PocketBase
  koleksiyonuyla aynı biçimde (düz kayıtlar, `parent_id`, çeviri anahtarı
  başlıklar, `sort`). Kökler modül rayında, altı aktif modülün menü ağacında.
  `tree.ts` (saf): `buildTree`, `findActivePath` (en uzun eşleşme). Ağaç
  bileşeni `NavTree`: sınırsız derinlik, açılır/kapanır gruplar
  (`aria-expanded`), tercih modül değişince korunur. Testler:
  `menu-tree.spec.ts` (tarayıcısız; her menü bağlantısının sayfası var mı),
  `navigation.spec.ts`.
- DataTable: kopyalamadan sonra tablonun sağ üstünde "Kopyalandı"
  bildirimi (yukarıdan kayarak gelir, 2,5 sn sonra gider; kısmi kopyada uyarı
  renginde, 5 sn; `role="status"`). Simple CRUD sayfasındaki `onCopy` toast'ı
  kaldırıldı; `onCopy` ek iş için duruyor.
- Test: uygulama ayarları sayfası (`settings.spec.ts`): değişince düğmeler
  açılır, Sıfırla geri alır, kayıttan sonra form temiz (`markClean`), değer
  yenilemede kalıcı; eski ad geri yazılır. Yanlışlıkla eklenmiş geçici
  `zz-probe-tmp.spec.ts` kaldırıldı.
- DataTable: aktif satır (aktif hücrenin satırı) renkleniyor
  (`--dt-row-active`, primary %11): işlem yapılan satır gözle izlenir. Seçili
  satır ve hücre aralığı rengi bunun üzerinde.
- Form: `formInput.createFormSave({ list | updates, drawer, onSuccess, onError })`
  kaydetmeyi sayfadan alır: gönderim, sorguları tazeleme, drawer'ı onay
  sormadan kapatma, bildirim. `form.enhance(save)` olarak verilir. Simple CRUD
  ve uygulama ayarları sayfası kullanıyor.
- DataTable: `dt.createRowDelete({ list, remove, onSuccess, onError })` satır
  silmeyi sayfadan alır: onay sorusu, silme, listeyi tazeleme, silinenleri
  seçimden çıkarma, bildirim; `onKeyDown` (Delete tuşu) ve `targetsOf` (sağ
  tık hedefleri). `list.selected`: seçim listede tutulur
  (`bind:selected={list.selected}`). Simple CRUD tek silme komutu
  (`deleteRecords`) kullanıyor; `deleteRecord` kaldırıldı. Sayfada `columns`,
  `footers`, `onLoad` DataTable özelliklerinde.
- DataTable: `dt.createCellEdit({ list, table, save, onError })` hücre
  düzenlemeyi sayfadan alır: doğrulama (`validateCell`), anında gösterme
  (`list.updatesWith`), kaydetme, hata ve geçersiz yapıştırma bildirimi.
  Sayfada `{...cellEdit}` ile DataTable'a yayılır. Simple CRUD tek komut
  (`updateCells`) kullanıyor; `updateCell` kaldırıldı.
- FilterBar: aralık filtreleri `inputs/` bileşenleriyle (`Number`, `Date`,
  `Datetime`); native input kalmadı. Tarih-saat filtresi saat alıyor
  (`'YYYY-MM-DDTHH:mm'`, uygulama saat diliminde, bitiş dakikası dahil).
- `input.Number`: `nullable` (boş alan `null`; varsayılan 0). Tip buna bağlı:
  verilmezse değer `number`.
- Saat dilimi: `config.timezone` (uygulama saat dilimi, varsayılan
  `Europe/Istanbul`) ve saf `utils/timezone.ts` (duvar saati ↔ UTC, yaz saati
  geçişleri, gün aralığı). Tarih-saat alanları gerçek an olarak tutulur (UTC);
  form, tablo gösterimi, hücre düzenleme ve filtre bu saat dilimini kullanır,
  tarayıcınınkini değil. Başka bölgede kurulum yalnızca bu ayarı değiştirir.
- DataTable: `datetime` filtre türü (gün sınırları uygulama saat diliminde);
  `type: 'datetime'` kolonda `filter: true` artık bunu seçer. Simple CRUD
  tablosuna `datetime_optional` kolonu (sıralama, filtre, düzenleme).
- Testler: `timezone.spec.ts` (saf), `datetime.spec.ts` (tarayıcı New York'ta,
  sonuçlar İstanbul'a göre), `relation-value.spec.ts`.
- Testler: `form-inputs.spec.ts` (tüm form alanları: erişilebilir adlar,
  doğrulama, kaydet → güncelleme formunda geri okuma, sıfırla, değişiklik
  takibi, dosya sil/geri al, Select klavye/Esc, Bool, kaydedilmemiş değişiklik
  sorusu, Relation seçici, Türkçe ondalık ayracı) ve `file-input.spec.ts`
  (tür/boyut/adet kısıtları, tekli değiştirme, dışarıdan value, hata süresi).
- FilterBar: evet/hayır ve seçim filtreleri native `<select>` yerine
  `input.Select` kullanıyor (filtre panelinin içinde iç içe popover; seçim,
  Esc, dışarı tıklama e2e testiyle doğrulandı). `input.Select` `aria-label`
  alıyor.
- `input.Select`: liste kapalıyken Esc'yi tüketmiyor; üstteki popover ya da
  drawer Esc ile kapanabiliyor (önceden yutuluyordu).
- Şablonlar: `Page.Header.Table` (`Page.Header` içinde; children solda,
  `actions` snippet'i sağa yaslı), `Head` `title`/`description` alıyor,
  `formInput.ButtonGroup` ve `dt.RecordView` (kaydın alanları anahtar–değer).
  Simple CRUD sayfasında native HTML öğesi kalmadı.
- `defineTable`: `defaultSort` derleme zamanında denetleniyor. Tanımda olmayan
  ya da `sortable: true` olmayan alan ve tekrar eden alan editörde okunur bir
  mesajla hata veriyor:
  `"Geçersiz defaultSort: 'nam' tanımda yok ya da sortable: true değil"`.
  `editable: (row) => …` fonksiyonu olsa da çalışır.
  Çalışma zamanı denetimi de sürüyor. Tip testleri eklendi.
- DataTable: `defineTable` (`utils/table.ts`, saf). Kolonlar ve kolon başına
  izinler (`sortable`, `filter`, `edit` opt-in; satır kuralı `editable(row)`)
  tek tanımda; liste şeması (yalnızca sayfa, sayfa boyutu ≤ 1000, doğrulanmış
  sıralama, filtre), hücre düzenleme şemaları, `canEdit` ve filtreler buradan
  türer. Sayfa `columnsFor<Item>()` ile kolonları alır: tanımdaki alanlar
  `Item`'da yoksa derleme hatası; `override` sunumu ezer ve `editable`'ı
  daraltır, `prepend`/`append` istemci kolonu ekler, `order` sıralar.
  Filtre alanları etiket taşıyabilir (`FilterBar` tanımdaki etiketi kullanır).
- DataTable: filtreler. `defineFilters` (`utils/filter.ts`, saf) tek tanımdan
  doğrulama şeması, güvenli PocketBase filtresi (`toPb`, yer tutuculu) ve
  arayüz alanlarını üretir; türler: `text`, `number`, `date`, `bool`,
  `select`. `dt.FilterBar`: metin filtreleri satır içinde, diğerleri
  "Filtreler" panelinde (uygulanan filtre sayısıyla), Ara ve Temizle. Simple
  CRUD sayfası buna geçti; liste şemasındaki kullanılmayan serbest `filter`
  alanı kaldırıldı. e2e testi eklendi (`filter.spec.ts`).
- DataTable: sağ tık menüsü tabloda. `contextMenu(row)` snippet'i ve
  `dt.MenuItem` (`label`, `onclick`, `danger`, `disabled`). Konum (ekrana
  sığdırma), popover, ↑ ↓ Home End gezinme, Esc/dışarı tıklama/kaydırma ile
  kapanma ve odağın tabloya dönmesi tabloda. ContextMenu tuşu ya da Shift+F10
  aktif hücrede açar. Simple CRUD sayfasından ~50 satır menü kodu ve CSS kalktı.
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

- Belgeler: `d02_layout` yetki ekranı bölümü DataTable ve Select'e göre
  (düzenleme, kopyala-yapıştır, sıralı kayıt, batch API notu, testler);
  yapılacaklar listesinden "yetki ekranında DataTable ve Select" çıkarıldı.
- Yetki ekranı bizim bileşenlerimizle: özne seçimi `inputs/Select`, matris
  `DataTable` (kolonlar işlemlerden çalışma anında; hücrede açılır liste;
  Ctrl+C / Ctrl+V ile toplu izin, tek istek; geçersiz değer ve rol/Herkes'e
  engel `validateCell` ile reddedilir; optimistik ve sıralı kayıt; tablo
  ayarları açık, genişlikler sıfırlanabilir). Remote: `getPermissionSubjects`,
  `getPermissionMatrix` (etkin izinler sunucuda), `setPermissions` (PocketBase
  batch API). `getPermissionData` ve `setPermission` kaldırıldı.
- Belgeler: `d02_layout` yetki ekranı bölümü (3d), `sys_users` okuma kuralı,
  `acl-admin.spec.ts`; yol haritası 3d tamam, 3e sırada. Yeni
  `docs/yapilacaklar.md`: ertelenen işler (bildirimlerin sunucu kontrolü,
  yetki ekranında DataTable/Select, form, DataTable, veri).
- Belgeler: `d02_layout` menü verisi (veritabanından), yeni sayfa ekleme
  adımları (kaynak, izin, `menu.<key>`, `requirePermission`), yetkinin
  uygulanması bölümü (3c), testler; yol haritası 3c tamam, 3d sırada.
  `d00_core`: remote fonksiyonlarda `requirePermission`.
- Menü `menu.ts`'teki sabit listeden değil veritabanından (`acl_resources`)
  çizilir; `MENU` / `MENU_RECORDS` kaldırıldı. Menü çeviri anahtarları
  `menu_*` → `menu.<kaynak anahtarı>`.
- Layout: modüllerin dört `+layout.svelte` dosyası ve `layouts/page/`
  kaldırıldı; tek iskelet `app-layout` (üst çubuk · ray · ağaç · içerik). Alt
  menüsü olmayan modülde ağaç yok. Sayfada tek `<main>` (`Page.Main` artık
  `<div>`); ray ve ağaç adlandırılmış `<nav>`, üst çubuk `<nav>` değil.
  "Paneli Gizle" (odak modu) menü ağacının tercihine dokunmuyor; "Menüyü
  Gizle" modül değişince sıfırlanmıyor. Menü başlıkları çevriliyor.
- DataTable: hücreye tıklamak satırı seçmiyor (`single` modda da); satır
  seçimi yalnızca seçim kolonu ve klavyeyle (Space, Shift+Space, Ctrl+A).
- Belgeler: yetki bölümüne çekirdek fonksiyonlar tablosu, sıkı koruma testi;
  yol haritasında 3b tamam, 3c sırada; başlık alpha.221 / `d128ebd`.
- Belgeler: yerleşim belgesine "Yetki sistemi" bölümü (koleksiyonlar, etkin
  izin kuralı, başlangıç verisi, `label` / `search_label` ve Türkçe arama);
  yol haritası 3a–3e; başlık alpha.219 / `f902e5e`.
- Belgeler: yerleşim belgesi alpha.217 / `fba2ea8`: ekran boyutları, mobil
  drawer, tablet paneli, kalıcı tercihler, bölücünün klavye kullanımı;
  Aşama 2 tamam.
- Belgeler: yeni `d02_layout_2026-11-27.md` (iskelet, menü verisi, aktif yol,
  `NavTree`, gizleme, yeni sayfa/modül ekleme, erişilebilirlik, yol haritası);
  çekirdek belgeden bağlantı.
- Belgeler: DataTable belgesi alpha.213 / `e15b67d`; çekirdek belgede
  güncelleme notu alpha.213 ve gönderim akışı testleri (`form-inputs.spec.ts`,
  `settings.spec.ts`).
- Belgeler: çekirdek belgeye kural: `formInput.Form` kullanan sunucu `form`
  fonksiyonları başarıda bir değer döndürmeli (`form.result` → `markClean`);
  kalıcı çözüm (`onsave`, enhance Form'da) ertelendi, `Form.svelte`'de not.
  Tarih kuralı güncellendi: `Datetime` uygulama saat diliminde girilir ve
  gösterilir (`config.timezone`), `Date` UTC gece yarısı takvim günüdür.
- Belgeler: DataTable belgesi alpha.209 / `ccb587b`; kırıcı değişiklikler
  listesine `bind:range` ve `bind:selected`; "`bind:` yok, başlangıç prop'u +
  helper + callback" ilkesi.
- DataTable (kırıcı): `bind:selected` kaldırıldı; seçimin sahibi tablo.
  `selected` yalnızca başlangıç seçimi; değişiklik `table.helpers`
  (`getSelected`, `setSelected`, `deselect`, `clearSelection`), izleme
  `onSelectionChange`. `list.selected` kaldırıldı. `createRowDelete` seçimi
  tablodan okur: `createRowDelete({ list, table: () => table, … })`.
- DataTable (kırıcı): `bind:range` kaldırıldı; hücre aralığı özeti yalnızca
  `onRangeChange(info)` ile okunur. Türetilmiş değer artık effect içinde prop'a
  kopyalanmıyor (Svelte: "When not to use `$effect`"). Projede kullanan sayfa
  yoktu.
- Belgeler: DataTable belgesi alpha.206 / `2fa46c9`; aktif hücre ve satırın
  nasıl güncellendiği (`cursor.activeRow`, `data-active-row`), `onRowClick`
  satırı seçmez.
- Belgeler: CHANGELOG'daki satıra bölünmüş kod parçası tek satıra alındı
  (Prettier uyarısı).
- Form Number: geçersiz ya da yarım metin (`123.`, `-`, `1-2`) yazarken hata
  göstermiyor; hata alandan çıkınca ya da gönderimde görünür, metin düzelince
  hemen kalkar. Gönderimde koruma aynı (`NaN` → "geçerli bir sayı girin").
- Belgeler: çekirdek belgede gönderim akışı `createFormSave` ile; Number
  geçersiz metin davranışı.
- Number: nokta → yerel ondalık ayracı çevirme (`autoChangeDecimalSeparator`)
  tutarsız çalıştığı için kaldırıldı; ayracı tarayıcı yönetir.
- Belgeler: DataTable belgesine `createRowDelete` bölümü ve `list.selected`;
  örnekler yeni kullanıma göre; başlık alpha.202 / `78d08a8`. Çekirdek
  belgede `command` örneği `deleteRecords({ ids })`.

- Uygulama sürümü `v0.2.0-alpha.193` oldu.
- Belgeler: DataTable belgesi `docs/d01_datatable_2026-11-26.md` oldu (tarih,
  sürüm, commit; örnek sayfalar, test listesi, `defineTable` yönlendirmesi,
  `sortable` varsayılanı, sınırlar). `d00_core` belgesine güncelleme notu ve
  güvenlik kuralları (istemci parametreleri yayılmaz, `pb.filter` yer
  tutucuları, ilişki koleksiyonu izin listesi) eklendi; README bağlantısı.
- Simple CRUD varsayılan sıralaması `-number_optional,text_required` (önce
  sayı azalan, sonra metin artan); kullanılmayan `relationListParamsSchema`
  kaldırıldı. Sıralama testleri varsayılan sıralamadan bağımsız hâle getirildi
  (kolon, düz tıklamayla tek başına istenen yöne getirilir).
- Belge: "Tablo tanımı (`defineTable`)" bölümü; Filtreler, Hücre düzenleme ve
  Sıralama bölümleri tanıma bağlandı. Testler: `table.typetest.ts` (derleme
  zamanı güvenceleri, `npm run check`) ve `table-def.spec.ts` (eklenen kolon
  sıralanmaz, override ile gizlenen kolon menüden açılır).
- `/app/data-table`: kolonlar `TABLE.columnsFor<Item>()` ile; seçim kolonları
  `override` ile gizli (aynı 7 kolon görünür, etiketler çevrili).
- Simple CRUD: kolonlar, sıralama, filtre ve hücre düzenleme izinleri
  `page.shared.ts`'teki tek `TABLE` tanımından (`SORTABLE_FIELDS`, `FILTERS`,
  elle yazılmış `listParamsSchema` / `cellEditSchema` kalktı). Sıralanabilir
  alanlar artık yalnızca `sortable: true` işaretli kolonlar. Sayfa kolonları
  `TABLE.columnsFor<Item>()` ile alıyor; FilterBar etiketleri tanımdan.
  Kolon etiketleri çevrildi (`dt_number_optional`, `dt_bool_optional` …).
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

- Testler: paralel çalışan yetki testleri birbirinin kolon sırasını
  kaydırmasın (test işlemi en sona eklenir); `acl-data` yönetici-yalnız işlem
  istisnaları tek listede.
- Yetki ekranında toplu kayıt: paralel tekil `create` istekleri PocketBase JS
  SDK'sının otomatik iptaline takılıyordu (yalnızca sonuncusu kaydediliyordu);
  batch API'ye geçildi. Aynı hücre art arda değişince istekler ters sırada
  varıp eski değeri bırakabiliyordu; kayıtlar sıraya alındı.
- Testler: `acl-admin` kolonları başlık adından bulur (işlem listesi
  değişebilir); `acl-data`'daki "demo yazamaz" denemesi yazabilirse kaydı siler.
- Şablonlardaki `boundary` (`Page`, `Page.Main.Panel`,
  `DrawerFormContent.Content`…) artık ortak `Boundary` bileşenini kullanır:
  içerideki bir await hata verirse (ör. 403, silinmiş kayıt) hata yalnızca o
  alanda "Tekrar dene" ile gösterilir; sayfa kök hata sayfasına düşmez.
- `buildTree` dönüş tipi ikonu olmayan kayıtlarda `{}` oluyordu (ağaç
  `pruneTree`'ye verilemiyordu); başlık ve ikon tipleri parametre.
- Kayıt seçici araması Türkçe terimi normalize etmiyordu ("WİNDOWS" sonuç
  vermiyordu); terim `search_label` ile aynı biçime getiriliyor. Üç yapay
  `sleep(300)` beklemesi kaldırıldı.
- Split pane: sürükleme bitince pointer capture bırakılmıyordu (yeniden
  alınıyordu).
- Number: yazarken metin ara sıra siliniyordu ('12.5' → 5 ya da 125).
  Svelte'in `bind:value` işleyicisi async modda geç çalışıp eski değeri
  input'a yazıyordu; değer artık `oninput` ile elle yönetiliyor.
- DataTable: tarih-saat Türkçe'de günü tek haneli gösteriyordu
  (`2.09.2026 02:00`). Gün, ay, saat ve dakika her dilde iki haneli
  (`02.09.2026 02:00`).
- `formInput.Number`: geçersiz metin (`1-2`, `5--`) tarayıcıda boş değer
  verdiği için forma sessizce 0 gidiyordu. Gönderilen değer gizli input'tan:
  geçersizse `NaN` → "Lütfen geçerli bir sayı girin." (yazarken ve gönderirken).
- `input.Number`: nokta → yerel ayraç dönüşümü önce engelleyip sonra
  ekliyordu; ekleme (`execCommand`) başarısız olunca ayraç kayboluyordu
  (`12.5` → 125). Artık yalnızca ekleme başarılıysa engelleniyor.
- FilterBar: panelde Enter arıyor ama paneli kapatmıyordu (odak "Filtreler"
  düğmesine dönünce aynı Enter düğmeye basıp paneli yeniden açıyordu).
- Tarih-saat formda UTC duvar saati olarak tutuluyordu (02:00 → `02:00Z`),
  tablo ise yerel saate çevirip 05:00 gösteriyordu; hücre düzenleme de
  tarayıcı saat dilimini kullanıyordu. Hepsi uygulama saat diliminde.
- Tarih (date) tabloda tarayıcı saat dilimiyle biçimleniyordu; UTC'nin
  gerisindeki bölgelerde bir gün önce görünürdü. Artık her yerde aynı gün.
- `input.Relation`: dışarıdan atanan değerin etiketleri yüklenmiyordu ("veri
  yok"); yalnızca önbellekte olmayan id'ler sunucudan okunuyor, bulunamayanlar
  tekrar sorulmuyor.
- `input.Select`: formda adını alan etiketinden alıyor (düğme kendine
  `aria-labelledby` veriyordu, ekran okuyucu seçili değeri okuyordu).
- `input.Button`: `iconOnly` düğmede `label` ad ve ipucu olarak kullanılıyor;
  çekmece ve bildirim kapat düğmelerine ad verildi. `dt.ActionButton` adlı.
- Relation seçici: arama kutusu etiketli, seçilenlerdeki ✕ düğmeleri adlı.
- `input.File`: arka arkaya iki hatada ilk zamanlayıcı ikinci mesajı erken
  siliyordu; hata mesajı `role="alert"`. Alan hataları `role="status"`, form
  hataları `role="alert"` ile duyuruluyor.
- `datatable.spec.ts` Ctrl+V testi satır sırasına bağlı değil (varsayılan
  sıralama tazelemede satırların yerini değiştirebiliyordu).
- `relations.remote.ts` (kayıt seçici): filtre enjeksiyonu kapatıldı. Arama
  ve id değerleri filtre metnine yazılıyordu (`search_label ~ "…"`); tırnakla
  filtreden çıkılabiliyordu (örn. `" || id != "` tüm kayıtları döndürüyordu).
  Değerler artık `pb.filter` yer tutucularıyla gidiyor. Koleksiyonlar yalnızca
  ilişki hedefleriyle sınırlandı (önceden `sys_users`, `sys_settings`,
  `acl_roles` dahil `_` ile başlamayan her koleksiyon açıktı); `ids` en fazla
  100, id ve arama uzunluğu sınırlı. Kullanılmayan `getRelationView` uç
  noktası kaldırıldı. e2e testi eklendi (`relation.spec.ts`).
- Simple CRUD `getOne`: istemci `options.expand` / `options.fields`
  göndererek ilişkili koleksiyonları açabiliyordu; şema artık yalnızca `id`
  (boş olamaz) ve `timestamp` kabul ediyor.
- Simple CRUD `getList`: istemci `options.expand` / `options.fields`
  göndererek ilişkili koleksiyonları açabiliyordu; liste şeması artık yalnızca
  sayfa, sayfa boyutu (≤ 1000), sıralama ve filtre kabul ediyor.
- Hücre düzenlemede satır kuralı (`editable(row)`) sunucuda da denetleniyor
  (`TABLE.canEdit`; kuralı olan alanlarda kayıt okunur, 403).
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

- Simple CRUD: geçici test verisi butonları ("+10.000 test", "Testleri sil")
  ve `seedRecords` / `deleteSeedRecords` komutları.
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
