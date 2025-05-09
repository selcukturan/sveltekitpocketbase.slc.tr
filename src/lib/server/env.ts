import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import * as v from 'valibot'; // Valibot'u namespace olarak import etme

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

const portNumberSchema = v.pipe(
	v.unknown(), // 1. Herhangi bir girdi türünü kabul et
	v.transform(Number), // 2. Dönüştürme işlemi
	v.number('PORT sayısal bir değere dönüştürülebilmelidir.'), // 3. Dönüştürülmüş değerin geçerli bir sayı olduğunu (NaN olmadığını) doğrula
	v.integer('PORT bir tam sayı olmalıdır.'),
	v.minValue(1, 'PORT numarası en az 1 olmalıdır.'),
	v.maxValue(65535, 'PORT numarası en fazla 65535 olmalıdır.')
);

const EnvSchema = v.object({
	NODE_ENV: v.optional(v.string('NODE_ENV bir metin olmalıdır.'), 'development'),
	TZ: v.string('TZ (Zaman Dilimi) gereklidir ve bir metin olmalıdır.'),
	PB_BACKEND_URL: v.string('PB_BACKEND_URL gereklidir ve bir metin olmalıdır.'),
	PORT: portNumberSchema,
	ORIGIN: v.string('ORIGIN gereklidir ve bir metin olmalıdır.')
});

export type EnvSchemaType = v.InferOutput<typeof EnvSchema>;

const result = config({ path: envFile });
if (result.error) {
	console.warn(`Uyarı: ${envFile} dosyası bulunamadı veya yüklenemedi. Varsayılan ortam değişkenleri kullanılıyor.`);
}
expand(result);

let validatedEnv: EnvSchemaType;

try {
	validatedEnv = v.parse(EnvSchema, process.env);
} catch (error) {
	if (error instanceof v.ValiError) {
		// ValiError'a v. öneki ile erişim
		let message = 'Ortam değişkeni doğrulaması başarısız oldu:\n';
		error.issues.forEach((issue) => {
			const pathString =
				issue.path
					?.map((p: v.UnknownPathItem) => p.key)
					.filter(Boolean)
					.join('.') || 'Bilinmeyen alan';
			message += `- ${pathString}: ${issue.message}\n`;
		});
		const e = new Error(message);
		e.stack = '';
		throw e;
	} else {
		console.error('Beklenmedik bir hata oluştu:', error);
		throw error;
	}
}

export default validatedEnv;
