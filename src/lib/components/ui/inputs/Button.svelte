<script lang="ts">
	import Icon from '$lib/components/icons/Icon.svelte';
	import type { ButtonProps } from './type';

	let {
		variant = 'light',
		color = 'primary',
		size = 'md',
		label = '',
		startIcon,
		endIcon,
		icon,
		iconOnly = false,
		type = 'button',
		class: classes = '',
		children,
		...rest
	}: ButtonProps = $props();

	// Temel buton sınıfları (geçiş efekti yok)
	const baseClasses =
		'inline-flex items-center justify-center font-semibold select-none cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 border';

	// Boyut sınıfları
	const sizeClasses = $derived(
		{
			sm: iconOnly ? 'h-8 w-8 rounded-md' : 'text-xs px-3 py-1.5 rounded-md gap-1.5',
			md: iconOnly ? 'h-10 w-10 rounded-md' : 'text-sm px-4 py-2 rounded-md gap-2',
			lg: iconOnly ? 'h-12 w-12 rounded-lg' : 'text-base px-5 py-2.5 rounded-lg gap-2.5'
		}[size]
	);

	// İkon boyutları (px)
	const iconSize = $derived(
		{
			sm: 16,
			md: 20,
			lg: 24
		}[size]
	);

	// Renk paleti eşlemeleri (Normal, Hover, Active durumları dahil)
	const colorClasses = $derived(
		{
			filled: {
				primary:
					'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-surface-50 border-primary-600 hover:border-primary-700 active:border-primary-800',
				secondary:
					'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-secondary-50 border-secondary-500 hover:border-secondary-600 active:border-secondary-700',
				tertiary:
					'bg-tertiary-500 hover:bg-tertiary-600 active:bg-tertiary-700 text-surface-50 border-tertiary-500 hover:border-tertiary-600 active:border-tertiary-700',
				quaternary:
					'bg-quaternary-500 hover:bg-quaternary-600 active:bg-quaternary-700 text-quaternary-50 border-quaternary-500 hover:border-quaternary-600 active:border-quaternary-700',
				surface:
					'bg-surface-700 hover:bg-surface-800 active:bg-surface-900 text-surface-50 border-surface-700 hover:border-surface-800 active:border-surface-900',
				success:
					'bg-success-500 hover:bg-success-600 active:bg-success-700 text-success-50 border-success-500 hover:border-success-600 active:border-success-700',
				warning:
					'bg-warning-500 hover:bg-warning-600 active:bg-warning-700 text-warning-50 border-warning-500 hover:border-warning-600 active:border-warning-700',
				error: 'bg-error-500 hover:bg-error-600 active:bg-error-700 text-surface-50 border-error-500 hover:border-error-600 active:border-error-700',
				info: 'bg-info-500 hover:bg-info-600 active:bg-info-700 text-surface-50 border-info-500 hover:border-info-600 active:border-info-700'
			},
			light: {
				primary: 'bg-primary-200 hover:bg-primary-300 active:bg-primary-400 text-primary-950 border-transparent',
				secondary: 'bg-secondary-200 hover:bg-secondary-300 active:bg-secondary-400 text-secondary-950 border-transparent',
				tertiary: 'bg-tertiary-200 hover:bg-tertiary-300 active:bg-tertiary-400 text-tertiary-950 border-transparent',
				quaternary: 'bg-quaternary-200 hover:bg-quaternary-300 active:bg-quaternary-400 text-quaternary-950 border-transparent',
				surface: 'bg-surface-200 hover:bg-surface-300 active:bg-surface-400 text-surface-950 border-transparent',
				success: 'bg-success-200 hover:bg-success-300 active:bg-success-400 text-success-950 border-transparent',
				warning: 'bg-warning-200 hover:bg-warning-300 active:bg-warning-400 text-warning-950 border-transparent',
				error: 'bg-error-200 hover:bg-error-300 active:bg-error-400 text-error-950 border-transparent',
				info: 'bg-info-200 hover:bg-info-300 active:bg-info-400 text-info-950 border-transparent'
			},
			ghost: {
				primary: 'bg-transparent hover:bg-primary-100 active:bg-primary-200 text-primary-600 active:text-primary-700 border-transparent',
				secondary: 'bg-transparent hover:bg-secondary-100 active:bg-secondary-200 text-secondary-600 active:text-secondary-700 border-transparent',
				tertiary: 'bg-transparent hover:bg-tertiary-100 active:bg-tertiary-200 text-tertiary-600 active:text-tertiary-700 border-transparent',
				quaternary: 'bg-transparent hover:bg-quaternary-100 active:bg-quaternary-200 text-quaternary-600 active:text-quaternary-700 border-transparent',
				surface: 'bg-transparent hover:bg-surface-100 active:bg-surface-200 text-surface-700 active:text-surface-800 border-transparent',
				success: 'bg-transparent hover:bg-success-100 active:bg-success-200 text-success-600 active:text-success-700 border-transparent',
				warning: 'bg-transparent hover:bg-warning-100 active:bg-warning-200 text-warning-600 active:text-warning-700 border-transparent',
				error: 'bg-transparent hover:bg-error-100 active:bg-error-200 text-error-600 active:text-error-700 border-transparent',
				info: 'bg-transparent hover:bg-info-100 active:bg-info-200 text-info-600 active:text-info-700 border-transparent'
			}
		}[variant][color]
	);
</script>

<button {type} class="{baseClasses} {sizeClasses} {colorClasses} {classes}" {...rest}>
	{#if iconOnly}
		{#if icon}
			<Icon name={icon} size={iconSize} />
		{/if}
	{:else}
		{#if startIcon}
			<Icon name={startIcon} size={iconSize} />
		{/if}

		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}

		{#if endIcon}
			<Icon name={endIcon} size={iconSize} />
		{/if}
	{/if}
</button>
