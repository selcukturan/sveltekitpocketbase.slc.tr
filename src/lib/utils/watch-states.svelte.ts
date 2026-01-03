// https://github.com/svecosystem/runed/blob/main/packages/runed/src/lib/utilities/watch/watch.svelte.ts#L24
import { untrack } from 'svelte';
type Getter<T> = () => T;
type Options = {
	lazy?: boolean;
};
// #######################################################################################
// Multiple sources için
export function watchState<T extends Array<unknown>>(
	sources: { [K in keyof T]: Getter<T[K]> },
	effect: (values: T, previousValues: { [K in keyof T]: T[K] | undefined }) => void | VoidFunction,
	options?: Options
): void;

// Single source için
export function watchState<T>(
	source: Getter<T>,
	effect: (value: T, previousValue: T | undefined) => void | VoidFunction,
	options?: Options
): void;

// Main entry point
export function watchState<T>(
	sources: Getter<T> | Array<Getter<T>>,
	effect: (values: T | Array<T>, previousValues: T | undefined | Array<T | undefined>) => void | VoidFunction,
	options?: Options
): void {
	const { lazy = false } = options ?? {};

	let active = !lazy;

	// watchState(() => [a, b], ([a, b], [prevA, prevB]) => { ... });
	let previousValues: T | undefined | Array<T | undefined> = Array.isArray(sources) ? [] : undefined;

	$effect(() => {
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
	});
}
