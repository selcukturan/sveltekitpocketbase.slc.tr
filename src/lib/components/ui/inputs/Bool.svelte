<script lang="ts">
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import type { BoolProps, BoolValueChangeArgs } from './type';

	let { value = $bindable(false), text, id, name, disabled = false, readonly = false, onValueChange, class: classes = '', ...rest }: BoolProps = $props();

	const componentId = $props.id();

	const textId = `slc_${componentId}_bool_text`;

	let button = $state<HTMLButtonElement>();

	// ############################### BEGIN ONVALUECHANGE HANDLER ###############################
	const triggerChange = ({ value, beforeValue, initial }: BoolValueChangeArgs) => {
		onValueChange?.({ value, beforeValue, initial });
	};
	// ############################### END ONVALUECHANGE HANDLER ###############################

	// ############################### BEGIN PROXY ###############################
	let initial = true;
	let beforeValue = value;
	const watchValueChange = () => {
		void value;
		return untrack(() => {
			triggerChange({ value, beforeValue, initial });
			beforeValue = value;
			if (initial) initial = false;
		});
	};
	// ############################### END PROXY ###############################

	// ############################### BEGIN TOGGLE ###############################
	const divClick = (node: HTMLElement) => {
		return on(node, 'click', (e: MouseEvent) => {
			if (disabled || readonly) return;
			const target = e.target as HTMLElement;
			// Tıklama doğrudan buton üzerindeyse, butonun kendi click handler'ı çalışsın.
			if (target.closest('button')) {
				return;
			}
			// Eğer bu bileşen dışarıdan bir <label> içine sarılmışsa, tarayıcı metne/div'e
			// tıklandığında otomatik olarak butona da tık olayı gönderecektir (synthetic click).
			// Çift tetiklemeyi önlemek için bu durumda div düzeyindeki tıklamayı görmezden geliyoruz.
			if ((e.currentTarget as HTMLElement).closest('label')) {
				return;
			}
			// Label içinde değilsek, metne/div'e tıklandığında butonu tetikliyoruz.
			button?.click();
		});
	};
	const buttonClick = (node: HTMLElement) => {
		return on(node, 'click', (e: MouseEvent) => {
			e.stopPropagation();
			if (disabled || readonly) return;
			value = !value;
			node.focus();
		});
	};
	// ############################### END TOGGLE ###############################
</script>

<div
	{@attach divClick}
	{@attach watchValueChange}
	class="group inline-flex items-center gap-3 select-none {classes} {disabled ? 'cursor-not-allowed opacity-50' : readonly ? 'cursor-default' : 'cursor-pointer'}"
>
	<button
		bind:this={button}
		{id}
		type="button"
		role="switch"
		aria-checked={value}
		aria-describedby={text ? textId : undefined}
		disabled={disabled || readonly}
		class="{value ? 'bg-primary-500' : 'bg-surface-300'}
			{!disabled && !readonly ? (value ? 'group-hover:bg-primary-400' : 'group-hover:bg-surface-400') : ''}
			{disabled ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''}
			{readonly ? 'cursor-default' : 'cursor-pointer'}
			relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors"
		{@attach buttonClick}
		{...rest}
	>
		<!-- Anahtar: hap biçiminde iz, beyaz düğme; açıkken marka rengi -->
		<span class="bg-surface-token-50 pointer-events-none size-4 rounded-full shadow-sm transition-transform" class:translate-x-4={value}></span>
	</button>

	{#if text}
		<span id={textId} class="text-surface-800 text-sm">{text}</span>
	{/if}
</div>
