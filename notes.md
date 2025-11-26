**SLC Geliştirme Ortamı Komutları**

- Geliştirme ortamını ayağa kaldırma

```bash
npm run dev
npm run pb
```

- Geliştirme ortamını build etme ve ön izleme

```bash
npm run build
npm run preview
```

- Kök dizinde bulunan `docker-compose-local.yml` dosyasını ayağa kaldırma. (local production test)

```bash
npm run slc:production:docker
```

# Pocketbase tip çıkarımı

```bash
# Kurulum
npm install -D pocketbase-typegen
```

```bash
# Tip çıkarımı
npm run pb:typegen
```

# Pocketbase migrations

migrate collections komutu, manuel olarak yazmanıza gerek kalmadan mevcut collections yapılandırmanızın tam bir anlık görüntüsünü oluşturur. migrate create komutuna benzer şekilde, bu pb_migrations dizininde yeni bir geçiş dosyası oluşturacaktır.

```bash
./pb/pocketbase migrate collections
```

Varsayılan olarak collections anlık görüntüsü genişletme modunda içe aktarılır, yani anlık görüntüde bulunmayan koleksiyonlar ve alanlar korunur. Anlık görüntünün eksik koleksiyonları ve alanları silmesini istiyorsanız, oluşturulan dosyayı düzenleyebilir ve importCollections öğesinin son bağımsız değişkenini true olarak değiştirebilirsiniz.

# Paket güncellemeleri

```bash
# Kurulum
npm install -g npm-check
```

```bash
# Güncelleme
npm-check --update
```

# app z-index

- Drawer z-index >= 1000
- Confirm z-index >= 2000
- Toasts z-index = 4000

# Table Parent ID System

```sql
SELECT
  (ROW_NUMBER() OVER()) as id,
  t5.id AS region_id, t5.caption AS region,
  t4.id AS province_id, t4.caption AS province,
  t3.id AS district_id, t3.caption AS district,
  t2.id AS village_id, t2.caption AS village,
  t1.id AS location_id, t1.caption AS location
FROM acl_perms_region t1
  JOIN acl_perms_region t2 ON t1.parent_id = t2.id AND t2.status="active"
  JOIN acl_perms_region t3 ON t2.parent_id = t3.id AND t3.status="active"
  JOIN acl_perms_region t4 ON t3.parent_id = t4.id AND t4.status="active"
  JOIN acl_perms_region t5 ON t4.parent_id = t5.id AND t5.status="active"
WHERE
  t1.status="active"
```

# (Request)İstek akışı: kullanıcıdan → veritabanına

Kullanıcı → Cloudflare → Traefik (Coolify Proxy) → SvelteKit Uygulaması (docker s_app) → PocketBase (docker s_pocketbase)

# createSubscriber

- https://www.youtube.com/live/fExlOwTtZqM?si=nA6Ks7tsyKOwsLAj&t=1138
- https://svelte.dev/docs/svelte/svelte-reactivity#createSubscriber

# Focus Yönetimi

### Özet

---

- **:focus** → Doğrudan odaklanılan elemanı (input, button, link vb.) stillendirmek için kullanılır.
- **:focus-within** → İçindeki bir eleman odaklandığında, dışarıdaki kapsayıcı (parent) elemanı stillendirmek için kullanılır.
- **Ring (Odak Halkası)** → Genellikle `outline` CSS özelliği ile oluşturulan, odaklanılan elemanın etrafındaki görsel işarettir. **Asla alternatifsiz kaldırmayın!**

### Detay

```css
/* Fare ile tıklanınca çıkan rahatsız edici outline'ı kaldır */
*:not(body):not(.focus-override):focus {
	outline: none;
}
/* Ama klavye ile gelindiğinde ÇOK belirgin bir stil ekle */
*:not(body):not(.focus-override):focus-visible {
	outline: 3px solid hotpink;
	outline-offset: 2px;
}
```

### Hangisini, Ne Zaman Kullanmalı? Özet Tablo

| Seçici/Kavram        | Ne Yapar?                                             | Ne Zaman Kullanılır?                                                                                     |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **`:focus`**         | O anda odaklanmış olan elemanı seçer.                 | Bir input, buton veya linkin **kendisini** stillendirmek için.                                           |
| **`:focus-within`**  | İçindeki bir eleman odaklandığında kapsayıcıyı seçer. | Bir form grubunu, bir kartı veya bir menüyü **bütün olarak** vurgulamak için.                            |
| **`outline` (Ring)** | Odaklanmayı gösteren görsel halkayı kontrol eder.     | **Her zaman!** Asla kaldırmayın, sitenizin tasarımına göre özelleştirin. Erişilebilirlik için kritiktir. |
| **`:focus-visible`** | Odağın klavye ile yapılıp yapılmadığını anlar.        | Fare kullanıcılarını rahatsız etmeden klavye kullanıcıları için net odak stilleri sağlamak için.         |

# JS operatör

- **`||` (VEYA):** Sol taraf **"falsy"** ise ( `null`, `undefined`, `0`, `""`, `false` ) sağ tarafı verir.
- **`??` (Boş Birleştirme):** Sol taraf **sadece `null` veya `undefined`** ise sağ tarafı verir.

**Kilit Fark:** `??` operatörü, `0`, `""` (boş string) ve `false` gibi değerleri geçerli kabul eder ve değiştirmez.

**Tavsiye:** Modern JavaScript'te, varsayılan değer atamak için neredeyse her zaman daha güvenli olan `??` operatörünü kullanın.

# "Install from VSIX..." ile yüklenen eklentiler

- **Package Pilot** → An extension for managing your Node.js projects packages.
