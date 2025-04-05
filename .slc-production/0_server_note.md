### Ubuntu 24.04 VPS Server Kurulumu - (community.hetzner.com/tutorials/basic-cloud-config)

**AMAÇ**

Amaç

**Server ayağa kalkmadan önce**

1. **Kendi makinende ssh-keygen ile public key olustur ve oku**

```bash
ssh-keygen -b 4096
```

```bash
cd
```

```bash
ls -a
```

```bash
cat .ssh/id_rsa.pub
cat .ssh/id_ed25519.pub
```

- Buradaki public key'i hetzner.yaml dosyasında ilgili yere yapıştır.

2. **Hetzner**

- hetzner.yaml dosyasını server kurarken yükle.

**Server ayağa kalktıktan sonra**

3. **`vim` dosya düzenleme editörünü yükle**

```bash
sudo apt-get install vim
```

4. **80 ve 443 portlarını açma**

- Hetzner sağlayıcısında ayarlanan firewall'a 80 ve 443 postları TCP olarak eklenir.

- Server'da ufw firewall'u üstünde 80 ve 443 portları açılır.

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

5. **SSH Portu Değiştirme**

- Hetzner sağlayıcısında ayarlanan firewall'a yeni port TCP olarak eklenir.

- Güvenlik duvarına yeni ssh portu eklenir.

```bash
sudo ufw allow <new-port>/tcp
```

- Port eklenmiş mi kontrol edilir. Burada yeni port görünür.

```bash
sudo ufw status
```

- `sshd_config` dosyasındaki `#Port 22` bölümü `Port <new-port>` olarak değiştirilir. (`#` işareti kaldırılır)

```bash
sudo nano /etc/ssh/sshd_config
```

- Aşağıdaki komutu, systemd hizmet yöneticisinin yapılandırma dosyalarını yeniden yüklemesini sağlar. Bu komut, systemd tarafından yönetilen hizmetlerin yapılandırma dosyalarında yapılan değişikliklerin uygulanabilmesi için gereklidir.

```bash
sudo systemctl daemon-reload
```

- SSH servisi yeniden başlatılır.

```bash
sudo systemctl restart ssh
```

- SSH servisinin durumu kontyrol edilir. Burada yeni port görünür.

```bash
sudo systemctl status ssh
```

- Sistemde dinlenen portlar listesinde yeni portun dinlendiğini kontrol edin. Burada yeni port görünür.

```bash
sudo lsof -i -P -n | grep <new-port>
```

- SSH servisi tarafından dinlenen portları görmek için aşağıdaki komutu kullanabilirsiniz.

```bash
sudo lsof -i -P -n | grep ssh
```

- Kendi makinemizde SSH ayar dosyası yaratılır.

```bash
nano ~/.ssh/config
```

- Aşağıdaki ayarlar eklenir.

```plaintext
Host myserver
    HostName myserverip
    User myuser
    Port myport
```

6. **Server'a bağlanma**

```bash
ssh myserver
```

7. **22 nolu portu firewall'dan kaldırma**

- Hetzner sağlayıcısında ayarlanan firewall'dan eski port kaldırın. (22)

- Bu komutu, ufw kullanarak gelen tüm bağlantıları varsayılan olarak engeller. Bu, güvenlik duvarının varsayılan politikasını gelen trafiği reddedecek şekilde ayarlar. Bu komut, sunucunuzun güvenliğini artırmak için kullanılır, çünkü yalnızca açıkça izin verilen bağlantılara izin verir.

```bash
sudo ufw default deny incoming
```

- Bu komutu, ufw kullanarak giden tüm bağlantılara varsayılan olarak izin verir. Bu, güvenlik duvarının varsayılan politikasını giden trafiği kabul edecek şekilde ayarlar. Bu komut, sunucunuzun dış dünyaya erişimini kısıtlamadan çalışmasını sağlar.

```bash
sudo ufw default allow outgoing
```

```bash
sudo ufw status
```

