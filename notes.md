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
./pocketbase migrate collections
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
- Toasts z-index = 3000

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

---

### 1. `:focus` Sözde Sınıfı (Pseudo-class)

Bu, en temel ve en çok bilinen odak seçicisidir. Bir kullanıcı klavyedeki `Tab` tuşuyla bir elemanın üzerine geldiğinde veya fare ile bir form elemanına tıkladığında o eleman "odaklanmış" olur. `:focus` tam olarak o anda devreye girer.

**Hangi elemanlar odaklanabilir?**

- Linkler (`<a>` `href` özelliği varsa)
- Butonlar (`<button>`)
- Form elemanları (`<input>`, `<textarea>`, `<select>`)
- `tabindex` özelliği verilmiş herhangi bir eleman.

**Nasıl Kullanılır?**

Doğrudan odaklanan elemanın stilini değiştirmek için kullanılır.

**Örnek:**
Bir input alanına odaklanıldığında arka plan rengini ve kenarlığını değiştirelim.

```html
<label for="kullanici-adi">Kullanıcı Adı:</label>
<input type="text" id="kullanici-adi" name="kullanici-adi" />

<button>Giriş Yap</button>
```

```css
/* Input'a odaklanıldığında */
input:focus {
	background-color: #eef5ff; /* Açık mavi bir arka plan */
	border-color: #007bff; /* Mavi bir kenarlık */
	outline: none; /* Varsayılan halkayı kaldırıp kendi stilimizi kullandık */
	box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Hafif bir gölge efekti */
}

/* Butona odaklanıldığında */
button:focus {
	background-color: #0056b3;
	outline: 2px solid #ffc107; /* Farklı bir odak halkası */
	outline-offset: 2px; /* Halka ile eleman arasına boşluk koyar */
}
```

**Ne Zaman Kullanılır?**
Kullanıcının o anda etkileşimde olduğu **tek bir elemanı** görsel olarak vurgulamak istediğinizde `:focus` kullanmalısınız.

---

### 2. `:focus-within` Sözde Sınıfı (Pseudo-class)

Bu seçici, `:focus`'un daha güçlü bir versiyonudur. Sadece odaklanan elemanı değil, **o elemanı içeren kapsayıcı (parent) elemanı da** seçmenizi sağlar. Yani, bir `<div>` içindeki `<input>`'a odaklandığınızda, `:focus-within` sayesinde `<div>`'in stilini değiştirebilirsiniz.

**Nasıl Kullanılır?**

Bir form grubunu veya bir kartı komple vurgulamak için harikadır.

**Örnek:**
Bir form alanında, input'a odaklanıldığında hem etiketin hem de kapsayıcı `div`'in stilini değiştirelim.

```html
<div class="form-grup">
	<label for="sifre">Şifre:</label>
	<input type="password" id="sifre" name="sifre" />
</div>
```

```css
.form-grup {
	padding: 15px;
	border: 2px solid #ccc;
	border-radius: 5px;
	transition: all 0.2s ease-in-out; /* Geçişi yumuşatmak için */
}

/* HARİKA KISIM BURASI */
/* .form-grup içindeki herhangi bir eleman odaklandığında .form-grup'un kendisini stillendir */
.form-grup:focus-within {
	border-color: #007bff;
	box-shadow: 0 0 10px rgba(0, 123, 255, 0.25);
}

/* Ekstra: İçerideki label'ın rengini de değiştirebiliriz */
.form-grup:focus-within label {
	color: #007bff;
	font-weight: bold;
}
```

**Ne Zaman Kullanılır?**
Kullanıcı bir bileşenin (component) içine girdiğinde, o bileşenin **tamamını** vurgulamak istediğinizde `:focus-within` mükemmel bir çözümdür. JavaScript kullanmaya gerek kalmadan harika etkileşimler yaratmanızı sağlar.

---

### 3. "Ring" (Odak Halkası) ve `outline` Özelliği

