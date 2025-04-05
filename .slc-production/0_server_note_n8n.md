### docker-ce-ubuntu 24.04 VPS Server Kurulumu - (community.hetzner.com/tutorials/basic-cloud-config)

**Server ayağa kalkmadan önce**

1. **Kendi makinende ssh-keygen ile public key olustur ve oku**

```bash
ssh-keygen -t ed25519
```

```bash
cd
```

```bash
ls -a
```

```bash
cat .ssh/id_ed25519.pub
```

- Buradaki public key'i hetzner.yaml dosyasında ilgili yere yapıştır.

2. **Hetzner**

- hetzner.yaml dosyasını server kurarken yükle.

**Server ayağa kalktıktan sonra**

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
