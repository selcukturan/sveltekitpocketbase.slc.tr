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
	private set count(v) {
		// ----- değer atanmadan hemen önce çalışır.
		console.log('3 - ', this.#count);

		this.#count = v;

		// ----- değer atandıktan hemen sonra çalışır. get count()'u tetikler. (initial değer hariç) - (başlangıç değeri `#count` hidden olarak atandığı için burada okunamaz. burası ilk `this.count` atamasından sonra çalışır ve o zaman okunabilir.)
		console.log('4 - ', this.#count);
	}

	// Bir metodu bir event handler (olay yöneticisi) veya callback olarak başka bir bileşene veya API'ye geçireceğiniz zaman idealdir. Bu, this bağlamını manuel olarak bind() etmek zorunda kalmadan korur.
	increment = () => {
		this.count += 1;
	};

	// Eğer metodu sadece sınıf içindeki diğer metodlar tarafından çağrılacaksa veya doğrudan instance.method() şeklinde çağrılacaksa, bu daha temiz ve prototip tabanlı yapıyı koruyan bir yaklaşımdır.
	test() {
		return 'test';
	}
}

/* 
<script lang="ts">
	import { Counter } from '$lib/app/counter.svelte';
	const counter = new Counter();
</script>
<button onclick={counter.increment} class="bg-warning-300 p-3">
    count: {counter.count} | double: {counter.double}
</button>
*/

/*
const params = useSearchParams(productSearchSchema);
// Access parameters directly
const page = $derived(params.page); // number (defaults to 1)
const sort = $derived(params.sort); // 'newest' | 'oldest' | 'price'
 
// Update parameters directly
params.page = 2; // Updates URL to include ?page=2
// Updates URL to include ?page=3&sort=oldest
params.update({ page: 3, sort: 'oldest' });
// Resets all parameters to their default values
params.reset();
// Returns URLSearchParams object with all current parameter values
params.toURLSearchParams();
*/
export function createCounter(schema: any) {
	let params = $state({
		page: 1,
		sort: 'newest',
		filter: {
			title: 'test',
			quantity: 10
		}
	});

	/* let count = $state(0);
	const double = $derived(count * 2);

	function increment() {
		count++;
	} */

	return {
		...params,
		update(newParams: any) {
			console.log('update', newParams);
		},
		reset() {
			console.log('reset');
		}
		/* count,
		double,
		increment */
	};
}
