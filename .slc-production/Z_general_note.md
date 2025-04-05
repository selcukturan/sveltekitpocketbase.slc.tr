# update packages. only devDependencies.

```bash
pnpm update --dev --latest
```

```bash
# all package update
pnpm update --latest
```

### Docker Desktop Compose File Run

- Bu komut, Docker Compose dosyanızdaki tüm servisleri oluşturur ve başlatır:

```bash
docker-compose up
```

- Eğer Docker imajlarını yeniden oluşturmak istiyorsanız, --build seçeneğini kullanabilirsiniz:

```bash
docker-compose -f docker-compose-local.yml up --build -d
docker-compose -f docker-compose-production.yml up --build -d
```

### Pocketbase Run

```bat
cd C:\Users\selcukt\Desktop\Dev\www\lab.tr\.slc-dev\pocketbase

pocketbase.exe serve --http="127.0.0.1:8092" --dir="./development/pb_data" --migrationsDir="./development/pb_migrations" --hooksDir="./development/pb_hooks" --publicDir="./development/pb_public"
```

### Edit `hosts` file (cmd run administrator)

```bat
notepad C:\windows\System32\Drivers\Etc\hosts
```

# Svelte v4 -> v5 migration notes

1 - Superform'da SuperDebug.svelte hata veriyor.

# General Notes

--DateTime input example
https://discord.com/channels/457912077277855764/1180132367059398706/1181699255828742144
--Svelte 5: disallow fallback values for bindings
https://github.com/sveltejs/svelte/issues/9764
-- caddy-nodejs-docker-tutorial
https://github.com/TomDoesTech/caddy-nodejs-docker-tutorial/tree/main

### 1- Github'ta proje branch, main mi. Kontrol et.

### 2- vscode aç ve oturum kontrolü

```bash
# git config
git config --list
```

```bash
# branch set
git config --global init.defaultBranch main
```

```bash
# current branch get
git config --global init.defaultBranch
```

```bash
# set autocrlf
git config --global core.autocrlf false
```

```bash
# get autocrlf
git config --global core.autocrlf
```

```bash
# get main branch clone
git clone -b main https://github.com/selcukturan/<project>.git
```

### 3- vscode sol alt köşede "main" branch gör

```bash
# proje klasörüne geç
cd www.slcc.run
```

### 4- vscode sol alt köşede "main" branch gör

# DONE...

```bash
echo "<password>" | docker login -u <username> --password-stdin
```

```bash
# COMMIT
git add .
git commit -m "Push.12 - [slc-pc-2]"
git push origin main
```

```bash
# PULL
git pull origin main
```

### Windows'ta aşağıdaki uyarıyı almamak için.

> warning: in the working copy of 'vite.config.js', LF will be replaced by CRLF the next time Git touches it

```bash
git config --global core.autocrlf false
```

# WHITE

- BONE WHITE #F9F6EE
- IVORY #FFFFF0
- PARCHMENT #FCF5E5
- PEARL #E2DFD2
- SEA SHELL #FFF5EE

# SOURCES

- [source-1](https://www.youtube.com/watch?v=AxPB3e-3yEM)
- [source-2](https://github.com/jianyuan/pocketbase-sveltekit-auth)
- [source-3](https://github.com/pocketbase/js-sdk#ssr-integration)
- [source-4](https://www.youtube.com/watch?v=vLze97zZKsU)
