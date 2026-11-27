# Yapılacaklar

Ertelenen işler ve açık konular. Bir iş yapılınca buradan silinir (geçmişi `CHANGELOG.md` ve git'te kalır). Yeni madde eklerken **neden** ertelendiğini ve **nereye** dokunulacağını yazın.

## Yetki

### Bildirimler sunucuda engellenmiyor

- **Durum:** `app.notifications` izni yoksa üst çubukta bildirim düğmesi görünmüyor (`app-header.svelte`, `can()`), ama sunucu tarafı kontrol etmiyor. İzni olmayan kullanıcı remote fonksiyonları doğrudan çağırarak bildirimlerini okuyabilir ve işaretleyebilir.
- **Yapılacak:** [`notifications.remote.ts`](../src/lib/remotes/notifications.remote.ts)'te `notificationsBG` (canlı akış) ve komutlarda (`updateNotificationReadStatus`, `removeNotification`, `markAllNotificationsRead`, `removeAllNotifications`) `requirePermission('app.notifications')`.
- **Neden ertelendi:** bildirim akışı hassas (bileşen yok olurken kapatma, 240 sn yeniden bağlanma, oturum yenileme istisnaları). Akış içinde 403'ün istemcide nasıl karşılanacağı (yeniden bağlanma döngüsüne girmemesi) ayrıca denenmeli.
- **Test:** geçici kullanıcıya kişisel `deny` (bkz. `acl-admin.spec.ts`), akışın açılmadığı ve komutların 403 döndüğü.

### Yetki ekranında DataTable ve Select (karar bekliyor)

Matris şu an düz `<table>` ve yerel `<select>` ile çizili. İkisi de bizim bileşenlerimizle yapılabilir.

- **DataTable:** satır = kaynak, kolon = işlem (kolonlar `acl_actions`'tan çalışma anında üretilir). Kazanç: klavyeyle gezinme, hücrede açılır liste (`options: İzin / Engel / Belirtilmemiş`), **kopyala-yapıştır ile toplu izin** (bir satırın izinlerini diğerlerine yapıştırmak, `onCellsEdit` → tek istekte toplu yazma), kaynak kolonunu dondurma, `persist`. Yapılacaklar:
  - DataTable verisini `createList` üzerinden bir remote query'den alır: matris satırları sunucuda üretilir (`getPermissionMatrix({ subject })`: satır başına kaynak, derinlik, hücre durumları ve etkin sonuç; aynı `resolvePermissions`).
  - Hücre içeriği `dataRow` / `dataCell` snippet'iyle: girintili kaynak adı, kendi durumu ya da soluk etkin sonuç. Kaynakta tanımlı olmayan işlem hücresi `DataCell editable={false}`.
  - Kayıt `createCellEdit` ile değil sayfaya özgü `onCellEdit` / `onCellsEdit` ile (kolonlar dinamik, `defineTable` şeması statik). Rol ve Herkes satırında `Engel` seçeneği yok.
  - Sınır: grup başlığı satırı yok ("Uygulama özellikleri" ayracı yerine bir `tür` kolonu ya da etiket).
- **Select:** düz `{ value, label }` listesi; optgroup ve arama yok (yalnızca baş harflerle atlama). Az kullanıcıda tek Select ("Rol: Admin 1", "Kullanıcı: …") yeterli. Kullanıcı sayısı artınca: tür seçimi (Herkes / Rol / Kullanıcı) Select, kullanıcı seçimi aranabilir `Relation` girdisi (`search_label`).

### Diğer

- **`getAcl()` önbelleği yok:** her korunan remote çağrısında PocketBase'e 4 okuma. Gerekirse kısa süreli (ör. 30 sn) kullanıcı bazlı önbellek; yetki ekranındaki yazma önbelleği temizler.
- **İzin değişikliği açık oturumlara yansımıyor:** menü ve düğmeler sayfa yenilenene kadar eski kalır (sunucu kontrolü günceldir). Yol haritasında Aşama 4.
- **Kaynak ve işlem düzenleme ekranı:** Aşama 3e (`docs/d02_layout`).

## Form ve girdiler

- **Form `markClean` effect'i:** kayıttan sonra formu temiz duruma döndüren `$effect` (`Form.svelte`) yerine bir `onsave` olayı. Bugünkü kullanım sorun çıkarmıyor; bekleniyor.
- **Geçersiz sayılar için filtre:** sayı girdisinde geçersiz metnin filtrede nasıl ele alınacağı.
- **Tarih (`date`) için öğlen UTC:** takvim günü gece yarısı UTC saklanıyor; saat dilimi kaymalarına karşı öğlen UTC seçeneği.
- **`getSingleRelationSelectedList` kaldırılması** (ilişki girdisi).

## DataTable

- **Hücre düzenleme 2. ve 3. adımlar** (`docs/d01_datatable`).

## Veri

- **`search_label` toplu yeniden hesaplama:** hook'tan önce oluşturulmuş kayıtlarda `search_label` boş ya da eski olabilir. `demo_crud`'daki kayıtların `updated` tarihi değişmesin diye toplu güncelleme yapılmadı.
