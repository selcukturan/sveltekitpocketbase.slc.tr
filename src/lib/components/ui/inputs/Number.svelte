<script lang="ts" generics="N extends boolean = false">
	import { untrack } from 'svelte';
	import { inputClasses } from './common.js';
	import type { NumberProps, NumberValue, NumberValueChangeArgs } from './type.js';

	let {
		value = $bindable(0),
		class: classes = '',
		status = 'default',
		size = 'md',
		disabled = false,
		dev = false,
		nullable = false as N,
		onValueChange,
		oninput: userOnInput,
		...rest
	}: NumberProps<N> = $props();
	// nullable: boş alan null (ör. filtre: boş = filtre yok, 0 = en az 0). Varsayılan: boş alan 0 (PocketBase sayı alanı)
	const empty = () => (nullable ? null : 0) as NumberValue<N>;

	// ############################### BEGIN ONVALUECHANGE HANDLER ###############################
	const triggerChange = ({ value, beforeValue, initial }: NumberValueChangeArgs<N>) => {
		onValueChange?.({ value, beforeValue, initial });
	};
	// ############################### END ONVALUECHANGE HANDLER ###############################

	// ############################### BEGIN PROXY ###############################
	let first = true;
	let lastValue = value; // Son tetiklenen değeri takip eden değişken
	let isNull = false; // Girdinin boş olduğunu takip eden bayrak

	const proxy = {
		get value() {
			// Dışarıdan null, undefined veya NaN atanırsa boş değere (0 ya da nullable ise null) çekiyoruz
			const missing = value === null || value === undefined || Number.isNaN(value);
			if (missing && value !== empty()) value = empty();
			const currentValue = missing ? empty() : value; // atama her zaman tutmayabilir (prop üstten yeniden gelebilir)

			if (first) {
				// İlk yüklemede çalışır
				first = false;
				const tempBefore = lastValue;
				lastValue = currentValue;
				triggerChange({ value: currentValue, beforeValue: tempBefore, initial: true });
			} else if (currentValue !== lastValue) {
				// Dışarıdan (örneğin shadow input veya buton ile) değer değiştiğinde yakalar
				isNull = false;
				const tempBefore = lastValue;
				lastValue = currentValue;
				triggerChange({ value: currentValue, beforeValue: tempBefore, initial: false });
			}
			return isNull ? null : currentValue;
		},
		set value(v) {
			const isInputEmpty = v === null || v === undefined || Number.isNaN(v);
			isNull = isInputEmpty;
			const newValue = isInputEmpty ? empty() : v;

			if (newValue !== value) {
				// Kullanıcı doğrudan bu input içine yazdığında tetiklenir
				const tempBefore = lastValue;
				value = newValue;
				lastValue = value;
				triggerChange({ value, beforeValue: tempBefore, initial: false });
			}
		}
	};
	// ############################### END PROXY ###############################

	// ############################### BEGIN INPUT <-> DEĞER ###############################
	// bind:value kullanılmaz: Svelte'in bağlaması her tuştan sonra `await tick()` bekleyip değeri yeniden yazar. Async
	// modda (form doğrulaması sürerken) bu bekleme uzar; önceki tuşun işleyicisi sonradan çalışıp eski değeri görünce
	// input'a '' yazıyor ve yazılan metin kayboluyordu ('12.5' → 5 ya da 125). Burada:
	// - Yazarken (oninput): değer input'tan okunur. Geçersiz/yarım metinde tarayıcı '' verir → boş (null/0).
	// - Dışarıdan değişince ($effect): input'a yalnızca gösterdiğinden farklıysa yazılır. Değer boşken input'ta yarım
	//   metin varsa (badInput, örn. '12.' ya da '1-2') dokunulmaz: kullanıcı hâlâ yazıyordur.
	let el = $state<HTMLInputElement>();
	const parse = (node: HTMLInputElement) => (node.value === '' ? null : node.valueAsNumber);

	const onInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		proxy.value = parse(e.currentTarget) as NumberValue<N>;
		userOnInput?.(e);
	};

	$effect(() => {
		const next = proxy.value;
		if (!el) return;
		untrack(() => {
			if (!el || next === parse(el) || (next === null && el.validity.badInput)) return;
			el.value = next === null ? '' : String(next);
		});
	});

	// Sunucu çiziminde (ve ilk karede) görünen metin
	// svelte-ignore state_referenced_locally
	const initialText = value === null || value === undefined || Number.isNaN(value) ? (nullable ? '' : '0') : String(value);
	// ############################### END INPUT <-> DEĞER ###############################

	// Ondalık ayracı tarayıcıya bırakılır (type="number"): değer her zaman sayıdır, gösterim tarayıcının yerel ayarına göre.
	// Önceden nokta tuşu execCommand ile yerel ayraca (virgül) çevriliyordu; tutarsız çalıştığı için kaldırıldı.
</script>

<input
	bind:this={el}
	type="number"
	value={initialText}
	oninput={onInput}
	{disabled}
	class="{classes} {inputClasses.base} {inputClasses.variants[status]} {inputClasses.sizes[size]}"
	{...rest}
/>

{#if dev}
	<p class="text-surface-500 text-xs">Component Value: {value}</p>
{/if}

<style>
	/* WebKit tabanlı tarayıcılar (Chrome, Safari, Edge, Opera) için yukarı/aşağı okları gizler */
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox için yukarı/aşağı okları gizler */
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
