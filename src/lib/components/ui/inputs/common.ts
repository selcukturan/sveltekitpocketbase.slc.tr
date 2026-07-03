export const inputClasses = {
	// Temel yapı, hizalama, tipografi ve genel durumlar
	base: 'm-0 block w-full min-w-0 disabled:cursor-not-allowed disabled:opacity-50',

	// Durum (Variant) renkleri ve etkileşim durumları (Normal, Hover)
	variants: {
		default: 'bg-surface-100 hover:bg-surface-200/70 hover:border-surface-400/70 border-surface-300 border text-surface-900 placeholder-surface-400',
		success: 'bg-success-100 hover:bg-success-200/70 hover:border-success-400/70 border-success-300 border text-success-900 placeholder-success-400',
		error: 'bg-error-100 hover:bg-error-200/70 hover:border-error-400/70 border-error-300 border text-error-900 placeholder-error-400',
		warning: 'bg-warning-100 hover:bg-warning-200/70 hover:border-warning-400/70 border-warning-300 border text-warning-900 placeholder-warning-400',
		info: 'bg-info-100 hover:bg-info-200/70 hover:border-info-400/70 border-info-300 border text-info-900 placeholder-info-400'
	},

	// Boyutlandırma varyasyonları (padding, yazı boyutu, köşe yuvarlatma)
	sizes: {
		sm: 'px-3 py-1 text-sm rounded',
		md: 'px-3.5 py-1.5 text-base rounded-md',
		lg: 'px-4 py-2.5 text-lg rounded-lg'
	}
};
