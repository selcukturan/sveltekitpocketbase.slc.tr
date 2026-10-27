// Key'leri dönüştüren yardımcı tip
type TransformKeys<T> = {
	[K in keyof T as K extends `${infer Prefix}_Plus` ? `${Prefix}+` : K extends `${infer Prefix}_Minus` ? `${Prefix}-` : K]: T[K];
};

export function paramsFileKeyTransform<T extends Record<string, unknown>>(params: T): TransformKeys<T> {
	const newObj: Record<string, unknown> = {};

	for (const key in params) {
		let newKey: string = key;
		if (key.endsWith('_Plus')) {
			newKey = key.slice(0, -'_Plus'.length) + '+';
		} else if (key.endsWith('_Minus')) {
			newKey = key.slice(0, -'_Minus'.length) + '-';
		}
		newObj[newKey] = params[key];
	}

	return newObj as TransformKeys<T>;
}

/**
 * Doğrulanmış form verisini PocketBase create/update gövdesine çevirir:
 * - `omit` ile verilen anahtarları çıkarır (örn: update'te 'id')
 * - `undefined` değerleri atar (gönderilmeyen alanlar PocketBase'de değişmez; örn: dosya ana alanı)
 * - dosya gölge alanlarını PocketBase modifier'larına çevirir: `alan_Plus` → `alan+`, `alan_Minus` → `alan-`
 */
export function toPbPayload<T extends Record<string, unknown>, K extends keyof T = never>(params: T, omit: K[] = []): TransformKeys<Omit<T, K>> {
	const picked: Record<string, unknown> = {};
	for (const key in params) {
		if (omit.includes(key as unknown as K) || params[key] === undefined) continue;
		picked[key] = params[key];
	}
	return paramsFileKeyTransform(picked) as TransformKeys<Omit<T, K>>;
}
