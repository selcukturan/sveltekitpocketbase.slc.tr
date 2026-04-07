import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';

type Getter<T> = () => T;
type Options = {
	lazy?: boolean;
};

// Multiple sources için
export function watch<T extends Array<unknown>>(
	sources: { [K in keyof T]: Getter<T[K]> },
	effect: (values: T, previousValues: { [K in keyof T]: T[K] | undefined }) => void | VoidFunction,
	options?: Options
): void;

// Single source için
export function watch<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T | undefined) => void | VoidFunction,
	options?: Options
): void;

export function watch<T>(
	sources: Getter<T> | Array<Getter<T>>,
	effect: (values: T | Array<T>, previousValues: T | undefined | Array<T | undefined>) => void | VoidFunction,
	options?: Options
): Attachment {
	const { lazy = false } = options ?? {};

	let active = !lazy;

	// watch(() => [a, b], ([a, b], [prevA, prevB]) => { ... });
	let previousValues: T | undefined | Array<T | undefined> = Array.isArray(sources) ? [] : undefined;

	return (element) => {
		// 1. Değerleri oku (Tracking aşaması)
		const values = Array.isArray(sources) ? sources.map((source) => source()) : sources();

		// 2. Lazy kontrolü
		// normalde $effect rune bileşen ilk yüklendiğinde çalışır. eğer `lazy` true ise callback/effect ilk yüklendiğinde çalışmaz.
		// Eğer lazy aktifse, ilk çalışma anında active değişkeni true yapılır ve effect fonksiyonu çalıştırılmadan return edilir. Bir sonraki değişimde active artık true olduğu için efekt çalışacaktır.
		if (!active) {
			active = true;
			previousValues = values;
			return;
		}
		// 3. Callback/effect çalıştırma
		// 1.Efekt tekrar çalışmadan hemen önce çalışır. (Yani izlenen değer tekrar değiştiğinde).
		// 2.Bileşen yok edildiğinde çalışır. (Bileşenden ayrıldığınızda).
		// const cleanup = untrack(() => effect(values));
		const cleanup = untrack(() => {
			// console.log('2. ADIM: Effect şu an çalışıyor...');
			effect(values, previousValues);
			return () => {
				// console.log('GELECEK ADIM: Ben temizlik fonksiyonuyum, sonra çalışacağım.');
			};
		});

		previousValues = values;

		return cleanup;
	};
}
