# Yapılacaklar

Ertelenen işler ve açık konular. Bir iş yapılınca buradan silinir (geçmişi `CHANGELOG.md` ve git'te kalır). Yeni madde eklerken **neden** ertelendiğini ve **nereye** dokunulacağını yazın.

## Yetki

### Bildirimler sunucuda engellenmiyor

- **Durum:** `app.notifications` izni yoksa üst çubukta bildirim düğmesi görünmüyor (`app-header.svelte`, `can()`), ama sunucu tarafı kontrol etmiyor. İzni olmayan kullanıcı remote fonksiyonları doğrudan çağırarak bildirimlerini okuyabilir ve işaretleyebilir.
- **Yapılacak:** [`notifications.remote.ts`](../src/lib/remotes/notifications.remote.ts)'te `notificationsBG` (canlı akış) ve komutlarda (`updateNotificationReadStatus`, `removeNotification`, `markAllNotificationsRead`, `removeAllNotifications`) `requirePermission('app.notifications')`.
- **Neden ertelendi:** bildirim akışı hassas (bileşen yok olurken kapatma, 240 sn yeniden bağlanma, oturum yenileme istisnaları). Akış içinde 403'ün istemcide nasıl karşılanacağı (yeniden bağlanma döngüsüne girmemesi) ayrıca denenmeli.
- **Test:** geçici kullanıcıya kişisel `deny` (bkz. `acl-admin.spec.ts`), akışın açılmadığı ve komutların 403 döndüğü.

### İzin değişikliklerinin açık oturumlara yansıması (Aşama 4c)

- **Durum:** güvenlik günceldir (`requirePermission` her istekte okur); yalnızca arayüz (menü, düğmeler, sayfa koruması) sayfa yenilenene kadar eski izinle çizilir.
- **Plan (2026-11-28'de konuşuldu, ertelendi):**
  - Sunucu: `accessChanges` canlı sorgusu (`query.live`), kullanıcının kendi PocketBase oturumuyla `acl_permissions`, `acl_resources`, `acl_actions`, `acl_roles` ve kendi `sys_users` kaydına abone. PocketBase olayları okuma kurallarına göre süzer: normal kullanıcıya yalnızca kendi, rollerinin ve Herkes satırları gelir. Olaylar ~300 ms biriktirilip tek sinyal.
  - İstemci: `app-layout`'ta tek dinleyici; sinyalde `getMyAccess().refresh()` (senkron `.current` okunduğu için güvenli). Ek olarak sekme odaklanınca bir kez tazele.
  - Bildirim akışının kuralları: bileşen kapanınca akışı kapat, 240 sn'de yeniden bağlan, arka plan çağrısını oturum yenileme istisnasına ekle (`authRefresh.ts`).
  - Bulunulan sayfanın erişimi kalkarsa hemen 403 görünümü + "Yetkileriniz güncellendi" bildirimi.
  - Sınır: normal kullanıcı rolleri okuyamadığı için rolün pasif yapılması canlı gelmez (odaklanmada yakalanır).
  - Test: iki tarayıcı oturumu; superuser hedefe engel yazar, hedefin açık sayfasında yenilemeden menü bağlantısı kaybolur ve sayfa 403 olur.

### Diğer

- **`getAcl()` önbelleği yok:** her korunan remote çağrısında PocketBase'e 4 okuma. Gerekirse kısa süreli (ör. 30 sn) kullanıcı bazlı önbellek; yetki ekranındaki yazma önbelleği temizler.
- **İzin değişikliği açık oturumlara yansımıyor:** menü ve düğmeler sayfa yenilenene kadar eski kalır (sunucu kontrolü günceldir). Yol haritasında Aşama 4.

## Form ve girdiler

- **Form `markClean` effect'i:** kayıttan sonra formu temiz duruma döndüren `$effect` (`Form.svelte`) yerine bir `onsave` olayı. Bugünkü kullanım sorun çıkarmıyor; bekleniyor.
- **Geçersiz sayılar için filtre:** sayı girdisinde geçersiz metnin filtrede nasıl ele alınacağı.
- **Tarih (`date`) için öğlen UTC:** takvim günü gece yarısı UTC saklanıyor; saat dilimi kaymalarına karşı öğlen UTC seçeneği.
- **`getSingleRelationSelectedList` kaldırılması** (ilişki girdisi).

## DataTable

- **Ara sıra kırılan test (yük altında):** `form-inputs.spec.ts` "tüm alanlar kaydedilir…": Simple CRUD'da metin filtresiyle arama yapılınca liste süzülmemiş geliyor (1 yerine 30 satır). Tam suite'te nadiren (2026-11-28'de iki kez), tek başına hiç. Filtre uygulanmadan aramanın gitmesi ya da yeni sorgunun eski sorgunun sonucunu göstermesi olabilir; incelenmeli.
- **Hücre düzenleme 2. ve 3. adımlar** (`docs/d01_datatable`).

## Veri

- **`search_label` toplu yeniden hesaplama:** hook'tan önce oluşturulmuş kayıtlarda `search_label` boş ya da eski olabilir. `demo_crud`'daki kayıtların `updated` tarihi değişmesin diye toplu güncelleme yapılmadı.
