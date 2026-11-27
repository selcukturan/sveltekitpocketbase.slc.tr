# Yapılacaklar

Ertelenen işler ve açık konular. Bir iş yapılınca buradan silinir (geçmişi `CHANGELOG.md` ve git'te kalır). Yeni madde eklerken **neden** ertelendiğini ve **nereye** dokunulacağını yazın.

## Yetki

### Bildirimler sunucuda engellenmiyor

- **Durum:** `app.notifications` izni yoksa üst çubukta bildirim düğmesi görünmüyor (`app-header.svelte`, `can()`), ama sunucu tarafı kontrol etmiyor. İzni olmayan kullanıcı remote fonksiyonları doğrudan çağırarak bildirimlerini okuyabilir ve işaretleyebilir.
- **Yapılacak:** [`notifications.remote.ts`](../src/lib/remotes/notifications.remote.ts)'te `notificationsBG` (canlı akış) ve komutlarda (`updateNotificationReadStatus`, `removeNotification`, `markAllNotificationsRead`, `removeAllNotifications`) `requirePermission('app.notifications')`.
- **Neden ertelendi:** bildirim akışı hassas (bileşen yok olurken kapatma, 240 sn yeniden bağlanma, oturum yenileme istisnaları). Akış içinde 403'ün istemcide nasıl karşılanacağı (yeniden bağlanma döngüsüne girmemesi) ayrıca denenmeli.
- **Test:** geçici kullanıcıya kişisel `deny` (bkz. `acl-admin.spec.ts`), akışın açılmadığı ve komutların 403 döndüğü.

### Diğer

- **Yetki matrisinde ara sıra eski değer kalıyor:** tam test suite'inin yükünde (`acl-admin` "kişisel engel" testi; tam suite'te her çalıştırmada, tek başına hiç) hücre "Engel"den boşa çevrilince istek gidiyor, sunucu 200 ve doğru tazelenmiş matrisi dönüyor (hücre `null`), ama arayüz "Engel"i göstermeye devam ediyor. Tek başına ve tekrarlı çalıştırmada görülmedi. Şüphe: iyimser gösterim (`list.updatesWith` → `withOverride`) kalkmıyor ya da yanıttaki tazeleme yükte uygulanmıyor (DataTable / SvelteKit remote). Gerçek kullanımda sayfa yenilenince doğru değer görünür; incelenmeli.
- **`getAcl()` önbelleği yok:** her korunan remote çağrısında PocketBase'e 4 okuma. Gerekirse kısa süreli (ör. 30 sn) kullanıcı bazlı önbellek; yetki ekranındaki yazma önbelleği temizler.
- **İzin değişikliği açık oturumlara yansımıyor:** menü ve düğmeler sayfa yenilenene kadar eski kalır (sunucu kontrolü günceldir). Yol haritasında Aşama 4.

## Form ve girdiler

- **Form `markClean` effect'i:** kayıttan sonra formu temiz duruma döndüren `$effect` (`Form.svelte`) yerine bir `onsave` olayı. Bugünkü kullanım sorun çıkarmıyor; bekleniyor.
- **Geçersiz sayılar için filtre:** sayı girdisinde geçersiz metnin filtrede nasıl ele alınacağı.
- **Tarih (`date`) için öğlen UTC:** takvim günü gece yarısı UTC saklanıyor; saat dilimi kaymalarına karşı öğlen UTC seçeneği.
- **`getSingleRelationSelectedList` kaldırılması** (ilişki girdisi).

## DataTable

- **Hücre düzenleme 2. ve 3. adımlar** (`docs/d01_datatable`).

## Veri

- **`search_label` toplu yeniden hesaplama:** hook'tan önce oluşturulmuş kayıtlarda `search_label` boş ya da eski olabilir. `demo_crud`'daki kayıtların `updated` tarihi değişmesin diye toplu güncelleme yapılmadı.
