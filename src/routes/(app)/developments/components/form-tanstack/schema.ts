import * as v from 'valibot';

// 1. Giriş formatını doğrulayacak regex
// YYYY-MM-DDTHH:MM
const localDateTimeFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const customDateTimeSchema = v.pipe(
	v.pipe(v.string(), v.regex(localDateTimeFormatRegex, 'Geçersiz tarih-saat formatı. Beklenen: YYYY-MM-DDTHH:mm')),
	// Doğrulama başarılıysa, transform işlemi
	v.transform((inputString) => {
		// inputString: "1985-10-26T21:18"

		// JavaScript Date nesnesinin bu string'i UTC olarak yorumlamasını sağlamak için
		// sonuna saniye, milisaniye ve 'Z' ekleyelim.
		// Eğer saniye ve milisaniye hep :00.000 olacaksa:
		const utcDateTimeString = `${inputString}:00.000Z`; // "1985-10-26T21:18:00.000Z"

		const date = new Date(utcDateTimeString);

		// Date nesnesinin geçerli olup olmadığını kontrol et (örn: "2023-02-30T10:00" gibi geçersiz bir tarih)
		// Regex formatı sağlasa da, tarih anlamsal olarak geçersiz olabilir.
		// new Date("...") `NaN` döndürmez ama `date.getTime()` `NaN` olabilir.
		// Ya da `toISOString` geçersiz tarih için hata fırlatır.
		if (isNaN(date.getTime())) {
			// Valibot'un yakalaması için özel bir hata fırlatılabilir veya
			// transform fonksiyonu içinde bir `Issue` döndürülebilir.
			// Basitlik için, burada bir hata fırlatalım.
			// Valibot bunu yakalayıp kendi `Issue` nesnesine dönüştürecektir.
			// Daha kontrollü olması için `throw new v.ValiError([...])` kullanılabilir.
			throw new Error('Anlamsal olarak geçersiz tarih değeri.');
		}

		// İstenen formata dönüştür: "YYYY-MM-DD HH:mm:ss.sssZ"
		// date.toISOString() -> "1985-10-26T21:18:00.000Z" (eğer utcDateTimeString doğru yorumlandıysa)
		// Sadece 'T' yi boşluk ile değiştirmemiz yeterli.
		return date.toISOString().replace('T', ' ');
	})
);

export const formSchema = v.pipe(
	v.object({
		text_optional: v.pipe(
			v.string('You must enter a text_optional.'),
			v.nonEmpty('text_optional is required.'),
			v.minLength(3, 'text_optional must be at least 3 characters.')
		),
		datetime_optional: customDateTimeSchema
	})
);

export type FormSchema = v.InferInput<typeof formSchema>;
