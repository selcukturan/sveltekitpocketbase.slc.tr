export function toNumber(value: unknown): number {
	return typeof value === 'number' ? value : 0;
}

export function getDigit(value: string): number {
	const match = value.match(/\d+/);
	return match ? parseInt(match[0]) : 0;
}

export function calcAverage(dataSum: number, dataLenght: number, field: string): string {
	const fractionDigits = getDigit(field);
	const dataAvg = isNaN(dataSum / dataLenght) ? 0 : dataSum / dataLenght;

	// return formatNumber(dataAvg, fractionDigits);
	return new Intl.NumberFormat('en-EN', {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	}).format(dataAvg);
}

export function calcSum(dataSum: number, field: string): string {
	const fractionDigits = getDigit(field);

	// return formatNumber(dataSum, fractionDigits);
	return new Intl.NumberFormat('en-EN', {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	}).format(dataSum);
}

export function getStr(value: string): string {
	const matched = value.match(/\(([^)]+)\)/);
	return matched ? matched[1] : '';
}

export function formatNumber(number: number, fractionDigits: number = 2, locale: string = 'en-EN'): string {
	// locale: string = 'tr-TR'
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	}).format(number);
}

export function clearFormattedNumber(formattedNumber: string, locale: string = 'en-EN'): number {
	const tempNumber = new Intl.NumberFormat(locale).format(1111.1);
	const thousandSeparator = tempNumber[1]; // 2. character thousand separator
	const decimalSeparator = tempNumber[5]; // 6. character decimal separator
	let numberString = formattedNumber.replace(thousandSeparator, '').replace(decimalSeparator, '.');
	return parseFloat(numberString);
}

/**
 * https://github.com/WJSoftware/wjfe-dataview/blob/main/src/lib/utils.ts
 *
 * Örnek 1: Sadece string sınıflar
 * const classes1 = combineClasses('class1', 'class2', 'class3');
 * console.log(classes1); // "class1 class2 class3"
 *
 * Örnek 2: String ve obje formatında sınıflar
 * const classes2 = combineClasses('class1', { 'class2': true, 'class3': false }, 'class4');
 * console.log(classes2); // "class1 class2 class4"
 *
 * Örnek 3: null ve undefined değerler
 * const classes3 = combineClasses('class1', null, undefined, 'class2');
 * console.log(classes3); // "class1 class2"
 *
 * Örnek 4: Sadece obje formatında sınıflar
 * const classes4 = combineClasses({ 'class1': true, 'class2': false }, { 'class3': true });
 * console.log(classes4); // "class1 class3"
 *
 * Örnek 5: const classes = combineClasses('class1 class2', 'class2', 'class3 class1');
 * console.log(classes); // "class1 class2 class3"
 *
 * Örnek 6: const classesx = combineClasses('class1 class2', 'class2 class-9', 'class3 class1', 'class4', { class5: true, class6: false }, 'class4', { class7: true, class8: false }, { class9: true });
 * console.log(classesx); // "class1 class2 class-9 class3 class4 class5 class7 class9"
 */
export function combineClasses(...classes: (string | Record<string, boolean> | null | undefined)[]) {
	const result: Set<string> = new Set();
	for (let c of classes) {
		if (!c) {
			continue;
		}
		if (typeof c === 'string') {
			const finalC = c.trim();
			if (!finalC) {
				continue;
			}
			finalC.split(/\s+/).forEach((cls) => result.add(cls));
		} else {
			for (let k in c) {
				if (c[k]) {
					result.add(k);
				}
			}
		}
	}
	return Array.from(result).join(' ');
}