7. **fail2ban ayarlarında yeni portu ayarlama** - (fail2ban, server'ı kurarken hetzner.yaml yapılandırma dosyası kullanılarak yüklenmişti)

- fail2ban ayarlarının üzerine yazılacak.

```bash
sudo nano /etc/fail2ban/jail.local
```

- Açılan dosyaya port eklenir.

```plaintext
[sshd]
enabled = true
port = <new_port>
banaction = iptables-multiport
```

- fail2ban, yeni ayarlar uygulanmış olarak yeniden başlatılır.

```bash
sudo systemctl daemon-reload
```

```bash
sudo systemctl restart fail2ban
# YA DA
sudo fail2ban-client reload
```

- fail2ban'ın çalışıp çalışmadığı kontrol edin.

```bash
sudo systemctl status fail2ban
```

9. **Server paketlerini otomatik olarak yükseltme** - (https://github.com/mvo5/unattended-upgrades?tab=readme-ov-file#supported-options-reference)

- Bu betik paketleri otomatik olarak ve gözetimsiz yükseltir.

```bash
sudo apt install unattended-upgrades
```

- Aşağıdaki komut, unattended-upgrades paketinin yapılandırma seçeneklerini yeniden ayarlamak için bir arayüz açar. Komut çalıştırıldığında, kullanıcıya güvenlik güncellemelerinin otomatik olarak yüklenip yüklenmeyeceği sorulur. Kullanıcı "Yes" seçeneğini seçerse, güvenlik güncellemeleri otomatik olarak yüklenir.

```bash
sudo dpkg-reconfigure unattended-upgrades
# <Yes>
```

- Varsayılan olarak sadece güvenlik güncelleştirmeleri etkindir. `"${distro_id}:${distro_codename}-updates";` satırının başındaki `//` kaldırılırsa normal paketlerde güncellenecektir. Ben şuan bunu kullanmıyorum. Sadece güvenlik güncelleştirmelerini istiyorum.

```bash
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

- Betiği güncel ayarlar ile çalıştır ve kontrol et.

```bash
sudo systemctl daemon-reload
```

```bash
sudo systemctl restart unattended-upgrades
```

```bash
sudo systemctl status unattended-upgrades
```

### Domain Ayarları

1. **Domain isminizi server'a yönlendirme** - (biraz zaman alabilir)

- Domain isminizi satın aldığınız sağlayıcıdan `DNS Records`larınıza aşağıdaki kayıtları ekleyin.
  - tip:`A`, host:`@`, data:`your-server-ip` olan bir kayıt ekleyin. `example.com` gibi sadece alan adınızın saf halini IP'ye yönlendirir.
  - tip:`A`, host:`www`, data:`your-server-ip` olan bir kayıt ekleyin. `www.example.com` gibi saf alan adınızın önüne www gelirse IP'ye yönlendirir.

### Server'da uygulamanın çalışması için gerekli araçları yükleme

1. **Docker Kurulumu**

- Docker'ın apt deposunu kurun.

```bash
# Docker'ın resmi GPG anahtarını ekleme
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
# Depoyu Apt kaynaklarına ekleme
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

- Docker paketlerini yükleme

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

- Test. Docker artık çalışır durumda.

```bash
sudo docker ps
```

```plaintext
# Çıktı
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

- Docker servisini sistem başlatıldığında otomatik olarak başlatılacak şekilde ayarlar

```bash
sudo systemctl enable docker
```

```plaintext
# Çıktı
Synchronizing state of docker.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable docker
```

- Aşağıdaki komut, `mysudouser` adlı kullanıcıyı docker grubuna ekler. Bu, kullanıcının Docker komutlarını `sudo` kullanmadan çalıştırabilmesini sağlar

```bash
sudo usermod -aG docker <mysudouser>
```

2. **VPS Server'da Docker Hub'a giriş**

- VPS server'ımızda, Docker Hub'ımızdaki private image'larımızı kullanabilmemiz için Docker Hub'a giriş yapıyoruz.

```bash
echo "<docker-hub-password>" | docker login -u <docker-hub-username> --password-stdin
```

### Uygulama Deployment

1. **Local Docker Compose Hazırlama**

- Local kod tabanımızdaki `docker-compose-production.yml` dosyasındaki yapılandırmayı kopyalıyoruz.

```bash
scp ./docker-compose-production.yml myserver:/home/<server-sudo-user>/<server-project-folder>/docker-compose.yml
```

2. **Server Docker Compose Hazırlama**

- `/home/<server-sudo-user>/<my-project-folder>docker-compose.yml` dosyası oluşturma.

```bash
cd /home/<server-sudo-user>/<my-project-folder>
mkdir <my-project-folder>
```

- `/home/<server-sudo-user>/<my-project-folder>/docker-compose.yml` dosyasına local'deki yapılandırmayı yapıştırın.
- BİLGİ: burada vim ile yapıştırırken bazı hizalama sorunları çıkabilir. Dikkatli olun.

```bash
vim <my-project-folder>
```

- İPUCU: Yerel makinenizdeki docker compose dosyanızı VPS server'ınıza gönderebilirsiniz. Yerel makinenizin kök dizinindeyken `docker-compose-production.yml` dosyasını server'ınıza aşağıdaki komut ile gönderebilirsiniz.

```bash
scp ./docker-compose-production.yml myserver:/home/<server-sudo-user>/<my-project-folder>/docker-compose.yml
```

3. **Uygulamanızı oluşturup çalıştırın**

- Github reponuzun ve Docker Hub'ınızın güncel olduğundan emin olun.

  - Server Proje dizininizdeki `docker-compose.yml` dosyanızı çalıştırın.

    - `--force-recreate`: Mevcut konteynerleri yeniden oluşturur, hatta yapılandırmaları değişmemiş olsa bile.
    - `--build`: Tüm imajları yeniden oluşturur ve indirir.
    - `-d`: Konteynerleri arka planda çalıştırır (detached mode).

```bash
ls
cd /home/<server-sudo-user>/<my-project-folder>
ls
```

```bash
# volume'ları silmez. mevcut volume'ları kullanmaya devam eder.
docker compose up --force-recreate --build -d
```

4. **Uygulamayı kontrol edin**

- `docker ps` komutu, Docker konteynerlerinin durumunu görüntülemek için kullanılır. Bu komut, şu anda çalışan tüm Docker konteynerlerinin bir listesini gösterir.

```bash
docker ps
```

5. **Uygulamayı durdurun**

- `docker compose down` komutunu kullanarak tüm Docker Compose hizmetlerini ve içindeki imajları silmek için `--rmi all` ve `--volumes` seçeneklerini ekleyebilirsiniz. Bu seçenekler, tüm konteynerleri, ağları, volume'ları ve imajları siler.

```bash
# volume'ları silme
docker compose down --rmi all
# volume'ları listele
docker volume ls
# Eğer yerel Caddyfile içeriğinde bir değişiklik olduysa, güncel dosyanın kullanılması için, shared_app_caddy volume'unu sil
docker volume rm slc-sveltekit-spa_shared_app_caddy
# volume'ları listele
docker volume ls
```

### Watchtower ile Docker Hub'taki private uygulama imajımızdaki güncellemeleri izleme - (https://containrrr.dev/watchtower/)

- Aşağıdaki sözdizimine ve base64 kodlu kullanıcı adı ve parola auth dizesine sahip yeni bir yapılandırma dosyası oluşturun:
- Docker Hub'daki özel depolara erişmek için <REGISTRY_NAME> https://index.docker.io/v1/ olmalıdır. Bu link Docker'ın resmi registry'si olan Docker Hub ile ilgilidir. Bu URL, Docker Hub'a kimlik doğrulama bilgilerini göndermek için kullanılır.

```plaintext
{
    "auths": {
        "<REGISTRY_NAME>": {
            "auth": "XXXXXXX"
        }
    }
}
```

- Server'da config dosyası oluşturun

```bash
cd slc-sveltekit-spa
mkdir watchtower
cd watchtower
nano config.json
```

```plaintext
{
    "auths": {
        "https://index.docker.io/v1/": {
            "auth": "dXNlcm5hbWU6cGFzc3dvcmQ="
        }
    }
}
```

- Gerekli `auth` dizesi aşağıdaki gibi oluşturulabilir:

```bash
echo -n 'docker-username:docker-password' | base64
```
