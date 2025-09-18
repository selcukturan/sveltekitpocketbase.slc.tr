/**
 * snapshot migration
 * 
 * ```bash
 * ./pb/pocketbase migrate collections
 * ```
 * - "Containers - Attach Shell"den yukarıdaki komut çalıştırılır. 
 *      Kod mevcut koleksiyonları ve yapılarını bir "snapshot" olarak kaydeder. 
 *      Oluşan dosya içeriği `1757071360_initial_snapshot.js` dosyasına aktarılır.
 * - `_initial_` orta ekine sahip dosyalar kurulum dosyalarıdır ve sıraları önemlidir. Başlangıç verileri içerirler.
 * - Temiz bir ilk kurulum için `_initial_` dosyaları haricindeki tüm dosyalar silinir.
 * - `_initial_` dışındaki dosyalar, geliştirme ve değişiklikler için kullanılan migration dosyalarıdır.
 * 
 * 
 * 
 * 1 - snapshot al
 * 2 - snapshot'ı 1757071360_initial_snapshot.js dosyasıntaşı
 * 3 - diğer migration dosyalarını sil
 * 4 - docker container'ını ve imajı sil
 * 5 - pb_data klasörünü boşalt
 * 6 - npm run pb komutunu çalıştır
 * 
 */
migrate((/* app */) => {
    // migrate up
    console.log(`initial snapshot created.`);
}, (/* app */) => {
    // migrate down
    console.log(`initial snapshot deleted.`);
}); 