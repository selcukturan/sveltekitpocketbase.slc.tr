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
npm install -D pocketbase-typegen
npm run pb:typegen
```

# Pocketbase migrations

migrate collections komutu, manuel olarak yazmanıza gerek kalmadan mevcut collections yapılandırmanızın tam bir anlık görüntüsünü oluşturur. migrate create komutuna benzer şekilde, bu pb_migrations dizininde yeni bir geçiş dosyası oluşturacaktır.

```bash
./pocketbase migrate collections
```

Varsayılan olarak collections anlık görüntüsü genişletme modunda içe aktarılır, yani anlık görüntüde bulunmayan koleksiyonlar ve alanlar korunur. Anlık görüntünün eksik koleksiyonları ve alanları silmesini istiyorsanız, oluşturulan dosyayı düzenleyebilir ve importCollections öğesinin son bağımsız değişkenini true olarak değiştirebilirsiniz.

# Paket güncellemeleri

```bash
npm install -g npm-check
npm-check --update
```

##############################################################################################################################

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
