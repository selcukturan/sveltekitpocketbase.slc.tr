<script lang="ts">
	import { inputClasses } from './common';
	import type { TextareaProps, TextareaValueChangeArgs } from './type';

	let {
		value = $bindable(''),
		class: classes = '',
		status = 'default',
		size = 'md',
		disabled = false,
		dev = false,
		onValueChange,
		...rest
	}: TextareaProps = $props();

	// ############################### BEGIN ONVALUECHANGE HANDLER ###############################
	const triggerChange = ({ value, beforeValue, initial }: TextareaValueChangeArgs) => {
		onValueChange?.({ value, beforeValue, initial });
	};
	// ############################### END ONVALUECHANGE HANDLER ###############################

	// ############################### BEGIN PROXY ###############################
	let first = true;
	let lastValue = value; // Son tetiklenen değeri takip eden değişken
	const proxy = {
		get value() {
			const currentValue = value;
			if (first) {
				// İlk yüklemede çalışır
				first = false;
				const tempBefore = lastValue;
				lastValue = currentValue;
				triggerChange({ value: currentValue, beforeValue: tempBefore, initial: true });
			} else if (currentValue !== lastValue) {
				// Dışarıdan (örneğin shadow input veya buton ile) değer değiştiğinde yakalar
				const tempBefore = lastValue;
				lastValue = currentValue;
				triggerChange({ value: currentValue, beforeValue: tempBefore, initial: false });
			}
			return currentValue;
		},
		set value(v) {
			if (v !== value) {
				// Kullanıcı doğrudan bu input içine yazdığında tetiklenir
				const tempBefore = lastValue;
				value = v;
				lastValue = value;
				triggerChange({ value, beforeValue: tempBefore, initial: false });
			}
		}
	};
	// ############################### END PROXY ###############################
</script>

<textarea bind:value={proxy.value} {disabled} {...rest} class="{classes} {inputClasses.base} {inputClasses.variants[status]} {inputClasses.sizes[size]}"
></textarea>

{#if dev}
	<p class="text-xs text-surface-500">Component Value: {value}</p>
{/if}
