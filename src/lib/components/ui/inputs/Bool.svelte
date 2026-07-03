<script lang="ts">
	import { untrack } from 'svelte';
	import { on } from 'svelte/events';
	import type { BoolProps, BoolValueChangeArgs } from './type';

	let { value = $bindable(false), text, id, name, disabled = false, readonly = false, onValueChange, class: classes = '', ...rest }: BoolProps = $props();

	const componentId = $props.id();

	const labelFor = $derived(`slc_${componentId}${name || ''}${id || ''}_bool`);

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
	class="inline-flex items-center gap-3 select-none group {classes} {disabled
		? 'cursor-not-allowed opacity-50'
		: readonly
			? 'cursor-default'
			: 'cursor-pointer'}"
>
	<button
		bind:this={button}
		type="button"
		role="switch"
		aria-checked={value}
		aria-label={text || 'Boolean toggle button'}
		disabled={disabled || readonly}
		class="{value ? 'bg-success-400 border-success-600' : 'bg-surface-200 border-surface-400'}
			{!disabled && !readonly
			? value
				? 'group-hover:bg-success-500 group-hover:border-success-700'
				: 'group-hover:bg-surface-300 group-hover:border-surface-500'
			: ''}
			{disabled ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''}
			{readonly ? 'cursor-default' : 'cursor-pointer'}
			relative h-6 w-11 rounded-md border overflow-hidden py-1 px-0.5"
		{@attach buttonClick}
		{...rest}
	>
		<span
			class="bg-surface-800 pointer-events-none flex h-full w-1/2 items-center justify-center overflow-hidden rounded-md shadow transition-transform"
			class:translate-x-full={value}
		></span>
	</button>

	{#if text}
		<span class="text-sm font-medium text-surface-900">{text}</span>
	{/if}
</div>
