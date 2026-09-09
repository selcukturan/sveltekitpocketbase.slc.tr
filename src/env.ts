import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

const portNumberSchema = v.pipe(
	v.string('PORT bir metin olmalıdır.'),
	v.transform(Number),
	v.number('PORT sayısal bir değere dönüştürülebilmelidir.'),
	v.integer('PORT bir tam sayı olmalıdır.'),
	v.minValue(1, 'PORT numarası en az 1 olmalıdır.'),
	v.maxValue(65535, 'PORT numarası en fazla 65535 olmalıdır.')
);

const bodySizeLimitSchema = v.pipe(
	v.string('BODY_SIZE_LIMIT bir metin olmalıdır.'),
	v.transform(Number),
	v.number('BODY_SIZE_LIMIT sayısal bir değere dönüştürülebilmelidir.'),
	v.integer('BODY_SIZE_LIMIT bir tam sayı olmalıdır.'),
	v.minValue(524288, 'BODY_SIZE_LIMIT en az 512KB olmalıdır.'),
	v.maxValue(52428800, 'BODY_SIZE_LIMIT en fazla 50MB olmalıdır.')
);

export const variables = defineEnvVars({
	// Public
	PUBLIC_ENV_TEST: {
		public: true,
		static: true,
		description: 'PUBLIC_ENV_TEST is a public environment variable',
		schema: v.pipe(v.string(), v.regex(/[a-zA-Z0-9/.-]+/))
	},

	// Private
	NODE_ENV: {
		static: true,
		description: 'NODE_ENV is a private environment variable',
		schema: v.optional(v.string('NODE_ENV bir metin olmalıdır.'), 'development')
	},
	TZ: {
		static: true,
		description: 'TZ (Zaman Dilimi) gereklidir ve bir metin olmalıdır.',
		schema: v.string('TZ (Zaman Dilimi) gereklidir ve bir metin olmalıdır.')
	},
	PB_BACKEND_URL: {
		static: true,
		description: 'PB_BACKEND_URL gereklidir ve bir metin olmalıdır.',
		schema: v.string('PB_BACKEND_URL gereklidir ve bir metin olmalıdır.')
	},
	PORT: {
		static: true,
		description: 'PORT gereklidir ve bir tam sayı olmalıdır.',
		schema: portNumberSchema
	},
	ORIGIN: {
		static: true,
		description: 'ORIGIN gereklidir ve bir metin olmalıdır.',
		schema: v.string('ORIGIN gereklidir ve bir metin olmalıdır.')
	},
	BODY_SIZE_LIMIT: {
		static: true,
		description: 'BODY_SIZE_LIMIT gereklidir ve bir tam sayı olmalıdır.',
		schema: bodySizeLimitSchema
	}
});
