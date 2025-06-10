import * as v from 'valibot';

// String'i array'e dönüştürme ve array'i valide etme şeması
const CommaSeparatedStringToArraySchema = v.pipe(
	// 1. Adım: String giriş validasyonu
	v.string(),
	v.minLength(1, 'Lütfen en az bir karakter girin.'),
	// 2. Adım: String'den array'e dönüşüm
	v.transform((input) => (input.trim() === '' ? [] : input.split(',').map((item) => item.trim()))),
	// 3. Adım: Array validasyonu
	v.pipe(
		v.array(
			// Elemanlar için validasyon
			v.pipe(v.string(), v.minLength(1, 'Liste elemanı boş olamaz.')),
			'An array is required.'
		),
		// Array için validasyon opsiyonları
		v.minLength(1, 'Liste en az 1 eleman içermelidir.'),
		v.maxLength(3, 'Liste en fazla 3 eleman içermelidir.')
	)
);

// Daha esnek bir transform (boş stringleri filtreleyebilir)
const FlexibleCommaSeparatedStringToArraySchema = v.pipe(
	// 1. Adım: String giriş validasyonu
	v.string(),
	v.minLength(1, 'Lütfen en az bir karakter girin.'),
	// 2. Adım: String'den array'e dönüşüm
	v.transform((inputString) => {
		if (inputString.trim() === '') {
			return [];
		}
		return inputString
			.split(',')
			.map((item) => item.trim())
			.filter((item) => item !== ''); // Boş stringleri filtrele
	}),
	// 3. Adım: Array validasyonu
	v.pipe(
		v.array(
			// Elemanlar için validasyon
			v.pipe(v.string(), v.minLength(1, 'Liste elemanı boş olamaz.')),
			'An array is required.'
		),
		// Array için validasyon opsiyonları
		v.minLength(1, 'Liste en az 1 eleman içermelidir.'),
		v.maxLength(3, 'Liste en fazla 3 eleman içermelidir.')
	)
);

// https://valibot.dev/api/isoTimestamp/
const IsoTimestampSchema = v.pipe(v.string(), v.isoTimestamp('The timestamp is badly formatted.'));

export const ValidIsoTimestampSchema = v.pipe(
	v.string('Giriş bir string olmalıdır.'), // 1. String mi?
	v.isoTimestamp('Timestamp formatı hatalı. (Örn: YYYY-MM-DDTHH:mm:ss.sssZ)'), // 2. ISO formatı doğru mu?
	v.custom(
		(input) => {
			if (typeof input !== 'string') {
				return false; // Giriş string değilse geçersiz
			}
			// 3. Tarih mantıksal olarak geçerli mi?
			const dateObj = new Date(input);

			// Date.parse ile de kontrol edilebilir ama new Date() genellikle yeterlidir.
			// Eğer Date constructor'ı string'i parse edemezse Invalid Date döner.
			// v.isoTimestamp bu durumu büyük ölçüde yakalamış olmalı ama ek bir kontrol.
			if (isNaN(dateObj.getTime())) {
				return false; // Aslında buraya pek düşmemeli v.isoTimestamp sonrası
			}

			// ISO string'den yıl, ay, gün değerlerini alalım
			// Format: YYYY-MM-DDTHH:mm:ss.sssZ
			const yearFromInput = parseInt(input.substring(0, 4), 10);
			const monthFromInput = parseInt(input.substring(5, 7), 10); // 1-12
			const dayFromInput = parseInt(input.substring(8, 10), 10);

			// Date nesnesinden UTC değerleri alalım (ISO string genellikle UTC'dir)
			// Date.getUTCMonth() 0-indexed olduğu için +1 ekliyoruz.
			return dateObj.getUTCFullYear() === yearFromInput && dateObj.getUTCMonth() + 1 === monthFromInput && dateObj.getUTCDate() === dayFromInput;
		},
		'Tarih geçerli bir takvim tarihi değil (örn: 31 Haziran).' // Hata mesajı
	)
);

// İsteğe bağlı: Doğrulanmış string'i Date nesnesine dönüştürmek isterseniz:
const ValidIsoTimestampToDateObjectSchema = v.pipe(
	ValidIsoTimestampSchema, // Önceki tüm validasyonları uygula
	v.transform((input) => new Date(input)) // Sonra Date nesnesine çevir
);