"Ring" bir CSS özelliği değildir; bir konsepttir. Tarayıcıların, odaklanılan elemanı belirtmek için varsayılan olarak çizdiği görsel çerçeveye (genellikle mavi veya noktalı bir çizgi) verilen addır. Bu halka, CSS'teki `outline` özelliği ile kontrol edilir.

**En Büyük Hata: `outline: none;`**

Geliştiricilerin yaptığı en yaygın erişilebilirlik hatası, bu halkanın "çirkin" göründüğünü düşünüp hiçbir alternatif sunmadan onu kaldırmaktır:

```css
/* SAKIN BUNU YAPMAYIN! */
:focus {
	outline: none;
}
```

Bunu yaptığınızda, klavye ile gezinen kullanıcılar sitede nerede olduklarını tamamen kaybederler.

**Doğru Yaklaşım: `outline`'ı Güzelleştirmek**

`outline`'ı kaldırmak yerine, sitenizin tasarımına uyacak şekilde özelleştirin.

```css
a:focus {
	/* outline: none; YERİNE... */

	outline: 3px solid #fd7e14; /* Turuncu ve kalın bir halka */
	outline-offset: 4px; /* Eleman ile halka arasına boşluk bırakır */
	border-radius: 4px; /* Bazı tarayıcılar outline'a border-radius uygular */
}
```

**Alternatifler:**
Eğer `outline`'ın kutu modelini (layout) etkilememesi ama yine de istediğiniz gibi görünmemesi durumunda `box-shadow` da harika bir alternatiftir:

```css
input:focus {
	outline: none; /* Önce varsayılanı kaldır */
	box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); /* Sonra kendi "halkanı" ekle */
}
```

Bu yöntem, `outline` gibi çalışır ama daha fazla kontrol (örn. bulanıklık) sunar ve `border-radius` ile mükemmel uyum sağlar.

---

### Bonus: Modern Yaklaşım `:focus-visible`

Bazen odak halkası, fare ile tıklayan kullanıcılar için gereksiz olabilir. Örneğin, bir butona tıkladığınızda etrafında mavi bir halkanın kalmasını istemeyebilirsiniz. Ancak klavye kullanıcısı için bu halka hayatidir.

`:focus-visible` tam olarak bu sorunu çözer. Tarayıcı, kullanıcının odağı nasıl getirdiğini anlar (klavye mi, fare mi) ve halkayı yalnızca **gerekli olduğunda** (genellikle klavye gezintisi) gösterir.

**Nasıl Kullanılır?**

```css
/* Fare ile tıklanınca çıkan rahatsız edici outline'ı kaldır */
button:focus {
	outline: none;
}

/* Ama klavye ile gelindiğinde ÇOK belirgin bir stil ekle */
button:focus-visible {
	outline: 3px solid hotpink;
	outline-offset: 2px;
}
```

Bu, hem estetik hem de erişilebilirlik açısından en iyi deneyimi sunar.

### Hangisini, Ne Zaman Kullanmalı? Özet Tablo

| Seçici/Kavram        | Ne Yapar?                                             | Ne Zaman Kullanılır?                                                                                     |
| -------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **`:focus`**         | O anda odaklanmış olan elemanı seçer.                 | Bir input, buton veya linkin **kendisini** stillendirmek için.                                           |
| **`:focus-within`**  | İçindeki bir eleman odaklandığında kapsayıcıyı seçer. | Bir form grubunu, bir kartı veya bir menüyü **bütün olarak** vurgulamak için.                            |
| **`outline` (Ring)** | Odaklanmayı gösteren görsel halkayı kontrol eder.     | **Her zaman!** Asla kaldırmayın, sitenizin tasarımına göre özelleştirin. Erişilebilirlik için kritiktir. |
| **`:focus-visible`** | Odağın klavye ile yapılıp yapılmadığını anlar.        | Fare kullanıcılarını rahatsız etmeden klavye kullanıcıları için net odak stilleri sağlamak için.         |
