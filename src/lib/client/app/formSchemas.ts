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
