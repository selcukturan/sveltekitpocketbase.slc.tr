// Key'leri dönüştüren yardımcı tip
type TransformKeys<T> = {
	[K in keyof T as K extends `${infer Prefix}_Plus` ? `${Prefix}+` : K extends `${infer Prefix}_Minus` ? `${Prefix}-` : K]: T[K];
};

export function transformParams<T extends Record<string, any>>(params: T): TransformKeys<T> {
	const newObj: any = {};

	for (const key in params) {
		let newKey: string = key;
		if (key.endsWith('_Plus')) {
			newKey = key.replace('_Plus', '+');
		} else if (key.endsWith('_Minus')) {
			newKey = key.replace('_Minus', '-');
		}
		newObj[newKey] = params[key];
	}

	return newObj as TransformKeys<T>;
}
