**SLC Geliştirme Ortamı Komutları**

- Geliştirme ortamını ayağa kaldırma

```bash
pnpm dev
pnpm pb
```

- Geliştirme ortamını build etme ve ön izleme

```bash
pnpm build
pnpm preview
```

- Kök dizinde bulunan `docker-compose-local.yml` dosyasını ayağa kaldırma. (local production test)

```bash
pnpm slc:local:docker
```

# Pocketbase tip çıkarımı

```bash
npm install -D pocketbase-typegen
pnpm pb:typegen
```

# Paket güncellemeleri

## 2A: Güvenli Güncelleme (Tavsiye Edilen Başlangıç)

- Eğer bir paket package.json dosyanızda ^1.5.0 olarak belirtilmişse, bu komut onu 1.6.0 veya 1.7.5 gibi sürümlere günceller, ancak asla 2.0.0 gibi ana sürüm (major version) atlaması yapmaz. Bu, genellikle "kırılma" (breaking change) riski olmadan yapılan en güvenli toplu güncellemedir.

```bash
pnpm up
```

## 2B: En Son Sürüme Zorla Güncelleme (Dikkatli Olun!)

- Tüm paketleri, package.json kurallarını hiçe sayarak mevcut en son sürümlerine (major versiyonlar dahil) güncellemek için:

```bash
pnpm up -L
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

```sveltekit
<Form>
	<Form.iTextbox />
    <Form.iNumberbox />

    <Form.iDate />
    <Form.iDatetime />

    <Form.iSelect />
    <Form.iCombobox />

    <Form.iRadio />
    <Form.iCheckbox />
    <Form.iSwitch />

    <Form.iSlider />

    <Form.iSubmit />
</Form>
```

# İstek akışı:

Kullanıcı → Cloudflare → Traefik (Coolify Proxy) → SvelteKit Uygulaması (s_app) → PocketBase (s_pocketbase)
