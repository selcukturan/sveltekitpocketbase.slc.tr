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

```bash
pnpm add -g npm-check
npm-check -u
```

##############################################################################################################################

# Table Parent ID System

```sql
SELECT
t1.bao00_id AS bam00_bao00_id,
t5.bao00_name_t AS bam00_bao00_bolge,
t4.bao00_name_t AS bam00_bao00_il,
t3.bao00_name_t AS bam00_bao00_ilce,
t2.bao00_name_t AS bam00_bao00_koy,
t1.bao00_name_t AS bam00_bao00_mevkii
FROM bao00 t1
LEFT JOIN bao00 t2 ON t1.bao00_parent = t2.bao00_id
LEFT JOIN bao00 t3 ON t2.bao00_parent = t3.bao00_id
LEFT JOIN bao00 t4 ON t3.bao00_parent = t4.bao00_id
LEFT JOIN bao00 t5 ON t4.bao00_parent = t5.bao00_id
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
