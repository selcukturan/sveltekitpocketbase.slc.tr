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
npm run slc:local:docker
```

# Pocketbase tip çıkarımı

```bash
npm install -D pocketbase-typegen
npm run pb:typegen
```

# Paket güncellemeleri

```bash
npm install -g npm-check
npm-check -u
```
