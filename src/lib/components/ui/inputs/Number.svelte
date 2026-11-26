<script lang="ts" generics="N extends boolean = false">
	import { inputClasses } from './common.js';
	import { on } from 'svelte/events';
	import type { NumberProps, NumberValue, NumberValueChangeArgs } from './type.js';

	let {
		value = $bindable(0),
		class: classes = '',
		status = 'default',
		size = 'md',
		disabled = false,
		dev = false,
		autoChangeDecimalSeparator = true,
		nullable = false as N,
		onValueChange,
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
			if (value === null || value === undefined || Number.isNaN(value)) {
				if (value !== empty()) value = empty();
			}

			let currentValue = value;

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

	// ############################### BEGIN decimalSeparator ###############################
	const universalDecimalSeparator = '.';
	const localDecimalSeparator = (1.1).toLocaleString()[1];
	const needToConvert = $derived(autoChangeDecimalSeparator && universalDecimalSeparator !== localDecimalSeparator);

	// Yerel ayracı ekler. Başarısızsa (execCommand false döndürebilir) false: çağıran varsayılan davranışı engellemez,
	// tarayıcının kendi girişi kalır (Chrome number input'ta nokta da ondalık ayracıdır). Önceden önce engellenip sonra
	// ekleniyordu; ekleme başarısız olunca ayraç kayboluyordu ('12.5' → 125).
	type CustomDoc = { execCommand: (commandId: string, showUI?: boolean, value?: string) => boolean };
	const insertText = (text: string) => (document as unknown as CustomDoc).execCommand('insertText', false, text);

	const decimalSeparator = (node: HTMLElement) => {
		if (!needToConvert) return;

		const destroyKeydown = on(node, 'keydown', (e: KeyboardEvent) => {
			if (e.key === universalDecimalSeparator && insertText(localDecimalSeparator)) e.preventDefault();
		});

		const destroyPaste = on(node, 'paste', (e: ClipboardEvent) => {
			const pastedText = e.clipboardData?.getData('text');
			// Yapıştırılan metindeki noktalar yerel ayraca (virgül) çevrilir
			if (pastedText?.includes(universalDecimalSeparator) && insertText(pastedText.replaceAll(universalDecimalSeparator, localDecimalSeparator))) {
				e.preventDefault();
			}
		});

		return () => {
			destroyKeydown();
			destroyPaste();
		};
	};
	// ############################### END decimalSeparator ###############################
</script>

<input
	bind:value={proxy.value}
	type="number"
	{disabled}
	class="{classes} {inputClasses.base} {inputClasses.variants[status]} {inputClasses.sizes[size]}"
	{@attach needToConvert && decimalSeparator}
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
