import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

const portNumber = z.coerce
	.number()
	.int()
	.positive()
	.refine((val) => val > 0 && val <= 65535, {
		message: 'PORT must be a valid port number (1-65535).'
	});

const EnvSchema = z.object({
	NODE_ENV: z.string().default('development'),
	TZ: z.string(),
	PB_BACKEND_URL: z.string(),
	PORT: portNumber,
	ORIGIN: z.string()
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;

const result = config({ path: envFile });
if (result.error) {
	console.warn(`Warning: ${envFile} file not found or could not be loaded. Using default environment variables.`);
}
expand(result);

let validatedEnv: EnvSchemaType;

try {
	validatedEnv = EnvSchema.parse(process.env);
} catch (error) {
	if (error instanceof ZodError) {
		let message = 'Environment variable validation failed:\n';
		error.issues.forEach((issue) => {
			message += `- ${issue.path[0]}: ${issue.message}\n`;
		});
		const e = new Error(message);
		e.stack = ''; // Stack trace'i temizle
		throw e;
	} else {
		console.error(error);
		throw error; // Beklenmeyen hataları yeniden fırlat
	}
}

export default validatedEnv; // Doğrulanmış çevresel değişkenler dışa aktarılıyor
