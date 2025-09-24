import * as pbf from '@nedpals/pbf';

export class Counter {
	#count = $state(0);
	double = $derived(this.#count * 2);

	// `$effect()` yerine `getter` ve `setter` kullanarak reaktif işlemlerde `side effect` yapılabilir.
	get count() {
		// ----- değer atandıktan hemen sonra çalışır. (initial değer dahil) - (başlangıç değeri de dahil olan en güncel $state değeri burada okunabilir. )
		console.log('1 - ', this.#count);
		// ----- değer okunmadan hemen önce çalışır.
		console.log('2 - ', this.#count);
		return this.#count;
	}
	set count(v) {
		// ----- değer atanmadan hemen önce çalışır.
		console.log('3 - ', this.#count);

		this.#count = v;

		// ----- değer atandıktan hemen sonra çalışır. get count()'u tetikler. (initial değer hariç) - (başlangıç değeri `#count` hidden olarak atandığı için burada okunamaz. burası ilk `this.count` atamasından sonra çalışır ve o zaman okunabilir.)
		console.log('4 - ', this.#count);
	}

	increment = () => {
		this.count += 1;
	};
}
